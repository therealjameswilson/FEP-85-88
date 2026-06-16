const persons = window.PERSONS || [];

const state = {
  query: "",
  scope: "",
  source: "",
  review: ""
};

const nodes = {
  buildNote: document.querySelector("#persons-build-note"),
  root: document.querySelector("#persons-root"),
  summary: document.querySelector("#person-summary"),
  search: document.querySelector("#person-search"),
  scopeFilter: document.querySelector("#person-scope-filter"),
  sourceFilter: document.querySelector("#person-source-filter"),
  reviewFilter: document.querySelector("#person-review-filter"),
  clearFilters: document.querySelector("#clear-person-filters"),
  copyView: document.querySelector("[data-copy-person-view]"),
  copyReview: document.querySelector("#copy-person-review"),
  exportPersons: document.querySelector("#export-persons")
};

const viewFields = [
  { key: "query", param: "personq", node: nodes.search },
  { key: "scope", param: "pscope", node: nodes.scopeFilter },
  { key: "source", param: "psource", node: nodes.sourceFilter },
  { key: "review", param: "preview", node: nodes.reviewFilter }
];

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function addOptions(select, values, label) {
  select.replaceChildren(new Option(label, ""), ...values.map((value) => new Option(value, value)));
}

function plural(count, singular, pluralValue = `${singular}s`) {
  return `${count} ${count === 1 ? singular : pluralValue}`;
}

function searchText(person) {
  return [
    person.entry,
    person.displayName,
    person.description,
    person.aliases?.join(" "),
    person.source,
    person.authorityStatus,
    person.reviewReason,
    person.needsReview ? "needs review compiler normalization" : "authority match",
    person.scopes?.join(" "),
    person.places?.join(" ")
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesQuery(person) {
  const terms = state.query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);
  if (!terms.length) return true;
  const haystack = searchText(person);
  return terms.every((term) => haystack.includes(term));
}

function filteredPersons() {
  return persons.filter((person) => {
    if (!matchesQuery(person)) return false;
    if (state.scope && !(person.scopes || []).includes(state.scope)) return false;
    if (state.source && person.source !== state.source) return false;
    if (state.review === "Needs review" && !person.needsReview) return false;
    if (state.review === "Authority match" && person.needsReview) return false;
    return true;
  });
}

function renderPersons() {
  const visible = filteredPersons().sort((a, b) => a.sortKey.localeCompare(b.sortKey) || a.entry.localeCompare(b.entry));
  const visibleReviewCount = visible.filter((person) => person.needsReview).length;
  const totalReviewCount = persons.filter((person) => person.needsReview).length;
  const reviewVerb = visibleReviewCount === 1 ? "needs" : "need";
  nodes.summary.textContent = `${plural(visible.length, "person")} visible from ${persons.length} Volume XXXVII candidates. ${plural(visibleReviewCount, "entry", "entries")} in this view ${reviewVerb} compiler review; ${totalReviewCount} total.`;

  if (!visible.length) {
    nodes.root.innerHTML = '<p class="empty">No persons match the current filters.</p>';
    return;
  }

  const groups = groupBy(visible, (person) => (person.sortKey || person.entry || "#").slice(0, 1).toUpperCase());
  nodes.root.replaceChildren(
    ...[...groups.entries()].map(([letter, group]) => {
      const section = document.createElement("section");
      section.className = "person-letter-section";
      section.id = `person-${letter.toLowerCase()}`;

      const heading = document.createElement("h3");
      heading.textContent = letter;

      const list = document.createElement("ul");
      list.className = "persons-list";
      for (const person of group) list.append(personItem(person));

      section.append(heading, list);
      return section;
    })
  );
}

function personItem(person) {
  const item = document.createElement("li");
  item.className = person.needsReview ? "person-review-needed" : "person-authority-match";

  const entry = document.createElement("p");
  entry.className = "person-entry";
  const name = document.createElement("strong");
  name.textContent = person.displayName || person.entry;
  entry.append(name);
  if (person.description) entry.append(`, ${person.description}`);

  const meta = document.createElement("p");
  meta.className = "person-meta";
  meta.textContent = [
    (person.scopes || []).join("; "),
    (person.places || []).join("; "),
    person.aliases?.length ? `aliases: ${person.aliases.join("; ")}` : "",
    person.needsReview ? `compiler review: ${person.reviewReason || "normalize before final copy"}` : "authority match"
  ]
    .filter(Boolean)
    .join(" | ");

  item.append(entry, meta);
  return item;
}

function groupBy(items, getter) {
  const groups = new Map();
  for (const item of items) {
    const key = getter(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return groups;
}

function toCsv(items, columns) {
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return [columns.map((column) => escape(column.label)).join(",")]
    .concat(items.map((item) => columns.map((column) => escape(column.value(item))).join(",")))
    .join("\n");
}

function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function fallbackCopyText(text) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.left = "-9999px";
  document.body.append(area);
  area.select();
  area.setSelectionRange(0, area.value.length);
  try {
    return document.execCommand("copy");
  } finally {
    area.remove();
  }
}

async function writeClipboardText(value) {
  const text = value || "";
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fall back for local/static browser contexts.
    }
  }
  return fallbackCopyText(text);
}

function selectHasValue(select, value) {
  return [...select.options].some((option) => option.value === value);
}

function setViewField(field, value) {
  const normalizedValue = value || "";
  if (field.node?.tagName === "SELECT" && normalizedValue && !selectHasValue(field.node, normalizedValue)) return;
  state[field.key] = normalizedValue;
  if (field.node) field.node.value = normalizedValue;
}

function restoreUrlState() {
  const params = new URLSearchParams(window.location.search);
  for (const field of viewFields) {
    if (params.has(field.param)) setViewField(field, params.get(field.param));
  }
}

function currentViewParams() {
  const params = new URLSearchParams();
  for (const field of viewFields) {
    const value = state[field.key] || "";
    if (value) params.set(field.param, value);
  }
  return params;
}

function syncUrlState() {
  if (!window.history?.replaceState) return;
  const url = new URL(window.location.href);
  url.search = currentViewParams().toString();
  url.hash = "persons-list-title";
  window.history.replaceState(null, "", url);
}

function personViewUrl() {
  const url = new URL(window.location.href);
  url.search = currentViewParams().toString();
  url.hash = "persons-list-title";
  return url.toString();
}

function scrollToCurrentHash() {
  const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height || 0;
  const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
  const targetTop = Math.max(0, top);
  window.scrollTo({ top: targetTop, behavior: "auto" });
  if (document.scrollingElement) document.scrollingElement.scrollTop = targetTop;
  document.documentElement.scrollTop = targetTop;
  document.body.scrollTop = targetTop;
  window.__frusLastHashScroll = { id, targetTop, headerHeight, at: Date.now() };
}

function scheduleCurrentHashScroll() {
  if (!window.location.hash) return;
  setTimeout(scrollToCurrentHash, 0);
  requestAnimationFrame(() => requestAnimationFrame(scrollToCurrentHash));
  [150, 500, 1000, 1800].forEach((delay) => setTimeout(scrollToCurrentHash, delay));
}

async function copyPersonViewUrl() {
  const label = "Copy View";
  let copied = false;
  try {
    copied = await writeClipboardText(personViewUrl());
  } catch (error) {
    copied = false;
  }
  nodes.copyView.textContent = copied ? "Copied" : "Copy failed";
  if (copied) nodes.copyView.dataset.copied = "true";
  else nodes.copyView.dataset.copyFailed = "true";
  setTimeout(() => {
    nodes.copyView.textContent = label;
    delete nodes.copyView.dataset.copied;
    delete nodes.copyView.dataset.copyFailed;
  }, 1200);
}

function personsReviewQueueText() {
  const reviewRows = filteredPersons()
    .filter((person) => person.needsReview)
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey) || a.entry.localeCompare(b.entry));
  const output = [
    "FRUS Volume XXXVII persons review queue",
    `Copied: ${new Date().toISOString().slice(0, 10)}`,
    `Filtered review entries: ${reviewRows.length} of ${persons.filter((person) => person.needsReview).length}`,
    ""
  ];

  if (!reviewRows.length) {
    output.push("No persons needing compiler review match the current filters.");
    return output.join("\n");
  }

  for (const person of reviewRows) {
    output.push(`${person.displayName || person.entry}`);
    output.push(`Entry: ${person.entry}`);
    output.push(`Description: ${person.description || "No description recorded."}`);
    output.push(`Scopes: ${(person.scopes || []).join("; ") || "Unscoped"}`);
    output.push(`Places: ${(person.places || []).join("; ") || "No place recorded"}`);
    if (person.aliases?.length) output.push(`Aliases: ${person.aliases.join("; ")}`);
    output.push(`Source: ${person.source || "No source label recorded"}`);
    output.push(`Authority status: ${person.authorityStatus || "Unspecified"}`);
    output.push(`Review reason: ${person.reviewReason || "Normalize before final copy."}`);
    output.push("");
  }

  return output.join("\n").trimEnd();
}

function setupEvents() {
  nodes.search.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderPersons();
    syncUrlState();
  });
  nodes.scopeFilter.addEventListener("change", (event) => {
    state.scope = event.target.value;
    renderPersons();
    syncUrlState();
  });
  nodes.sourceFilter.addEventListener("change", (event) => {
    state.source = event.target.value;
    renderPersons();
    syncUrlState();
  });
  nodes.reviewFilter.addEventListener("change", (event) => {
    state.review = event.target.value;
    renderPersons();
    syncUrlState();
  });
  nodes.clearFilters.addEventListener("click", () => {
    state.query = "";
    state.scope = "";
    state.source = "";
    state.review = "";
    nodes.search.value = "";
    nodes.scopeFilter.value = "";
    nodes.sourceFilter.value = "";
    nodes.reviewFilter.value = "";
    renderPersons();
    syncUrlState();
  });
  nodes.copyView.addEventListener("click", copyPersonViewUrl);
  document.addEventListener("DOMContentLoaded", scheduleCurrentHashScroll);
  window.addEventListener("load", scheduleCurrentHashScroll);
  window.addEventListener("hashchange", scheduleCurrentHashScroll);
  nodes.copyReview.addEventListener("click", async () => {
    const label = "Copy Review Queue";
    let copied = false;
    try {
      copied = await writeClipboardText(personsReviewQueueText());
    } catch (error) {
      copied = false;
    }
    nodes.copyReview.textContent = copied ? "Copied" : "Copy failed";
    if (copied) nodes.copyReview.dataset.copied = "true";
    else nodes.copyReview.dataset.copyFailed = "true";
    setTimeout(() => {
      nodes.copyReview.textContent = label;
      delete nodes.copyReview.dataset.copied;
      delete nodes.copyReview.dataset.copyFailed;
    }, 1200);
  });
  nodes.exportPersons.addEventListener("click", () => {
    downloadCsv(
      "frus-volume37-persons.csv",
      toCsv(filteredPersons(), [
        { label: "Name", value: (person) => person.displayName },
        { label: "Description", value: (person) => person.description },
        { label: "Entry", value: (person) => person.entry },
        { label: "Aliases", value: (person) => (person.aliases || []).join("; ") },
        { label: "Scopes", value: (person) => (person.scopes || []).join("; ") },
        { label: "Places", value: (person) => (person.places || []).join("; ") },
        { label: "Source", value: (person) => person.source },
        { label: "Authority Status", value: (person) => person.authorityStatus },
        { label: "Needs Review", value: (person) => (person.needsReview ? "Yes" : "No") },
        { label: "Review Reason", value: (person) => person.reviewReason }
      ])
    );
  });
}

function init() {
  const authorityCount = persons.filter((person) => /Reagan|published|official/i.test(person.source || "")).length;
  const reviewCount = persons.filter((person) => person.needsReview).length;
  nodes.buildNote.textContent = `${plural(authorityCount, "entry", "entries")} are anchored in Reagan-era official or published source text; ${plural(reviewCount, "entry", "entries")} use Volume XXXVII compiler normalization or fallback text.`;
  addOptions(nodes.scopeFilter, uniqueSorted(persons.flatMap((person) => person.scopes || [])), "All scopes");
  addOptions(nodes.sourceFilter, uniqueSorted(persons.map((person) => person.source)), "All sources");
  addOptions(nodes.reviewFilter, ["Needs review", "Authority match"], "All review states");
  restoreUrlState();
  renderPersons();
  setupEvents();
  scheduleCurrentHashScroll();
}

init();
