const meta = window.VOLUME_META || { chapters: [] };
const volumeConfig = meta.frusVolume || {};
const records = assignCompilerNumbers(window.VOLUME_RECORDS || []);
const boundaryRecords = assignBoundaryNumbers(window.BOUNDARY_RECORDS || []);
const policyFiles = window.POLICY_FILES || [];
const publicReferences = window.PUBLIC_REFERENCES || [];
const gapTracker = window.GAP_TRACKER || [];
const sourcePools = window.SOURCE_POOLS || [];
const requestPackets = window.REQUEST_PACKETS || [];
const selectionBoard = window.SELECTION_BOARD || [];
const chapterBriefs = window.CHAPTER_BRIEFS || [];
const sourceCopyLedger = window.SOURCE_COPY_LEDGER || [];
const chapters = meta.chapters || [];
const sourceNoteAudit = buildSourceNoteAudit();

const state = {
  records: {
    query: "",
    chapter: "",
    country: "",
    release: "",
    availability: ""
  },
  policy: {
    query: "",
    lane: "",
    priority: ""
  },
  public: {
    query: "",
    lane: ""
  },
  boundary: {
    query: "",
    country: ""
  },
  selections: {
    query: "",
    status: "",
    lane: ""
  },
  chapterBriefs: {
    query: "",
    lane: "",
    urgency: ""
  },
  gaps: {
    query: "",
    lane: "",
    priority: "",
    status: ""
  },
  sourcePools: {
    query: "",
    lane: "",
    priority: ""
  },
  requests: {
    query: "",
    repository: "",
    priority: ""
  },
  sourceNotes: {
    query: "",
    status: "",
    section: ""
  }
};

const nodes = {
  totalRecords: document.querySelector("#total-records"),
  totalPages: document.querySelector("#total-pages"),
  policyCount: document.querySelector("#policy-count"),
  publicCount: document.querySelector("#public-count"),
  boundaryCount: document.querySelector("#boundary-count"),
  workbenchRoot: document.querySelector("#workbench-root"),
  chapterGrid: document.querySelector("#chapter-grid"),
  recordsRoot: document.querySelector("#records-root"),
  recordsSummary: document.querySelector("#records-summary"),
  recordSearch: document.querySelector("#record-search"),
  chapterFilter: document.querySelector("#chapter-filter"),
  countryFilter: document.querySelector("#country-filter"),
  releaseFilter: document.querySelector("#release-filter"),
  availabilityFilter: document.querySelector("#availability-filter"),
  clearRecordFilters: document.querySelector("#clear-record-filters"),
  exportRecords: document.querySelector("#export-records"),
  policyRoot: document.querySelector("#policy-root"),
  policySummary: document.querySelector("#policy-summary"),
  policySearch: document.querySelector("#policy-search"),
  policyLaneFilter: document.querySelector("#policy-lane-filter"),
  policyPriorityFilter: document.querySelector("#policy-priority-filter"),
  clearPolicyFilters: document.querySelector("#clear-policy-filters"),
  exportPolicy: document.querySelector("#export-policy"),
  publicRoot: document.querySelector("#public-root"),
  publicSummary: document.querySelector("#public-summary"),
  publicSearch: document.querySelector("#public-search"),
  publicLaneFilter: document.querySelector("#public-lane-filter"),
  clearPublicFilters: document.querySelector("#clear-public-filters"),
  exportPublic: document.querySelector("#export-public"),
  boundaryRoot: document.querySelector("#boundary-root"),
  boundarySummary: document.querySelector("#boundary-summary"),
  boundarySearch: document.querySelector("#boundary-search"),
  boundaryCountryFilter: document.querySelector("#boundary-country-filter"),
  clearBoundaryFilters: document.querySelector("#clear-boundary-filters"),
  selectionRoot: document.querySelector("#selection-root"),
  selectionSummary: document.querySelector("#selection-summary"),
  selectionSearch: document.querySelector("#selection-search"),
  selectionStatusFilter: document.querySelector("#selection-status-filter"),
  selectionLaneFilter: document.querySelector("#selection-lane-filter"),
  clearSelectionFilters: document.querySelector("#clear-selection-filters"),
  exportSelections: document.querySelector("#export-selections"),
  chapterBriefRoot: document.querySelector("#chapter-brief-root"),
  chapterBriefSummary: document.querySelector("#chapter-brief-summary"),
  chapterBriefSearch: document.querySelector("#chapter-brief-search"),
  chapterBriefLaneFilter: document.querySelector("#chapter-brief-lane-filter"),
  chapterBriefUrgencyFilter: document.querySelector("#chapter-brief-urgency-filter"),
  clearChapterBriefFilters: document.querySelector("#clear-chapter-brief-filters"),
  exportChapterBriefs: document.querySelector("#export-chapter-briefs"),
  gapRoot: document.querySelector("#gap-root"),
  gapSummary: document.querySelector("#gap-summary"),
  gapSearch: document.querySelector("#gap-search"),
  gapLaneFilter: document.querySelector("#gap-lane-filter"),
  gapPriorityFilter: document.querySelector("#gap-priority-filter"),
  gapStatusFilter: document.querySelector("#gap-status-filter"),
  clearGapFilters: document.querySelector("#clear-gap-filters"),
  exportGaps: document.querySelector("#export-gaps"),
  sourcePoolRoot: document.querySelector("#source-pool-root"),
  sourcePoolSummary: document.querySelector("#source-pool-summary"),
  sourcePoolSearch: document.querySelector("#source-pool-search"),
  sourcePoolLaneFilter: document.querySelector("#source-pool-lane-filter"),
  sourcePoolPriorityFilter: document.querySelector("#source-pool-priority-filter"),
  clearSourcePoolFilters: document.querySelector("#clear-source-pool-filters"),
  exportSourcePools: document.querySelector("#export-source-pools"),
  requestRoot: document.querySelector("#request-root"),
  requestSummary: document.querySelector("#request-summary"),
  requestSearch: document.querySelector("#request-search"),
  requestRepositoryFilter: document.querySelector("#request-repository-filter"),
  requestPriorityFilter: document.querySelector("#request-priority-filter"),
  clearRequestFilters: document.querySelector("#clear-request-filters"),
  exportRequests: document.querySelector("#export-requests"),
  sourceNoteRoot: document.querySelector("#source-note-root"),
  sourceNoteSummary: document.querySelector("#source-note-summary"),
  sourceNoteSearch: document.querySelector("#source-note-search"),
  sourceNoteStatusFilter: document.querySelector("#source-note-status-filter"),
  sourceNoteSectionFilter: document.querySelector("#source-note-section-filter"),
  clearSourceNoteFilters: document.querySelector("#clear-source-note-filters"),
  exportSourceNotes: document.querySelector("#export-source-notes"),
  ledgerRoot: document.querySelector("#ledger-root"),
  ledgerSummary: document.querySelector("#ledger-summary")
};

function assignCompilerNumbers(items) {
  const counts = new Map();
  return [...items]
    .sort(byChapterThenDate)
    .map((item) => {
      const key = item.chapter?.name || "Regional and Multilateral";
      const count = (counts.get(key) || 0) + 1;
      counts.set(key, count);
      return {
        ...item,
        compilerNumber: `${volumeConfig.shortId || "XXXVII"}-${item.chapter?.number || 0}.${String(count).padStart(3, "0")}`
      };
    });
}

function assignBoundaryNumbers(items) {
  return [...items]
    .sort((a, b) => a.country.localeCompare(b.country) || a.sortDate.localeCompare(b.sortDate))
    .map((item, index) => ({ ...item, compilerNumber: `B-${String(index + 1).padStart(3, "0")}` }));
}

function byChapterThenDate(a, b) {
  return (
    (a.chapter?.number || 99) - (b.chapter?.number || 99) ||
    (a.sortDate || "").localeCompare(b.sortDate || "") ||
    (a.title || "").localeCompare(b.title || "")
  );
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function addOptions(select, values, label) {
  if (!select) return;
  select.replaceChildren(new Option(label, ""), ...values.map((value) => new Option(value, value)));
}

function plural(count, singular, pluralValue = `${singular}s`) {
  return `${count} ${count === 1 ? singular : pluralValue}`;
}

function searchText(item) {
  return [
    item.compilerNumber,
    item.identifier,
    item.title,
    item.documentTitle,
    item.country,
    item.chapter?.name,
    item.recordId,
    item.counterpart,
    item.naid,
    item.type,
    item.releaseStatus,
    item.frusSourceNote,
    item.sourceNote,
    item.diaryCrossReferenceNote,
    item.diaryReferences?.map((reference) => [reference.kind, reference.title, reference.naid, reference.sourceNote].join(" ")).join(" "),
    item.notes,
    item.lane,
    item.priority,
    item.reason,
    item.problem,
    item.evidence,
    item.needed,
    item.coverage,
    item.nextUse,
    item.repository,
    item.sourceWindow,
    item.requestType,
    item.purpose,
    item.exactAsk,
    item.requestText,
    item.sourceNoteStatus,
    item.sourceNoteTarget,
    item.nextStep,
    item.selectionRationale,
    item.boundaryRisk,
    item.annotationLead,
    item.sourceLead,
    item.workingTitle,
    item.thesis,
    item.documentSpine?.join(" "),
    item.mustHarvest?.join(" "),
    item.annotationQuestions?.join(" "),
    item.exclusionRules?.join(" "),
    item.firstDraftMove,
    item.unresolvedRisk,
    item.urgency,
    item.sourceTitle,
    item.sourceNote,
    item.section,
    item.assessment,
    item.flags?.join(" "),
    item.status,
    item.citation,
    item.matchedTerms?.join(" "),
    item.nextActions?.join(" "),
    item.targetTerms?.join(" "),
    item.sourcePools?.join(" ")
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function matchesQuery(item, query) {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);
  if (!terms.length) return true;
  const haystack = searchText(item);
  return terms.every((term) => haystack.includes(term));
}

function buildSourceNoteAudit() {
  const rows = [];
  const add = (section, item, note, options = {}) => {
    if (!note) return;
    const assessment = assessSourceNote(note, options);
    rows.push({
      section,
      assessment: assessment.status,
      flags: assessment.flags,
      sourceTitle: options.title || item.title || item.documentTitle || item.identifier || section,
      lane: options.lane || item.chapter?.name || item.lane || item.chapter || "Unassigned",
      dateText: options.dateText || item.dateText || item.date || item.sourceWindow || "",
      sourceNote: note,
      catalogUrl: options.catalogUrl || item.catalogUrl || item.govinfoUrl || item.url || "",
      pdfUrl: options.pdfUrl || item.pdfUrl || "",
      requestText: item.requestText || "",
      identifier: item.compilerNumber || item.identifier || item.naid || options.identifier || ""
    });
  };

  for (const item of records) add("Chronology", item, preferredSourceNote(item));
  for (const item of policyFiles) add("Policy Files", item, preferredSourceNote(item));
  for (const item of publicReferences) add("Public Line", item, preferredSourceNote(item));
  for (const item of boundaryRecords) add("Boundary", item, preferredSourceNote(item));
  for (const item of sourceCopyLedger) add("Source Ledger", item, preferredSourceNote(item));
  for (const item of requestPackets) {
    add("Request Packets", item, item.sourceNoteTarget, {
      title: item.title,
      lane: item.lane,
      dateText: item.sourceWindow,
      catalogUrl: item.catalogUrl,
      pdfUrl: item.pdfUrl
    });
  }

  return rows.map((row, index) => ({ ...row, auditId: `SN-${String(index + 1).padStart(3, "0")}` }));
}

function assessSourceNote(note) {
  const flags = [];
  const trimmed = String(note || "").trim();
  const hasPlaceholder = /\[[^\]]+\]/.test(trimmed);
  const isSource = trimmed.startsWith("Source:");
  const isTarget = trimmed.startsWith("Source-note target:");
  const isReference =
    trimmed.startsWith("Foreign Relations of the United States") ||
    trimmed.startsWith("See source-base precedent") ||
    /to be normalized after archival target is confirmed/i.test(trimmed);
  const hasFinalPunctuation = /[.!?]$/.test(trimmed);
  const needsReaganClassification = isSource && /Source: Reagan Library/.test(trimmed) && !/Public Papers|Daily Diary/i.test(trimmed);
  const hasClassification =
    /\b(Secret|Confidential|No classification marking|Limited Official Use|Unclassified)\.$/i.test(trimmed) ||
    /\bNo classification marking\./i.test(trimmed);

  if (isTarget) flags.push("Target note: do not publish until box/folder/document details are verified.");
  if (hasPlaceholder) flags.push("Contains unresolved bracket placeholder.");
  if (!hasFinalPunctuation) flags.push("Needs final punctuation.");
  if (isSource && hasPlaceholder) flags.push("Copy-ready prefix used with unresolved placeholder.");
  if (needsReaganClassification && !hasClassification) flags.push("Verify classification or handling line before publication.");
  if (!isSource && !isTarget && !isReference) flags.push("Non-standard source-note prefix.");
  if (/^Source: Public Papers of the Presidents of the United States: Ronald Reagan\.$/.test(trimmed)) {
    flags.push("Collection-level Public Papers note; replace with document-level citation when selecting a document.");
  }

  if (flags.some((flag) => /Copy-ready prefix|punctuation|classification|Non-standard|Collection-level/i.test(flag))) {
    return { status: "Needs review", flags };
  }
  if (isTarget || hasPlaceholder) return { status: "Target", flags };
  if (isReference) return { status: "Reference", flags };
  if (isSource) return { status: "Ready", flags: flags.length ? flags : ["Copy-ready format; still verify against source image before publication."] };
  return { status: "Needs review", flags };
}

function setStats() {
  nodes.totalRecords.textContent = records.length.toString();
  nodes.totalPages.textContent = records.filter((record) => record.documentAvailable).length.toString();
  nodes.policyCount.textContent = policyFiles.filter((file) => file.priority !== "Boundary").length.toString();
  nodes.publicCount.textContent = publicReferences.length.toString();
  nodes.boundaryCount.textContent = boundaryRecords.length.toString();
}

function renderWorkbench() {
  const openReferences = records.filter((record) => record.documentAvailable);
  const summitRecords = records.filter((record) => /Summit|Industrialized/i.test(record.chapter?.name || record.title || ""));
  const nonBoundaryPolicy = policyFiles.filter((file) => file.priority !== "Boundary");
  const criticalGaps = gapTracker.filter((gap) => gap.priority === "Critical");
  const criticalRequests = requestPackets.filter((item) => item.priority === "Critical");
  const draftSelections = selectionBoard.filter((item) => item.status === "Draft candidate");
  const sourceMix = topCounts(records, (record) => record.source?.series || "Catalog item")
    .slice(0, 3)
    .map(([label, count]) => `${count} ${label}`)
    .join("; ");

  nodes.workbenchRoot.replaceChildren(
    metricCard("Chronology leads", records.length, `${openReferences.length} open web/PDF anchors across NSDDs, summit records, and Public Papers.`),
    metricCard("Selection calls", selectionBoard.length, `${draftSelections.length} draft candidates and ${criticalRequests.length} critical archive asks are ready for compiler triage.`),
    metricCard("Summit spine", summitRecords.length, "Tokyo, Venice, Toronto, and G-7 preparation records to anchor industrialized-country cooperation."),
    metricCard("Policy anchors", nonBoundaryPolicy.length, `Finding aids and source pools for NSC, WHORM, Public Papers, Treasury, and diary checks. ${sourceMix}`),
    metricCard("Open critical gaps", criticalGaps.length, `${gapTracker.length} total gap-tracker items now drive the next source harvest.`)
  );
}

function metricCard(label, value, detail) {
  const card = document.createElement("article");
  card.className = "metric-card";
  const strong = document.createElement("strong");
  strong.textContent = value.toString();
  const span = document.createElement("span");
  span.textContent = label;
  const paragraph = document.createElement("p");
  paragraph.textContent = detail;
  card.append(strong, span, paragraph);
  return card;
}

function renderChapters() {
  nodes.chapterGrid.replaceChildren(
    ...chapters.map((chapter) => {
      const chapterRecords = records.filter((record) => record.chapter?.name === chapter.name);
      const card = document.createElement("a");
      card.className = "chapter-card";
      card.href = "#records";
      card.dataset.chapter = chapter.name;
      const number = document.createElement("p");
      number.className = "chapter-number";
      number.textContent = `Lane ${chapter.number}`;
      const title = document.createElement("h3");
      title.textContent = chapter.name;
      const count = document.createElement("p");
      count.className = "chapter-count";
      count.textContent = `${plural(chapterRecords.length, "lead")} / ${plural(chapterRecords.filter((record) => record.documentAvailable).length, "open source")}`;
      const description = document.createElement("p");
      description.textContent = chapter.description;
      const action = document.createElement("span");
      action.className = "chapter-action";
      action.textContent = "Filter chronology";
      card.append(number, title, count, description, action);
      card.addEventListener("click", () => {
        state.records.chapter = chapter.name;
        nodes.chapterFilter.value = chapter.name;
        renderRecords();
      });
      return card;
    })
  );
}

function filteredGaps() {
  return gapTracker.filter((gap) => {
    if (!matchesQuery(gap, state.gaps.query)) return false;
    if (state.gaps.lane && gap.lane !== state.gaps.lane) return false;
    if (state.gaps.priority && gap.priority !== state.gaps.priority) return false;
    if (state.gaps.status && gap.status !== state.gaps.status) return false;
    return true;
  });
}

function renderGapTracker() {
  const priorityOrder = new Map([
    ["Critical", 1],
    ["High", 2],
    ["Medium", 3],
    ["Low", 4]
  ]);
  const visible = filteredGaps().sort(
    (a, b) =>
      (priorityOrder.get(a.priority) || 99) - (priorityOrder.get(b.priority) || 99) ||
      a.lane.localeCompare(b.lane) ||
      a.title.localeCompare(b.title)
  );
  nodes.gapSummary.textContent = `${plural(visible.length, "gap")} visible from ${gapTracker.length} compiler gap items.`;
  nodes.gapRoot.replaceChildren(...visible.map(gapCard));
  if (!visible.length) nodes.gapRoot.innerHTML = '<p class="empty">No gap-tracker items match the current filters.</p>';
}

function gapCard(gap) {
  const card = document.createElement("article");
  card.className = `gap-card priority-${gap.priority.toLowerCase()}`;

  const header = document.createElement("header");
  const titleBlock = document.createElement("div");
  const meta = document.createElement("div");
  meta.className = "file-meta";
  meta.append(textSpan(gap.priority), textSpan(gap.status), textSpan(gap.lane));
  const title = document.createElement("h3");
  title.textContent = gap.title;
  titleBlock.append(meta, title);
  header.append(titleBlock);

  const evidence = document.createElement("p");
  evidence.className = "gap-evidence";
  evidence.textContent = gap.evidence;
  const problem = document.createElement("p");
  problem.textContent = gap.problem;
  const needed = document.createElement("p");
  needed.className = "source-note";
  needed.textContent = gap.needed;

  const actions = document.createElement("ol");
  actions.className = "action-list";
  for (const action of gap.nextActions || []) {
    const item = document.createElement("li");
    item.textContent = action;
    actions.append(item);
  }

  const chips = document.createElement("div");
  chips.className = "chips";
  for (const term of (gap.targetTerms || []).slice(0, 8)) chips.append(chip(term, gap.priority === "Critical" ? "warn" : ""));

  const pools = document.createElement("p");
  pools.className = "source-note";
  pools.textContent = `Source pools: ${(gap.sourcePools || []).join("; ")}`;

  card.append(header, evidence, problem, needed, actions, chips, pools);
  return card;
}

function filteredSourcePools() {
  return sourcePools.filter((pool) => {
    if (!matchesQuery(pool, state.sourcePools.query)) return false;
    if (state.sourcePools.lane && pool.lane !== state.sourcePools.lane) return false;
    if (state.sourcePools.priority && pool.priority !== state.sourcePools.priority) return false;
    return true;
  });
}

function renderSourcePools() {
  const priorityOrder = new Map([
    ["Active", 1],
    ["Next", 2],
    ["Missing", 3],
    ["Later", 4]
  ]);
  const visible = filteredSourcePools().sort(
    (a, b) =>
      (priorityOrder.get(a.priority) || 99) - (priorityOrder.get(b.priority) || 99) ||
      a.lane.localeCompare(b.lane) ||
      a.title.localeCompare(b.title)
  );
  nodes.sourcePoolSummary.textContent = `${plural(visible.length, "source pool")} visible from ${sourcePools.length} harvest lanes.`;
  nodes.sourcePoolRoot.replaceChildren(...visible.map(sourcePoolCard));
  if (!visible.length) nodes.sourcePoolRoot.innerHTML = '<p class="empty">No source pools match the current filters.</p>';
}

function filteredRequestPackets() {
  return requestPackets.filter((packet) => {
    if (!matchesQuery(packet, state.requests.query)) return false;
    if (state.requests.repository && packet.repository !== state.requests.repository) return false;
    if (state.requests.priority && packet.priority !== state.requests.priority) return false;
    return true;
  });
}

function renderRequestPackets() {
  const priorityOrder = new Map([
    ["Critical", 1],
    ["High", 2],
    ["Medium", 3],
    ["Low", 4]
  ]);
  const visible = filteredRequestPackets().sort(
    (a, b) =>
      (priorityOrder.get(a.priority) || 99) - (priorityOrder.get(b.priority) || 99) ||
      a.repository.localeCompare(b.repository) ||
      a.title.localeCompare(b.title)
  );
  nodes.requestSummary.textContent = `${plural(visible.length, "request packet")} visible from ${requestPackets.length} archive asks.`;
  nodes.requestRoot.replaceChildren(...visible.map(requestPacketCard));
  if (!visible.length) nodes.requestRoot.innerHTML = '<p class="empty">No request packets match the current filters.</p>';
}

function requestPacketCard(packet) {
  const card = document.createElement("article");
  card.className = `file-card request-card priority-${packet.priority.toLowerCase()}`;

  const header = document.createElement("header");
  const titleBlock = document.createElement("div");
  const meta = document.createElement("div");
  meta.className = "file-meta";
  meta.append(textSpan(packet.priority), textSpan(packet.repository), textSpan(packet.sourceWindow));
  const title = document.createElement("h3");
  title.textContent = packet.title;
  titleBlock.append(meta, title);
  header.append(titleBlock);

  const chips = document.createElement("div");
  chips.className = "chips";
  chips.append(chip(packet.lane), chip(packet.requestType, "boundary"), chip(packet.sourceNoteStatus, /target/i.test(packet.sourceNoteStatus) ? "warn" : "good"));

  const purpose = document.createElement("p");
  purpose.textContent = packet.purpose;
  const ask = document.createElement("p");
  ask.className = "source-note request-text";
  ask.textContent = packet.exactAsk;
  const next = document.createElement("p");
  next.className = "source-note";
  next.textContent = packet.nextStep;

  const actions = document.createElement("div");
  actions.className = "file-actions";
  if (packet.catalogUrl) actions.append(linkButton(packet.catalogLabel || "Source", packet.catalogUrl));
  if (packet.pdfUrl) actions.append(linkButton("PDF", packet.pdfUrl));
  if (packet.requestText) actions.append(copyButton(packet.requestText, "Copy request"));
  if (packet.sourceNoteTarget) actions.append(copyButton(packet.sourceNoteTarget, "Copy source target"));

  card.append(header, chips, purpose, ask, next, actions);
  if (packet.sourceNoteTarget) {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = "Source-note target";
    const note = document.createElement("p");
    note.className = "source-note";
    note.textContent = packet.sourceNoteTarget;
    details.append(summary, note);
    card.append(details);
  }
  return card;
}

function filteredSourceNoteAudit() {
  return sourceNoteAudit.filter((row) => {
    if (!matchesQuery(row, state.sourceNotes.query)) return false;
    if (state.sourceNotes.status && row.assessment !== state.sourceNotes.status) return false;
    if (state.sourceNotes.section && row.section !== state.sourceNotes.section) return false;
    return true;
  });
}

function renderSourceNoteAudit() {
  const statusOrder = new Map([
    ["Needs review", 1],
    ["Target", 2],
    ["Reference", 3],
    ["Ready", 4]
  ]);
  const visible = filteredSourceNoteAudit().sort(
    (a, b) =>
      (statusOrder.get(a.assessment) || 99) - (statusOrder.get(b.assessment) || 99) ||
      a.section.localeCompare(b.section) ||
      a.sourceTitle.localeCompare(b.sourceTitle)
  );
  const counts = topCounts(sourceNoteAudit, (row) => row.assessment)
    .map(([label, count]) => `${count} ${label.toLowerCase()}`)
    .join("; ");
  nodes.sourceNoteSummary.textContent = `${plural(visible.length, "source note")} visible from ${sourceNoteAudit.length} audited notes. ${counts}.`;
  nodes.sourceNoteRoot.replaceChildren(...visible.map(sourceNoteCard));
  if (!visible.length) nodes.sourceNoteRoot.innerHTML = '<p class="empty">No source-note rows match the current filters.</p>';
}

function sourceNoteCard(row) {
  const card = document.createElement("article");
  card.className = `file-card source-note-card status-${slug(row.assessment)}`;

  const header = document.createElement("header");
  const titleBlock = document.createElement("div");
  const meta = document.createElement("div");
  meta.className = "file-meta";
  meta.append(textSpan(row.auditId), textSpan(row.section), textSpan(row.dateText));
  const title = document.createElement("h3");
  title.textContent = row.sourceTitle;
  titleBlock.append(meta, title);
  header.append(titleBlock);

  const chips = document.createElement("div");
  chips.className = "chips";
  chips.append(chip(row.assessment, row.assessment === "Needs review" ? "warn" : row.assessment === "Ready" ? "good" : "boundary"));
  chips.append(chip(row.lane));
  if (row.identifier) chips.append(chip(row.identifier));

  const note = document.createElement("p");
  note.className = "source-note";
  note.textContent = row.sourceNote;

  const flags = document.createElement("ul");
  flags.className = "compact-list";
  for (const flag of row.flags || []) {
    const item = document.createElement("li");
    item.textContent = flag;
    flags.append(item);
  }

  const actions = document.createElement("div");
  actions.className = "file-actions";
  if (row.catalogUrl) actions.append(linkButton("Source", row.catalogUrl));
  if (row.pdfUrl) actions.append(linkButton("PDF", row.pdfUrl));
  actions.append(copyButton(row.sourceNote, row.assessment === "Target" ? "Copy target" : "Copy note"));

  card.append(header, chips, note, flags, actions);
  return card;
}

function filteredSelectionBoard() {
  return selectionBoard.filter((item) => {
    if (!matchesQuery(item, state.selections.query)) return false;
    if (state.selections.status && item.status !== state.selections.status) return false;
    if (state.selections.lane && item.lane !== state.selections.lane) return false;
    return true;
  });
}

function renderSelectionBoard() {
  const statusOrder = new Map([
    ["Draft candidate", 1],
    ["Request-first", 2],
    ["Context anchor", 3],
    ["Boundary / exclude unless needed", 4]
  ]);
  const priorityOrder = new Map([
    ["Critical", 1],
    ["High", 2],
    ["Medium", 3],
    ["Low", 4]
  ]);
  const visible = filteredSelectionBoard().sort(
    (a, b) =>
      (statusOrder.get(a.status) || 99) - (statusOrder.get(b.status) || 99) ||
      (priorityOrder.get(a.priority) || 99) - (priorityOrder.get(b.priority) || 99) ||
      a.lane.localeCompare(b.lane) ||
      a.title.localeCompare(b.title)
  );
  const counts = topCounts(selectionBoard, (item) => item.status)
    .map(([label, count]) => `${count} ${label.toLowerCase()}`)
    .join("; ");
  nodes.selectionSummary.textContent = `${plural(visible.length, "selection row")} visible from ${selectionBoard.length} compiler selection calls. ${counts}.`;
  nodes.selectionRoot.replaceChildren(...visible.map(selectionCard));
  if (!visible.length) nodes.selectionRoot.innerHTML = '<p class="empty">No selection rows match the current filters.</p>';
}

function selectionCard(item) {
  const card = document.createElement("article");
  card.className = `record-card selection-card status-${slug(item.status)}`;

  const header = document.createElement("header");
  const titleBlock = document.createElement("div");
  const meta = document.createElement("div");
  meta.className = "record-id";
  meta.append(textSpan(item.recordId), textSpan(item.dateText), textSpan(item.status), textSpan(item.priority));
  const title = document.createElement("h4");
  title.textContent = item.title;
  titleBlock.append(meta, title);

  const chips = document.createElement("div");
  chips.className = "chips";
  chips.append(
    chip(item.lane),
    chip(item.status, item.status === "Draft candidate" ? "good" : item.status === "Boundary / exclude unless needed" ? "warn" : "boundary")
  );
  header.append(titleBlock, chips);

  const rationale = document.createElement("p");
  rationale.textContent = item.selectionRationale;
  const sourceLead = document.createElement("p");
  sourceLead.className = "source-note";
  sourceLead.textContent = `Source lead: ${item.sourceLead}`;
  const boundary = document.createElement("p");
  boundary.className = "source-note";
  boundary.textContent = `Boundary risk: ${item.boundaryRisk}`;
  const next = document.createElement("p");
  next.className = "source-note";
  next.textContent = `Next action: ${item.nextAction}`;
  const annotation = document.createElement("p");
  annotation.className = "source-note";
  annotation.textContent = `Annotation lead: ${item.annotationLead}`;

  const actions = document.createElement("div");
  actions.className = "record-actions";
  if (item.catalogUrl) actions.append(linkButton(item.catalogLabel || "Source", item.catalogUrl));
  if (item.pdfUrl) actions.append(linkButton("PDF", item.pdfUrl));
  if (item.sourceNote) actions.append(copyButton(item.sourceNote, "Copy source note"));
  actions.append(copyButton(selectionMemo(item), "Copy selection memo"));

  card.append(header, rationale, sourceLead, boundary, next, annotation, actions);
  return card;
}

function selectionMemo(item) {
  return [
    `${item.status}: ${item.title}`,
    `Lane: ${item.lane}`,
    `Priority: ${item.priority}`,
    `Source lead: ${item.sourceLead}`,
    `Rationale: ${item.selectionRationale}`,
    `Boundary risk: ${item.boundaryRisk}`,
    `Next action: ${item.nextAction}`,
    `Annotation lead: ${item.annotationLead}`,
    `Source note: ${item.sourceNote}`
  ].join("\n");
}

function filteredChapterBriefs() {
  return chapterBriefs.filter((brief) => {
    if (!matchesQuery(brief, state.chapterBriefs.query)) return false;
    if (state.chapterBriefs.lane && brief.lane !== state.chapterBriefs.lane) return false;
    if (state.chapterBriefs.urgency && brief.urgency !== state.chapterBriefs.urgency) return false;
    return true;
  });
}

function renderChapterBriefs() {
  const urgencyOrder = new Map([
    ["Critical", 1],
    ["High", 2],
    ["Medium", 3],
    ["Low", 4]
  ]);
  const visible = filteredChapterBriefs().sort(
    (a, b) =>
      (urgencyOrder.get(a.urgency) || 99) - (urgencyOrder.get(b.urgency) || 99) ||
      a.lane.localeCompare(b.lane)
  );
  nodes.chapterBriefSummary.textContent = `${plural(visible.length, "chapter brief")} visible from ${chapterBriefs.length} lane assembly notes.`;
  nodes.chapterBriefRoot.replaceChildren(...visible.map(chapterBriefCard));
  if (!visible.length) nodes.chapterBriefRoot.innerHTML = '<p class="empty">No chapter briefs match the current filters.</p>';
}

function chapterBriefCard(brief) {
  const card = document.createElement("article");
  card.className = `file-card chapter-brief-card priority-${brief.urgency.toLowerCase()}`;

  const header = document.createElement("header");
  const titleBlock = document.createElement("div");
  const meta = document.createElement("div");
  meta.className = "file-meta";
  meta.append(textSpan(brief.urgency), textSpan(brief.lane));
  const title = document.createElement("h3");
  title.textContent = brief.workingTitle;
  titleBlock.append(meta, title);
  header.append(titleBlock);

  const thesis = document.createElement("p");
  thesis.textContent = brief.thesis;

  const spine = briefList("Document spine", brief.documentSpine);
  const harvest = briefList("Must harvest", brief.mustHarvest);
  const questions = briefList("Annotation questions", brief.annotationQuestions);
  const exclusions = briefList("Exclusion rules", brief.exclusionRules);

  const firstMove = document.createElement("p");
  firstMove.className = "source-note";
  firstMove.textContent = `First draft move: ${brief.firstDraftMove}`;
  const risk = document.createElement("p");
  risk.className = "source-note";
  risk.textContent = `Unresolved risk: ${brief.unresolvedRisk}`;

  const actions = document.createElement("div");
  actions.className = "file-actions";
  actions.append(copyButton(chapterBriefMemo(brief), "Copy chapter brief"));

  card.append(header, chip(brief.urgency, brief.urgency === "Critical" ? "warn" : "boundary"), thesis, spine, harvest, questions, exclusions, firstMove, risk, actions);
  return card;
}

function briefList(label, values) {
  const details = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = label;
  const list = document.createElement("ul");
  list.className = "compact-list";
  for (const value of values || []) {
    const item = document.createElement("li");
    item.textContent = value;
    list.append(item);
  }
  details.append(summary, list);
  return details;
}

function chapterBriefMemo(brief) {
  return [
    `${brief.workingTitle}`,
    `Lane: ${brief.lane}`,
    `Urgency: ${brief.urgency}`,
    "",
    `Thesis: ${brief.thesis}`,
    "",
    "Document spine:",
    ...(brief.documentSpine || []).map((item) => `- ${item}`),
    "",
    "Must harvest:",
    ...(brief.mustHarvest || []).map((item) => `- ${item}`),
    "",
    "Annotation questions:",
    ...(brief.annotationQuestions || []).map((item) => `- ${item}`),
    "",
    "Exclusion rules:",
    ...(brief.exclusionRules || []).map((item) => `- ${item}`),
    "",
    `First draft move: ${brief.firstDraftMove}`,
    `Unresolved risk: ${brief.unresolvedRisk}`
  ].join("\n");
}

function renderSourceCopyLedger() {
  const markerCount = sourceCopyLedger.filter((item) => item.issueType === "Marker / no memorandum").length;
  const partialCount = sourceCopyLedger.length - markerCount;
  nodes.ledgerSummary.textContent = `${plural(sourceCopyLedger.length, "row")} in the source-copy ledger: ${plural(markerCount, "marker")} and ${plural(partialCount, "partial, mixed-status, or verification row")}.`;
  nodes.ledgerRoot.replaceChildren(...sourceCopyLedger.map(ledgerCard));
  if (!sourceCopyLedger.length) nodes.ledgerRoot.innerHTML = '<p class="empty">No source-copy ledger rows were generated.</p>';
}

function ledgerCard(item) {
  const card = document.createElement("article");
  card.className = `record-card ledger-card ${item.issueType === "Marker / no memorandum" ? "marker-ledger" : "partial-ledger"}`;

  const header = document.createElement("header");
  const titleBlock = document.createElement("div");
  const meta = document.createElement("div");
  meta.className = "record-id";
  meta.append(textSpan(item.issueType), textSpan(item.dateText || item.date), textSpan(item.country), textSpan(item.lane));
  const title = document.createElement("h4");
  title.textContent = item.title;
  titleBlock.append(meta, title);

  const chips = document.createElement("div");
  chips.className = "chips";
  chips.append(
    chip(item.priority, item.issueType === "Marker / no memorandum" ? "warn" : "boundary"),
    chip(item.identifier || (item.naid ? `NAID ${item.naid}` : "source lead")),
    chip(item.releaseStatus, "warn")
  );
  header.append(titleBlock, chips);

  const participants = document.createElement("p");
  participants.textContent = (item.participants || []).join(" / ");

  const action = document.createElement("p");
  action.className = "source-note";
  action.textContent = item.action;

  const actions = document.createElement("div");
  actions.className = "record-actions";
  if (item.catalogUrl) actions.append(linkButton(item.catalogLabel || "Source", item.catalogUrl));
  if (item.pdfUrl) actions.append(linkButton("PDF", item.pdfUrl));
  if (preferredSourceNote(item)) actions.append(copyButton(preferredSourceNote(item)));

  card.append(header, participants, action, actions);
  const details = sourceNoteDetails(item);
  if (details) card.append(details);
  const diaryDetails = diaryReferenceDetails(item);
  if (diaryDetails) card.append(diaryDetails);
  return card;
}

function sourcePoolCard(pool) {
  const card = document.createElement("article");
  card.className = `file-card source-pool-card priority-${pool.priority.toLowerCase()}`;

  const header = document.createElement("header");
  const titleBlock = document.createElement("div");
  const meta = document.createElement("div");
  meta.className = "file-meta";
  meta.append(textSpan(pool.priority), textSpan(pool.lane));
  const title = document.createElement("h3");
  title.textContent = pool.title;
  titleBlock.append(meta, title);
  header.append(titleBlock);

  const coverage = document.createElement("p");
  coverage.textContent = pool.coverage;
  const nextUse = document.createElement("p");
  nextUse.className = "source-note";
  nextUse.textContent = pool.nextUse;
  const actions = document.createElement("div");
  actions.className = "file-actions";
  if (pool.url) actions.append(linkButton("Open source", pool.url));
  card.append(header, chip(pool.priority, pool.priority === "Missing" ? "warn" : "good"), coverage, nextUse, actions);
  return card;
}

function populateFilters() {
  addOptions(nodes.chapterFilter, chapters.map((chapter) => chapter.name), "All lanes");
  addOptions(nodes.countryFilter, uniqueSorted(records.map((record) => record.country)), "All countries");
  addOptions(nodes.releaseFilter, uniqueSorted(records.map((record) => record.releaseStatus)), "All releases");
  addOptions(nodes.availabilityFilter, ["Online PDF", "Marker / no public PDF"], "All documents");
  addOptions(nodes.policyLaneFilter, uniqueSorted(policyFiles.map((file) => file.lane)), "All lanes");
  addOptions(nodes.policyPriorityFilter, uniqueSorted(policyFiles.map((file) => file.priority)), "All priorities");
  addOptions(nodes.publicLaneFilter, uniqueSorted(publicReferences.map((item) => item.chapter)), "All lanes");
  addOptions(nodes.boundaryCountryFilter, uniqueSorted(boundaryRecords.map((record) => record.country)), "All countries");
  addOptions(nodes.selectionStatusFilter, uniqueSorted(selectionBoard.map((item) => item.status)), "All statuses");
  addOptions(nodes.selectionLaneFilter, uniqueSorted(selectionBoard.map((item) => item.lane)), "All lanes");
  addOptions(nodes.chapterBriefLaneFilter, uniqueSorted(chapterBriefs.map((brief) => brief.lane)), "All lanes");
  addOptions(nodes.chapterBriefUrgencyFilter, uniqueSorted(chapterBriefs.map((brief) => brief.urgency)), "All urgencies");
  addOptions(nodes.gapLaneFilter, uniqueSorted(gapTracker.map((gap) => gap.lane)), "All lanes");
  addOptions(nodes.gapPriorityFilter, uniqueSorted(gapTracker.map((gap) => gap.priority)), "All priorities");
  addOptions(nodes.gapStatusFilter, uniqueSorted(gapTracker.map((gap) => gap.status)), "All statuses");
  addOptions(nodes.sourcePoolLaneFilter, uniqueSorted(sourcePools.map((pool) => pool.lane)), "All lanes");
  addOptions(nodes.sourcePoolPriorityFilter, uniqueSorted(sourcePools.map((pool) => pool.priority)), "All priorities");
  addOptions(nodes.requestRepositoryFilter, uniqueSorted(requestPackets.map((packet) => packet.repository)), "All repositories");
  addOptions(nodes.requestPriorityFilter, uniqueSorted(requestPackets.map((packet) => packet.priority)), "All priorities");
  addOptions(nodes.sourceNoteStatusFilter, uniqueSorted(sourceNoteAudit.map((row) => row.assessment)), "All statuses");
  addOptions(nodes.sourceNoteSectionFilter, uniqueSorted(sourceNoteAudit.map((row) => row.section)), "All sections");
}

function filteredRecords() {
  return records.filter((record) => {
    if (!matchesQuery(record, state.records.query)) return false;
    if (state.records.chapter && record.chapter?.name !== state.records.chapter) return false;
    if (state.records.country && record.country !== state.records.country) return false;
    if (state.records.release && record.releaseStatus !== state.records.release) return false;
    if (state.records.availability === "Online PDF" && !record.documentAvailable) return false;
    if (state.records.availability === "Marker / no public PDF" && record.documentAvailable) return false;
    return true;
  });
}

function renderRecords() {
  const visible = filteredRecords().sort(byChapterThenDate);
  nodes.recordsSummary.textContent = `${plural(visible.length, "lead")} visible from ${records.length} Volume XXXVII chronology leads.`;
  if (!visible.length) {
    nodes.recordsRoot.innerHTML = '<p class="empty">No chronology leads match the current filters.</p>';
    return;
  }

  const grouped = groupBy(visible, (record) => record.chapter?.name || "Regional and Multilateral");
  const sections = chapters
    .filter((chapter) => grouped.has(chapter.name))
    .map((chapter) => recordChapterSection(chapter.name, grouped.get(chapter.name)));
  nodes.recordsRoot.replaceChildren(...sections);
}

function recordChapterSection(chapterName, items) {
  const section = document.createElement("section");
  section.className = "chapter-section";
  section.id = `chapter-${slug(chapterName)}`;
  const heading = document.createElement("div");
  heading.className = "chapter-title-row";
  const title = document.createElement("h3");
  title.textContent = chapterName;
  const count = document.createElement("span");
  count.textContent = `${plural(items.length, "lead")} / ${plural(items.filter((item) => item.documentAvailable).length, "open source")}`;
  heading.append(title, count);
  section.append(heading, ...items.map(recordCard));
  return section;
}

function recordCard(record) {
  const card = document.createElement("article");
  card.className = "record-card";

  const header = document.createElement("header");
  const titleBlock = document.createElement("div");
  const meta = document.createElement("div");
  meta.className = "record-id";
  meta.append(textSpan(record.compilerNumber), textSpan(record.dateText || record.date), textSpan(record.type), textSpan(record.country));
  const title = document.createElement("h4");
  title.textContent = record.title;
  titleBlock.append(meta, title);
  const chips = document.createElement("div");
  chips.className = "chips";
  chips.append(
    chip(record.releaseStatus, /full/i.test(record.releaseStatus) ? "good" : "warn"),
    chip(record.documentAvailable ? "Online source" : "Source lead", record.documentAvailable ? "good" : "warn"),
    chip(formatExtent(record))
  );
  header.append(titleBlock, chips);

  const participants = document.createElement("p");
  participants.textContent = record.participants?.join(" / ") || record.counterpart || "";

  const actions = document.createElement("div");
  actions.className = "record-actions";
  if (record.catalogUrl) actions.append(linkButton(record.catalogLabel || "Source", record.catalogUrl));
  if (record.pdfUrl) actions.append(linkButton("PDF", record.pdfUrl));
  if (preferredSourceNote(record)) actions.append(copyButton(preferredSourceNote(record)));

  const details = sourceNoteDetails(record);

  card.append(header, participants, actions);
  if (details) card.append(details);
  const diaryDetails = diaryReferenceDetails(record);
  if (diaryDetails) card.append(diaryDetails);
  if (record.notes) {
    const warning = document.createElement("p");
    warning.className = "source-note";
    warning.textContent = record.notes;
    card.append(warning);
  }
  return card;
}

function filteredPolicyFiles() {
  return policyFiles.filter((file) => {
    if (!matchesQuery(file, state.policy.query)) return false;
    if (state.policy.lane && file.lane !== state.policy.lane) return false;
    if (state.policy.priority && file.priority !== state.policy.priority) return false;
    return true;
  });
}

function renderPolicyFiles() {
  const visible = filteredPolicyFiles().sort((a, b) => a.sortDate.localeCompare(b.sortDate) || a.title.localeCompare(b.title));
  nodes.policySummary.textContent = `${plural(visible.length, "file")} visible from ${policyFiles.length} policy and boundary file anchors.`;
  nodes.policyRoot.replaceChildren(...visible.map(policyCard));
  if (!visible.length) nodes.policyRoot.innerHTML = '<p class="empty">No policy files match the current filters.</p>';
}

function policyCard(file) {
  const card = document.createElement("article");
  card.className = `file-card priority-${file.priority.toLowerCase()}`;

  const header = document.createElement("header");
  const titleBlock = document.createElement("div");
  const meta = document.createElement("div");
  meta.className = "file-meta";
  meta.append(textSpan(file.dateText || file.date), textSpan(file.identifier || (file.naid ? `NAID ${file.naid}` : "")), textSpan(file.priority));
  const title = document.createElement("h3");
  title.textContent = file.title;
  titleBlock.append(meta, title);
  header.append(titleBlock);

  const chips = document.createElement("div");
  chips.className = "chips";
  chips.append(chip(file.lane, file.priority === "Boundary" ? "boundary" : ""), chip(formatExtent(file)), chip(file.accessRestriction || "Status not stated"));

  const reason = document.createElement("p");
  reason.textContent = file.reason;
  const actions = document.createElement("div");
  actions.className = "file-actions";
  if (file.catalogUrl) actions.append(linkButton(file.catalogLabel || "Finding aid", file.catalogUrl));
  if (file.pdfUrl) actions.append(linkButton("PDF", file.pdfUrl));
  if (preferredSourceNote(file)) actions.append(copyButton(preferredSourceNote(file)));
  card.append(header, chips, reason, actions);
  const details = sourceNoteDetails(file);
  if (details) card.append(details);
  return card;
}

function filteredPublicReferences() {
  return publicReferences.filter((item) => {
    if (!matchesQuery(item, state.public.query)) return false;
    if (state.public.lane && item.chapter !== state.public.lane) return false;
    return true;
  });
}

function renderPublicReferences() {
  const visible = filteredPublicReferences().sort((a, b) => a.sortDate.localeCompare(b.sortDate) || a.title.localeCompare(b.title));
  nodes.publicSummary.textContent = `${plural(visible.length, "reference")} visible from ${publicReferences.length} Public Papers references.`;
  nodes.publicRoot.replaceChildren(...visible.map(publicCard));
  if (!visible.length) nodes.publicRoot.innerHTML = '<p class="empty">No public references match the current filters.</p>';
}

function publicCard(item) {
  const card = document.createElement("article");
  card.className = "file-card";
  const header = document.createElement("header");
  const titleBlock = document.createElement("div");
  const meta = document.createElement("div");
  meta.className = "file-meta";
  meta.append(textSpan(item.dateText || item.date), textSpan(item.documentType), textSpan(item.chapter));
  const title = document.createElement("h3");
  title.textContent = item.title;
  titleBlock.append(meta, title);
  header.append(titleBlock);

  const chips = document.createElement("div");
  chips.className = "chips";
  for (const term of item.matchedTerms.slice(0, 5)) chips.append(chip(term));
  const citation = document.createElement("p");
  citation.className = "source-note";
  citation.textContent = preferredSourceNote(item) || "Public Papers reference.";
  const actions = document.createElement("div");
  actions.className = "file-actions";
  if (item.govinfoUrl) actions.append(linkButton("GovInfo", item.govinfoUrl));
  if (item.pdfUrl) actions.append(linkButton("PDF", item.pdfUrl));
  if (preferredSourceNote(item)) actions.append(copyButton(preferredSourceNote(item)));
  card.append(header, chips, citation, actions);
  return card;
}

function filteredBoundaryRecords() {
  return boundaryRecords.filter((record) => {
    if (!matchesQuery(record, state.boundary.query)) return false;
    if (state.boundary.country && record.country !== state.boundary.country) return false;
    return true;
  });
}

function renderBoundaryRecords() {
  const visible = filteredBoundaryRecords();
  nodes.boundarySummary.textContent = `${plural(visible.length, "row")} visible from ${boundaryRecords.length} handoff rows.`;
  nodes.boundaryRoot.replaceChildren(...visible.map(boundaryCard));
  if (!visible.length) nodes.boundaryRoot.innerHTML = '<p class="empty">No boundary rows match the current filters.</p>';
}

function boundaryCard(record) {
  const card = recordCard(record);
  const note = document.createElement("p");
  note.className = "source-note";
  note.textContent = record.boundaryReason;
  card.append(note);
  return card;
}

function chip(label, mode = "") {
  const span = document.createElement("span");
  span.className = `chip ${mode}`.trim();
  span.textContent = label || "Unspecified";
  return span;
}

function textSpan(value) {
  const span = document.createElement("span");
  span.textContent = value || "";
  return span;
}

function linkButton(label, href) {
  const link = document.createElement("a");
  link.href = href;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = label;
  return link;
}

function formatExtent(item) {
  if (item.itemExtent) return item.itemExtent;
  if (Number.isFinite(item.pageCount) && item.pageCount > 0) return `${item.pageCount} pages`;
  if (item.documentType) return item.documentType;
  return "source lead";
}

function copyButton(value, label = "Copy note") {
  const button = document.createElement("button");
  button.className = "copy-note";
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", async () => {
    await navigator.clipboard.writeText(value || "");
    button.textContent = "Copied";
    setTimeout(() => {
      button.textContent = label;
    }, 1200);
  });
  return button;
}

function preferredSourceNote(item) {
  return item.frusSourceNote || item.sourceNote || item.citation || "";
}

function sourceNoteDetails(item) {
  const frusNote = item.frusSourceNote || "";
  const fallbackNote = item.sourceNote || item.citation || "";
  const note = frusNote || fallbackNote;
  if (!note) return null;

  const details = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = frusNote ? "FRUS source note" : "Source note";
  const sourceNote = document.createElement("p");
  sourceNote.className = "source-note";
  sourceNote.textContent = note;
  details.append(summary, sourceNote);

  if (frusNote && fallbackNote && fallbackNote !== frusNote) {
    const catalogNote = document.createElement("p");
    catalogNote.className = "source-note";
    catalogNote.textContent = `Catalog provenance: ${fallbackNote}`;
    details.append(catalogNote);
  }

  return details;
}

function diaryReferenceDetails(item) {
  const references = item.diaryReferences || [];
  if (!references.length) return null;

  const details = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = "Daily diary / backup references";
  const note = document.createElement("p");
  note.className = "source-note";
  note.textContent =
    item.diaryCrossReferenceNote ||
    "Date-matched Presidential Daily Diary/Backup lead for time, location, attendees, call status, and scheduling context.";
  const list = document.createElement("ul");
  list.className = "compact-list";
  for (const reference of references) {
    const entry = document.createElement("li");
    const link = document.createElement("a");
    link.href = reference.catalogUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = `${reference.kind}: ${reference.title}`;
    entry.append(link, textSpan(` NAID ${reference.naid}`));
    list.append(entry);
  }
  details.append(summary, note, list);
  return details;
}

function formatDiaryReferences(item) {
  return (item.diaryReferences || []).map((reference) => `${reference.kind}: ${reference.title} (${reference.catalogUrl})`).join("; ");
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

function topCounts(items, getter) {
  const counts = new Map();
  for (const item of items) {
    const key = getter(item) || "Unspecified";
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function slug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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

function setupEvents() {
  nodes.gapSearch.addEventListener("input", (event) => {
    state.gaps.query = event.target.value;
    renderGapTracker();
  });
  nodes.gapLaneFilter.addEventListener("change", (event) => {
    state.gaps.lane = event.target.value;
    renderGapTracker();
  });
  nodes.gapPriorityFilter.addEventListener("change", (event) => {
    state.gaps.priority = event.target.value;
    renderGapTracker();
  });
  nodes.gapStatusFilter.addEventListener("change", (event) => {
    state.gaps.status = event.target.value;
    renderGapTracker();
  });
  nodes.clearGapFilters.addEventListener("click", () => {
    state.gaps = { query: "", lane: "", priority: "", status: "" };
    nodes.gapSearch.value = "";
    nodes.gapLaneFilter.value = "";
    nodes.gapPriorityFilter.value = "";
    nodes.gapStatusFilter.value = "";
    renderGapTracker();
  });
  nodes.exportGaps.addEventListener("click", () => {
    downloadCsv(
      "frus-volume37-gap-tracker.csv",
      toCsv(filteredGaps(), [
        { label: "Priority", value: (gap) => gap.priority },
        { label: "Status", value: (gap) => gap.status },
        { label: "Lane", value: (gap) => gap.lane },
        { label: "Title", value: (gap) => gap.title },
        { label: "Evidence", value: (gap) => gap.evidence },
        { label: "Problem", value: (gap) => gap.problem },
        { label: "Needed", value: (gap) => gap.needed },
        { label: "Next Actions", value: (gap) => (gap.nextActions || []).join("; ") },
        { label: "Target Terms", value: (gap) => (gap.targetTerms || []).join("; ") },
        { label: "Source Pools", value: (gap) => (gap.sourcePools || []).join("; ") }
      ])
    );
  });

  nodes.sourcePoolSearch.addEventListener("input", (event) => {
    state.sourcePools.query = event.target.value;
    renderSourcePools();
  });
  nodes.sourcePoolLaneFilter.addEventListener("change", (event) => {
    state.sourcePools.lane = event.target.value;
    renderSourcePools();
  });
  nodes.sourcePoolPriorityFilter.addEventListener("change", (event) => {
    state.sourcePools.priority = event.target.value;
    renderSourcePools();
  });
  nodes.clearSourcePoolFilters.addEventListener("click", () => {
    state.sourcePools = { query: "", lane: "", priority: "" };
    nodes.sourcePoolSearch.value = "";
    nodes.sourcePoolLaneFilter.value = "";
    nodes.sourcePoolPriorityFilter.value = "";
    renderSourcePools();
  });
  nodes.exportSourcePools.addEventListener("click", () => {
    downloadCsv(
      "frus-volume37-source-pools.csv",
      toCsv(filteredSourcePools(), [
        { label: "Priority", value: (pool) => pool.priority },
        { label: "Lane", value: (pool) => pool.lane },
        { label: "Title", value: (pool) => pool.title },
        { label: "URL", value: (pool) => pool.url },
        { label: "Coverage", value: (pool) => pool.coverage },
        { label: "Next Use", value: (pool) => pool.nextUse }
      ])
    );
  });

  nodes.requestSearch.addEventListener("input", (event) => {
    state.requests.query = event.target.value;
    renderRequestPackets();
  });
  nodes.requestRepositoryFilter.addEventListener("change", (event) => {
    state.requests.repository = event.target.value;
    renderRequestPackets();
  });
  nodes.requestPriorityFilter.addEventListener("change", (event) => {
    state.requests.priority = event.target.value;
    renderRequestPackets();
  });
  nodes.clearRequestFilters.addEventListener("click", () => {
    state.requests = { query: "", repository: "", priority: "" };
    nodes.requestSearch.value = "";
    nodes.requestRepositoryFilter.value = "";
    nodes.requestPriorityFilter.value = "";
    renderRequestPackets();
  });
  nodes.exportRequests.addEventListener("click", () => {
    downloadCsv(
      "frus-volume37-request-packets.csv",
      toCsv(filteredRequestPackets(), [
        { label: "Priority", value: (packet) => packet.priority },
        { label: "Repository", value: (packet) => packet.repository },
        { label: "Lane", value: (packet) => packet.lane },
        { label: "Title", value: (packet) => packet.title },
        { label: "Source Window", value: (packet) => packet.sourceWindow },
        { label: "Request Type", value: (packet) => packet.requestType },
        { label: "Purpose", value: (packet) => packet.purpose },
        { label: "Exact Ask", value: (packet) => packet.exactAsk },
        { label: "Request Text", value: (packet) => packet.requestText },
        { label: "Source-Note Status", value: (packet) => packet.sourceNoteStatus },
        { label: "Source-Note Target", value: (packet) => packet.sourceNoteTarget },
        { label: "Next Step", value: (packet) => packet.nextStep },
        { label: "Source URL", value: (packet) => packet.catalogUrl },
        { label: "PDF URL", value: (packet) => packet.pdfUrl }
      ])
    );
  });

  nodes.sourceNoteSearch.addEventListener("input", (event) => {
    state.sourceNotes.query = event.target.value;
    renderSourceNoteAudit();
  });
  nodes.sourceNoteStatusFilter.addEventListener("change", (event) => {
    state.sourceNotes.status = event.target.value;
    renderSourceNoteAudit();
  });
  nodes.sourceNoteSectionFilter.addEventListener("change", (event) => {
    state.sourceNotes.section = event.target.value;
    renderSourceNoteAudit();
  });
  nodes.clearSourceNoteFilters.addEventListener("click", () => {
    state.sourceNotes = { query: "", status: "", section: "" };
    nodes.sourceNoteSearch.value = "";
    nodes.sourceNoteStatusFilter.value = "";
    nodes.sourceNoteSectionFilter.value = "";
    renderSourceNoteAudit();
  });
  nodes.exportSourceNotes.addEventListener("click", () => {
    downloadCsv(
      "frus-volume37-source-note-qa.csv",
      toCsv(filteredSourceNoteAudit(), [
        { label: "Audit ID", value: (row) => row.auditId },
        { label: "Status", value: (row) => row.assessment },
        { label: "Section", value: (row) => row.section },
        { label: "Lane", value: (row) => row.lane },
        { label: "Date", value: (row) => row.dateText },
        { label: "Title", value: (row) => row.sourceTitle },
        { label: "Identifier", value: (row) => row.identifier },
        { label: "Source Note", value: (row) => row.sourceNote },
        { label: "Flags", value: (row) => (row.flags || []).join("; ") },
        { label: "Source URL", value: (row) => row.catalogUrl },
        { label: "PDF URL", value: (row) => row.pdfUrl }
      ])
    );
  });

  nodes.selectionSearch.addEventListener("input", (event) => {
    state.selections.query = event.target.value;
    renderSelectionBoard();
  });
  nodes.selectionStatusFilter.addEventListener("change", (event) => {
    state.selections.status = event.target.value;
    renderSelectionBoard();
  });
  nodes.selectionLaneFilter.addEventListener("change", (event) => {
    state.selections.lane = event.target.value;
    renderSelectionBoard();
  });
  nodes.clearSelectionFilters.addEventListener("click", () => {
    state.selections = { query: "", status: "", lane: "" };
    nodes.selectionSearch.value = "";
    nodes.selectionStatusFilter.value = "";
    nodes.selectionLaneFilter.value = "";
    renderSelectionBoard();
  });
  nodes.exportSelections.addEventListener("click", () => {
    downloadCsv(
      "frus-volume37-selection-board.csv",
      toCsv(filteredSelectionBoard(), [
        { label: "Status", value: (item) => item.status },
        { label: "Priority", value: (item) => item.priority },
        { label: "Lane", value: (item) => item.lane },
        { label: "Record ID", value: (item) => item.recordId },
        { label: "Date", value: (item) => item.dateText },
        { label: "Title", value: (item) => item.title },
        { label: "Source Lead", value: (item) => item.sourceLead },
        { label: "Selection Rationale", value: (item) => item.selectionRationale },
        { label: "Boundary Risk", value: (item) => item.boundaryRisk },
        { label: "Next Action", value: (item) => item.nextAction },
        { label: "Annotation Lead", value: (item) => item.annotationLead },
        { label: "Source Note", value: (item) => item.sourceNote },
        { label: "Source URL", value: (item) => item.catalogUrl },
        { label: "PDF URL", value: (item) => item.pdfUrl }
      ])
    );
  });

  nodes.chapterBriefSearch.addEventListener("input", (event) => {
    state.chapterBriefs.query = event.target.value;
    renderChapterBriefs();
  });
  nodes.chapterBriefLaneFilter.addEventListener("change", (event) => {
    state.chapterBriefs.lane = event.target.value;
    renderChapterBriefs();
  });
  nodes.chapterBriefUrgencyFilter.addEventListener("change", (event) => {
    state.chapterBriefs.urgency = event.target.value;
    renderChapterBriefs();
  });
  nodes.clearChapterBriefFilters.addEventListener("click", () => {
    state.chapterBriefs = { query: "", lane: "", urgency: "" };
    nodes.chapterBriefSearch.value = "";
    nodes.chapterBriefLaneFilter.value = "";
    nodes.chapterBriefUrgencyFilter.value = "";
    renderChapterBriefs();
  });
  nodes.exportChapterBriefs.addEventListener("click", () => {
    downloadCsv(
      "frus-volume37-chapter-briefs.csv",
      toCsv(filteredChapterBriefs(), [
        { label: "Urgency", value: (brief) => brief.urgency },
        { label: "Lane", value: (brief) => brief.lane },
        { label: "Working Title", value: (brief) => brief.workingTitle },
        { label: "Thesis", value: (brief) => brief.thesis },
        { label: "Document Spine", value: (brief) => (brief.documentSpine || []).join("; ") },
        { label: "Must Harvest", value: (brief) => (brief.mustHarvest || []).join("; ") },
        { label: "Annotation Questions", value: (brief) => (brief.annotationQuestions || []).join("; ") },
        { label: "Exclusion Rules", value: (brief) => (brief.exclusionRules || []).join("; ") },
        { label: "First Draft Move", value: (brief) => brief.firstDraftMove },
        { label: "Unresolved Risk", value: (brief) => brief.unresolvedRisk }
      ])
    );
  });

  nodes.recordSearch.addEventListener("input", (event) => {
    state.records.query = event.target.value;
    renderRecords();
  });
  nodes.chapterFilter.addEventListener("change", (event) => {
    state.records.chapter = event.target.value;
    renderRecords();
  });
  nodes.countryFilter.addEventListener("change", (event) => {
    state.records.country = event.target.value;
    renderRecords();
  });
  nodes.releaseFilter.addEventListener("change", (event) => {
    state.records.release = event.target.value;
    renderRecords();
  });
  nodes.availabilityFilter.addEventListener("change", (event) => {
    state.records.availability = event.target.value;
    renderRecords();
  });
  nodes.clearRecordFilters.addEventListener("click", () => {
    state.records = { query: "", chapter: "", country: "", release: "", availability: "" };
    nodes.recordSearch.value = "";
    nodes.chapterFilter.value = "";
    nodes.countryFilter.value = "";
    nodes.releaseFilter.value = "";
    nodes.availabilityFilter.value = "";
    renderRecords();
  });
  nodes.exportRecords.addEventListener("click", () => {
    downloadCsv(
      "frus-volume37-records.csv",
      toCsv(filteredRecords(), [
        { label: "Compiler ID", value: (record) => record.compilerNumber },
        { label: "Date", value: (record) => record.date },
        { label: "Lane", value: (record) => record.chapter?.name },
        { label: "Country", value: (record) => record.country },
        { label: "Type", value: (record) => record.type },
        { label: "Release", value: (record) => record.releaseStatus },
        { label: "Title", value: (record) => record.title },
        { label: "Identifier", value: (record) => record.identifier || record.naid },
        { label: "Source URL", value: (record) => record.catalogUrl },
        { label: "PDF URL", value: (record) => record.pdfUrl },
        { label: "FRUS Source Note", value: (record) => record.frusSourceNote },
        { label: "Source Note", value: (record) => record.sourceNote },
        { label: "Daily Diary/Backup References", value: formatDiaryReferences }
      ])
    );
  });

  nodes.policySearch.addEventListener("input", (event) => {
    state.policy.query = event.target.value;
    renderPolicyFiles();
  });
  nodes.policyLaneFilter.addEventListener("change", (event) => {
    state.policy.lane = event.target.value;
    renderPolicyFiles();
  });
  nodes.policyPriorityFilter.addEventListener("change", (event) => {
    state.policy.priority = event.target.value;
    renderPolicyFiles();
  });
  nodes.clearPolicyFilters.addEventListener("click", () => {
    state.policy = { query: "", lane: "", priority: "" };
    nodes.policySearch.value = "";
    nodes.policyLaneFilter.value = "";
    nodes.policyPriorityFilter.value = "";
    renderPolicyFiles();
  });
  nodes.exportPolicy.addEventListener("click", () => {
    downloadCsv(
      "frus-volume37-policy-files.csv",
      toCsv(filteredPolicyFiles(), [
        { label: "Date", value: (file) => file.date },
        { label: "Lane", value: (file) => file.lane },
        { label: "Priority", value: (file) => file.priority },
        { label: "Title", value: (file) => file.title },
        { label: "Identifier", value: (file) => file.identifier || file.naid },
        { label: "Source URL", value: (file) => file.catalogUrl },
        { label: "PDF URL", value: (file) => file.pdfUrl },
        { label: "FRUS Source Note", value: (file) => file.frusSourceNote },
        { label: "Source Note", value: (file) => file.sourceNote }
      ])
    );
  });

  nodes.publicSearch.addEventListener("input", (event) => {
    state.public.query = event.target.value;
    renderPublicReferences();
  });
  nodes.publicLaneFilter.addEventListener("change", (event) => {
    state.public.lane = event.target.value;
    renderPublicReferences();
  });
  nodes.clearPublicFilters.addEventListener("click", () => {
    state.public = { query: "", lane: "" };
    nodes.publicSearch.value = "";
    nodes.publicLaneFilter.value = "";
    renderPublicReferences();
  });
  nodes.exportPublic.addEventListener("click", () => {
    downloadCsv(
      "frus-volume37-public-references.csv",
      toCsv(filteredPublicReferences(), [
        { label: "Date", value: (item) => item.date },
        { label: "Lane", value: (item) => item.chapter },
        { label: "Type", value: (item) => item.documentType },
        { label: "Title", value: (item) => item.title },
        { label: "Matched Terms", value: (item) => item.matchedTerms.join("; ") },
        { label: "URL", value: (item) => item.govinfoUrl || item.pdfUrl },
        { label: "FRUS Source Note", value: (item) => item.frusSourceNote },
        { label: "Source Note", value: (item) => item.sourceNote }
      ])
    );
  });

  nodes.boundarySearch.addEventListener("input", (event) => {
    state.boundary.query = event.target.value;
    renderBoundaryRecords();
  });
  nodes.boundaryCountryFilter.addEventListener("change", (event) => {
    state.boundary.country = event.target.value;
    renderBoundaryRecords();
  });
  nodes.clearBoundaryFilters.addEventListener("click", () => {
    state.boundary = { query: "", country: "" };
    nodes.boundarySearch.value = "";
    nodes.boundaryCountryFilter.value = "";
    renderBoundaryRecords();
  });
}

function init() {
  setStats();
  renderWorkbench();
  renderSelectionBoard();
  renderChapterBriefs();
  renderGapTracker();
  renderSourcePools();
  renderRequestPackets();
  renderSourceNoteAudit();
  renderSourceCopyLedger();
  renderChapters();
  populateFilters();
  renderRecords();
  renderPolicyFiles();
  renderPublicReferences();
  renderBoundaryRecords();
  setupEvents();
}

init();
