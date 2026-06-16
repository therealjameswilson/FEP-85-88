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
const sourceNotePatterns = window.SOURCE_NOTE_PATTERNS || [];
const productionReadiness = window.PRODUCTION_READINESS || [];
const annotationQueue = window.ANNOTATION_QUEUE || [];
const sourceCopyLedger = window.SOURCE_COPY_LEDGER || [];
const persons = window.PERSONS || [];
const chapters = meta.chapters || [];
const pageBudget = window.PAGE_BUDGET || {};
const sourceNoteAudit = buildSourceNoteAudit();
const sourceCoverageRows = buildSourceCoverageRows();
const sourcePrecedentRows = buildSourcePrecedentRows();
const dateControlRows = buildDateControlRows();
const provenanceRows = buildProvenanceRows();

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
    country: "",
    type: ""
  },
  selections: {
    query: "",
    status: "",
    lane: ""
  },
  production: {
    query: "",
    stage: "",
    lane: "",
    priority: ""
  },
  annotations: {
    query: "",
    status: "",
    lane: "",
    type: ""
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
    section: "",
    format: ""
  },
  sourceCoverage: {
    query: "",
    status: "",
    format: ""
  },
  sourcePrecedents: {
    query: "",
    status: "",
    family: "",
    precedent: ""
  },
  dateControls: {
    query: "",
    lane: "",
    priority: ""
  },
  sourceNotePatterns: {
    query: "",
    repository: "",
    lane: "",
    status: ""
  },
  ledger: {
    query: "",
    issue: "",
    lane: "",
    priority: ""
  },
  provenance: {
    query: "",
    repository: "",
    lane: ""
  }
};

const nodes = {
  totalRecords: document.querySelector("#total-records"),
  totalPages: document.querySelector("#total-pages"),
  policyCount: document.querySelector("#policy-count"),
  publicCount: document.querySelector("#public-count"),
  boundaryCount: document.querySelector("#boundary-count"),
  workbenchRoot: document.querySelector("#workbench-root"),
  copyWorkbenchPacket: document.querySelector("#copy-workbench-packet"),
  pageBudgetRoot: document.querySelector("#page-budget-root"),
  pageBudgetSummary: document.querySelector("#page-budget-summary"),
  copyPageBudgetBrief: document.querySelector("#copy-page-budget-brief"),
  exportPageBudget: document.querySelector("#export-page-budget"),
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
  boundaryTypeFilter: document.querySelector("#boundary-type-filter"),
  clearBoundaryFilters: document.querySelector("#clear-boundary-filters"),
  exportBoundary: document.querySelector("#export-boundary"),
  selectionRoot: document.querySelector("#selection-root"),
  selectionSummary: document.querySelector("#selection-summary"),
  selectionSearch: document.querySelector("#selection-search"),
  selectionStatusFilter: document.querySelector("#selection-status-filter"),
  selectionLaneFilter: document.querySelector("#selection-lane-filter"),
  clearSelectionFilters: document.querySelector("#clear-selection-filters"),
  copySelectionDossier: document.querySelector("#copy-selection-dossier"),
  exportSelections: document.querySelector("#export-selections"),
  productionRoot: document.querySelector("#production-root"),
  productionSummary: document.querySelector("#production-summary"),
  productionSearch: document.querySelector("#production-search"),
  productionStageFilter: document.querySelector("#production-stage-filter"),
  productionLaneFilter: document.querySelector("#production-lane-filter"),
  productionPriorityFilter: document.querySelector("#production-priority-filter"),
  clearProductionFilters: document.querySelector("#clear-production-filters"),
  exportProduction: document.querySelector("#export-production"),
  annotationRoot: document.querySelector("#annotation-root"),
  annotationSummary: document.querySelector("#annotation-summary"),
  annotationSearch: document.querySelector("#annotation-search"),
  annotationStatusFilter: document.querySelector("#annotation-status-filter"),
  annotationLaneFilter: document.querySelector("#annotation-lane-filter"),
  annotationTypeFilter: document.querySelector("#annotation-type-filter"),
  clearAnnotationFilters: document.querySelector("#clear-annotation-filters"),
  exportAnnotations: document.querySelector("#export-annotations"),
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
  copyRequestBundle: document.querySelector("#copy-request-bundle"),
  exportRequests: document.querySelector("#export-requests"),
  sourceNoteRoot: document.querySelector("#source-note-root"),
  sourceNoteSummary: document.querySelector("#source-note-summary"),
  sourceNoteSearch: document.querySelector("#source-note-search"),
  sourceNoteStatusFilter: document.querySelector("#source-note-status-filter"),
  sourceNoteSectionFilter: document.querySelector("#source-note-section-filter"),
  sourceNoteFormatFilter: document.querySelector("#source-note-format-filter"),
  clearSourceNoteFilters: document.querySelector("#clear-source-note-filters"),
  copySourceNoteFixes: document.querySelector("#copy-source-note-fixes"),
  exportSourceNotes: document.querySelector("#export-source-notes"),
  sourceCoverageRoot: document.querySelector("#source-coverage-root"),
  sourceCoverageSummary: document.querySelector("#source-coverage-summary"),
  sourceCoverageSearch: document.querySelector("#source-coverage-search"),
  sourceCoverageStatusFilter: document.querySelector("#source-coverage-status-filter"),
  sourceCoverageFormatFilter: document.querySelector("#source-coverage-format-filter"),
  clearSourceCoverageFilters: document.querySelector("#clear-source-coverage-filters"),
  copySourceCoverageBrief: document.querySelector("#copy-source-coverage-brief"),
  exportSourceCoverage: document.querySelector("#export-source-coverage"),
  sourcePrecedentRoot: document.querySelector("#source-precedent-root"),
  sourcePrecedentSummary: document.querySelector("#source-precedent-summary"),
  sourcePrecedentSearch: document.querySelector("#source-precedent-search"),
  sourcePrecedentStatusFilter: document.querySelector("#source-precedent-status-filter"),
  sourcePrecedentFamilyFilter: document.querySelector("#source-precedent-family-filter"),
  sourcePrecedentModelFilter: document.querySelector("#source-precedent-model-filter"),
  clearSourcePrecedentFilters: document.querySelector("#clear-source-precedent-filters"),
  copySourcePrecedentChecklist: document.querySelector("#copy-source-precedent-checklist"),
  exportSourcePrecedents: document.querySelector("#export-source-precedents"),
  dateControlRoot: document.querySelector("#date-control-root"),
  dateControlSummary: document.querySelector("#date-control-summary"),
  dateControlSearch: document.querySelector("#date-control-search"),
  dateControlLaneFilter: document.querySelector("#date-control-lane-filter"),
  dateControlPriorityFilter: document.querySelector("#date-control-priority-filter"),
  clearDateControlFilters: document.querySelector("#clear-date-control-filters"),
  copyDateControlBrief: document.querySelector("#copy-date-control-brief"),
  exportDateControls: document.querySelector("#export-date-controls"),
  sourceNotePatternRoot: document.querySelector("#source-note-pattern-root"),
  sourceNotePatternSummary: document.querySelector("#source-note-pattern-summary"),
  sourceNotePatternSearch: document.querySelector("#source-note-pattern-search"),
  sourceNotePatternRepositoryFilter: document.querySelector("#source-note-pattern-repository-filter"),
  sourceNotePatternLaneFilter: document.querySelector("#source-note-pattern-lane-filter"),
  sourceNotePatternStatusFilter: document.querySelector("#source-note-pattern-status-filter"),
  clearSourceNotePatternFilters: document.querySelector("#clear-source-note-pattern-filters"),
  exportSourceNotePatterns: document.querySelector("#export-source-note-patterns"),
  ledgerRoot: document.querySelector("#ledger-root"),
  ledgerSummary: document.querySelector("#ledger-summary"),
  ledgerSearch: document.querySelector("#ledger-search"),
  ledgerIssueFilter: document.querySelector("#ledger-issue-filter"),
  ledgerLaneFilter: document.querySelector("#ledger-lane-filter"),
  ledgerPriorityFilter: document.querySelector("#ledger-priority-filter"),
  clearLedgerFilters: document.querySelector("#clear-ledger-filters"),
  exportLedger: document.querySelector("#export-ledger"),
  provenanceRoot: document.querySelector("#provenance-root"),
  provenanceSummary: document.querySelector("#provenance-summary"),
  provenanceSearch: document.querySelector("#provenance-search"),
  provenanceRepositoryFilter: document.querySelector("#provenance-repository-filter"),
  provenanceLaneFilter: document.querySelector("#provenance-lane-filter"),
  clearProvenanceFilters: document.querySelector("#clear-provenance-filters"),
  copyProvenanceBundle: document.querySelector("#copy-provenance-bundle"),
  exportProvenance: document.querySelector("#export-provenance")
};

const viewConfigs = [
  {
    sectionId: "records",
    stateKey: "records",
    resetNode: nodes.clearRecordFilters,
    fields: [
      { key: "query", param: "rq", node: nodes.recordSearch },
      { key: "chapter", param: "rchapter", node: nodes.chapterFilter },
      { key: "country", param: "rcountry", node: nodes.countryFilter },
      { key: "release", param: "rrelease", node: nodes.releaseFilter },
      { key: "availability", param: "ravailability", node: nodes.availabilityFilter }
    ]
  },
  {
    sectionId: "selection-board",
    stateKey: "selections",
    resetNode: nodes.clearSelectionFilters,
    fields: [
      { key: "query", param: "sq", node: nodes.selectionSearch },
      { key: "status", param: "sstatus", node: nodes.selectionStatusFilter },
      { key: "lane", param: "slane", node: nodes.selectionLaneFilter }
    ]
  },
  {
    sectionId: "production-readiness",
    stateKey: "production",
    resetNode: nodes.clearProductionFilters,
    fields: [
      { key: "query", param: "prodq", node: nodes.productionSearch },
      { key: "stage", param: "prodstage", node: nodes.productionStageFilter },
      { key: "lane", param: "prodlane", node: nodes.productionLaneFilter },
      { key: "priority", param: "prodpriority", node: nodes.productionPriorityFilter }
    ]
  },
  {
    sectionId: "annotation-queue",
    stateKey: "annotations",
    resetNode: nodes.clearAnnotationFilters,
    fields: [
      { key: "query", param: "aq", node: nodes.annotationSearch },
      { key: "status", param: "astatus", node: nodes.annotationStatusFilter },
      { key: "lane", param: "alane", node: nodes.annotationLaneFilter },
      { key: "type", param: "atype", node: nodes.annotationTypeFilter }
    ]
  },
  {
    sectionId: "chapter-briefs",
    stateKey: "chapterBriefs",
    resetNode: nodes.clearChapterBriefFilters,
    fields: [
      { key: "query", param: "cbq", node: nodes.chapterBriefSearch },
      { key: "lane", param: "cblane", node: nodes.chapterBriefLaneFilter },
      { key: "urgency", param: "cburgency", node: nodes.chapterBriefUrgencyFilter }
    ]
  },
  {
    sectionId: "gap-tracker",
    stateKey: "gaps",
    resetNode: nodes.clearGapFilters,
    fields: [
      { key: "query", param: "gq", node: nodes.gapSearch },
      { key: "lane", param: "glane", node: nodes.gapLaneFilter },
      { key: "priority", param: "gpriority", node: nodes.gapPriorityFilter },
      { key: "status", param: "gstatus", node: nodes.gapStatusFilter }
    ]
  },
  {
    sectionId: "source-pools",
    stateKey: "sourcePools",
    resetNode: nodes.clearSourcePoolFilters,
    fields: [
      { key: "query", param: "spq", node: nodes.sourcePoolSearch },
      { key: "lane", param: "splane", node: nodes.sourcePoolLaneFilter },
      { key: "priority", param: "sppriority", node: nodes.sourcePoolPriorityFilter }
    ]
  },
  {
    sectionId: "request-packets",
    stateKey: "requests",
    resetNode: nodes.clearRequestFilters,
    fields: [
      { key: "query", param: "reqq", node: nodes.requestSearch },
      { key: "repository", param: "reqrepository", node: nodes.requestRepositoryFilter },
      { key: "priority", param: "reqpriority", node: nodes.requestPriorityFilter }
    ]
  },
  {
    sectionId: "source-note-qa",
    stateKey: "sourceNotes",
    resetNode: nodes.clearSourceNoteFilters,
    fields: [
      { key: "query", param: "snq", node: nodes.sourceNoteSearch },
      { key: "status", param: "snstatus", node: nodes.sourceNoteStatusFilter },
      { key: "section", param: "snsection", node: nodes.sourceNoteSectionFilter },
      { key: "format", param: "snformat", node: nodes.sourceNoteFormatFilter }
    ]
  },
  {
    sectionId: "source-coverage",
    stateKey: "sourceCoverage",
    resetNode: nodes.clearSourceCoverageFilters,
    fields: [
      { key: "query", param: "scq", node: nodes.sourceCoverageSearch },
      { key: "status", param: "scstatus", node: nodes.sourceCoverageStatusFilter },
      { key: "format", param: "scformat", node: nodes.sourceCoverageFormatFilter }
    ]
  },
  {
    sectionId: "source-precedents",
    stateKey: "sourcePrecedents",
    resetNode: nodes.clearSourcePrecedentFilters,
    fields: [
      { key: "query", param: "spreq", node: nodes.sourcePrecedentSearch },
      { key: "status", param: "sprestatus", node: nodes.sourcePrecedentStatusFilter },
      { key: "family", param: "sprefamily", node: nodes.sourcePrecedentFamilyFilter },
      { key: "precedent", param: "spremodel", node: nodes.sourcePrecedentModelFilter }
    ]
  },
  {
    sectionId: "date-control",
    stateKey: "dateControls",
    resetNode: nodes.clearDateControlFilters,
    fields: [
      { key: "query", param: "dcq", node: nodes.dateControlSearch },
      { key: "lane", param: "dclane", node: nodes.dateControlLaneFilter },
      { key: "priority", param: "dcpriority", node: nodes.dateControlPriorityFilter }
    ]
  },
  {
    sectionId: "source-note-patterns",
    stateKey: "sourceNotePatterns",
    resetNode: nodes.clearSourceNotePatternFilters,
    fields: [
      { key: "query", param: "snpq", node: nodes.sourceNotePatternSearch },
      { key: "repository", param: "snprepository", node: nodes.sourceNotePatternRepositoryFilter },
      { key: "lane", param: "snplane", node: nodes.sourceNotePatternLaneFilter },
      { key: "status", param: "snpstatus", node: nodes.sourceNotePatternStatusFilter }
    ]
  },
  {
    sectionId: "source-copy-ledger",
    stateKey: "ledger",
    resetNode: nodes.clearLedgerFilters,
    fields: [
      { key: "query", param: "ledq", node: nodes.ledgerSearch },
      { key: "issue", param: "ledissue", node: nodes.ledgerIssueFilter },
      { key: "lane", param: "ledlane", node: nodes.ledgerLaneFilter },
      { key: "priority", param: "ledpriority", node: nodes.ledgerPriorityFilter }
    ]
  },
  {
    sectionId: "provenance-sheets",
    stateKey: "provenance",
    resetNode: nodes.clearProvenanceFilters,
    fields: [
      { key: "query", param: "pvq", node: nodes.provenanceSearch },
      { key: "repository", param: "pvrepo", node: nodes.provenanceRepositoryFilter },
      { key: "lane", param: "pvlane", node: nodes.provenanceLaneFilter }
    ]
  },
  {
    sectionId: "policy-files",
    stateKey: "policy",
    resetNode: nodes.clearPolicyFilters,
    fields: [
      { key: "query", param: "polq", node: nodes.policySearch },
      { key: "lane", param: "pollane", node: nodes.policyLaneFilter },
      { key: "priority", param: "polpriority", node: nodes.policyPriorityFilter }
    ]
  },
  {
    sectionId: "public-references",
    stateKey: "public",
    resetNode: nodes.clearPublicFilters,
    fields: [
      { key: "query", param: "pubq", node: nodes.publicSearch },
      { key: "lane", param: "publane", node: nodes.publicLaneFilter }
    ]
  },
  {
    sectionId: "boundary",
    stateKey: "boundary",
    resetNode: nodes.clearBoundaryFilters,
    fields: [
      { key: "query", param: "bq", node: nodes.boundarySearch },
      { key: "country", param: "bcountry", node: nodes.boundaryCountryFilter },
      { key: "type", param: "btype", node: nodes.boundaryTypeFilter }
    ]
  }
];

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
    item.issueType,
    item.releaseStatus,
    item.catalogLabel,
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
    item.action,
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
    item.stage,
    item.selectionStatus,
    item.sourceReadiness,
    item.sourceNoteReadiness,
    item.copyStatus,
    item.annotationLoad,
    item.boundaryDisposition,
    item.blocker,
    item.compilerMove,
    item.sourcePattern,
    item.targetType,
    item.target,
    item.linkedRecords?.join(" "),
    item.firstUse,
    item.annotationQuestion,
    item.draftPrompt,
    item.verificationNeeded,
    item.sourceHook,
    item.boundaryRule,
    item.exportNote,
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
    item.formatFamily,
    item.sourceNote,
    item.section,
    item.assessment,
    item.flags?.join(" "),
    item.patternType,
    item.precedent,
    item.sourceBase,
    item.template,
    item.volume37Use,
    item.readyWhen?.join(" "),
    item.rejectIf?.join(" "),
    item.status,
    item.citation,
    item.matchedTerms?.join(" "),
    item.nextActions?.join(" "),
    item.targetTerms?.join(" "),
    item.sourcePools?.join(" "),
    item.coverageId,
    item.formatFamily,
    item.risk,
    item.nextAction,
    item.sections,
    item.sampleTitles?.join(" "),
    item.precedentId,
    item.matchStatus,
    item.precedentModel,
    item.expectedShape,
    item.officialModel,
    item.repairActions?.join(" "),
    item.controlId,
    item.controlType,
    item.sourceType,
    item.dateRisk,
    item.diaryAsk,
    item.publicAnchor,
    item.internalBridge
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

function viewConfigForSection(sectionId) {
  return viewConfigs.find((config) => config.sectionId === sectionId);
}

function viewFieldForNode(node) {
  for (const config of viewConfigs) {
    for (const field of config.fields) {
      if (field.node === node) return { config, field };
    }
  }
  return null;
}

function viewConfigForReset(node) {
  return viewConfigs.find((config) => config.resetNode === node);
}

function setViewField(config, field, value) {
  if (!state[config.stateKey]) return;
  const normalizedValue = value || "";
  if (field.node?.tagName === "SELECT" && normalizedValue && !selectHasValue(field.node, normalizedValue)) return;
  state[config.stateKey][field.key] = normalizedValue;
  if (field.node) field.node.value = normalizedValue;
}

function selectHasValue(select, value) {
  return [...select.options].some((option) => option.value === value);
}

function restoreUrlState() {
  const params = new URLSearchParams(window.location.search);
  for (const config of viewConfigs) {
    for (const field of config.fields) {
      if (params.has(field.param)) setViewField(config, field, params.get(field.param));
    }
  }
}

function stateParamEntries(configs = viewConfigs) {
  const entries = [];
  for (const config of configs) {
    for (const field of config.fields) {
      const value = state[config.stateKey]?.[field.key] || "";
      if (value) entries.push([field.param, value]);
    }
  }
  return entries;
}

function currentStateParams(configs = viewConfigs) {
  const params = new URLSearchParams();
  for (const [key, value] of stateParamEntries(configs)) params.set(key, value);
  return params;
}

function sectionViewUrl(sectionId) {
  const config = viewConfigForSection(sectionId);
  const url = new URL(window.location.href);
  url.search = config ? currentStateParams([config]).toString() : "";
  url.hash = sectionId;
  return url.toString();
}

function syncUrlState(sectionId) {
  if (!window.history?.replaceState) return;
  const url = new URL(window.location.href);
  url.search = currentStateParams().toString();
  if (sectionId) url.hash = sectionId;
  window.history.replaceState(null, "", url);
}

async function copyViewUrl(button, sectionId) {
  const label = button.textContent;
  let copied = false;
  try {
    copied = await writeClipboardText(sectionViewUrl(sectionId));
  } catch (error) {
    copied = false;
  }
  button.textContent = copied ? "Copied" : "Copy failed";
  if (copied) button.dataset.copied = "true";
  else button.dataset.copyFailed = "true";
  setTimeout(() => {
    button.textContent = label;
    delete button.dataset.copied;
    delete button.dataset.copyFailed;
  }, 1200);
}

function setupViewStateEvents() {
  const syncInput = (event) => {
    const match = viewFieldForNode(event.target);
    if (match) syncUrlState(match.config.sectionId);
  };

  document.addEventListener("input", syncInput);
  document.addEventListener("change", syncInput);
  document.addEventListener("click", (event) => {
    const copyViewButton = event.target.closest("[data-copy-view]");
    if (copyViewButton) {
      copyViewUrl(copyViewButton, copyViewButton.dataset.copyView);
      return;
    }
    const resetConfig = viewConfigForReset(event.target);
    if (resetConfig) syncUrlState(resetConfig.sectionId);
  });
  document.addEventListener("DOMContentLoaded", scheduleCurrentHashScroll);
  window.addEventListener("load", scheduleCurrentHashScroll);
  window.addEventListener("hashchange", scheduleCurrentHashScroll);
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
      formatFamily: sourceNoteFamily(note),
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

function sourceNoteFamily(note) {
  const trimmed = String(note || "");
  if (/Public Papers/i.test(trimmed)) return "Public Papers";
  if (/National Archives,\s*RG 56/i.test(trimmed)) return "NARA RG 56";
  if (/National Archives,\s*RG 59/i.test(trimmed)) return "NARA RG 59";
  if (/National Archives,\s*RG 364/i.test(trimmed)) return "NARA RG 364";
  if (/Daily Diary/i.test(trimmed)) return "Daily Diary";
  if (/Reagan Library/i.test(trimmed)) return "Reagan Library";
  if (/Foreign Relations of the United States|source-base precedent|to be normalized/i.test(trimmed)) return "Reference";
  return "Other";
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
  const isPublicPapers = /Public Papers/i.test(trimmed);
  const usesFrusPublicPapersShortForm = /^Source: Public Papers: Reagan, \d{4}, (?:Book [IVX]+, )?pp\. \d/i.test(trimmed);
  const isReaganManuscriptSource = isSource && /Source: Reagan Library/.test(trimmed) && !/Public Papers|Daily Diary/i.test(trimmed);
  const isReaganStaffFileSource = isReaganManuscriptSource && /Danzansky|Baker|Sprinkel|Regan|WHORM|Staff|Files/i.test(trimmed);
  const isNationalArchivesSource = isSource && /National Archives,\s*RG \d+/i.test(trimmed);
  const needsReaganClassification = isSource && /Source: Reagan Library/.test(trimmed) && !/Public Papers|Daily Diary/i.test(trimmed);
  const hasClassification = /\b(Secret|Confidential|No classification marking|Limited Official Use|Unclassified)\./i.test(trimmed);

  if (isTarget) flags.push("Target note: do not publish until box/folder/document details are verified.");
  if (hasPlaceholder) flags.push("Contains unresolved bracket placeholder.");
  if (!hasFinalPunctuation) flags.push("Needs final punctuation.");
  if (isSource && hasPlaceholder) flags.push("Copy-ready prefix used with unresolved placeholder.");
  if (needsReaganClassification && !hasClassification) flags.push("Verify classification or handling line before publication.");
  if (isPublicPapers && isSource && !usesFrusPublicPapersShortForm) {
    flags.push("Public Papers citation should use FRUS short form: Source: Public Papers: Reagan, [year], [Book], pp. [pages].");
  }
  if (isPublicPapers && isSource && !/\bpp\.\s*\d/i.test(trimmed)) {
    flags.push("Public Papers citation needs page range before it is publication-ready.");
  }
  if (isReaganStaffFileSource && !/NLR|No drafting information|drafting|meeting took place|Copies? (?:were|was) sent|Sent through/i.test(trimmed)) {
    flags.push("Reagan Library staff-file note needs document-level control/context such as NLR, drafting, meeting, routing, or copy disposition.");
  }
  if (isNationalArchivesSource && !/\bBox\s+\d+/i.test(trimmed)) flags.push("National Archives source note needs box data.");
  if (isNationalArchivesSource && !hasClassification) flags.push("National Archives source note needs classification or handling line.");
  if (!isSource && !isTarget && !isReference) flags.push("Non-standard source-note prefix.");
  if (/^Source: Public Papers of the Presidents of the United States: Ronald Reagan\.$/.test(trimmed)) {
    flags.push("Collection-level Public Papers note; replace with document-level citation when selecting a document.");
  }

  if (flags.some((flag) => /Copy-ready prefix|punctuation|classification|Non-standard|Collection-level|Public Papers|page range|control\/context|box data|handling line/i.test(flag))) {
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
  const requestFirstRows = productionReadiness.filter((item) => item.stage === "Request first");
  const draftReadyRows = productionReadiness.filter((item) => item.stage === "Draft package");
  const blockedAnnotations = annotationQueue.filter((item) => /blocked|verify/i.test(item.status));
  const sourceMix = topCounts(records, (record) => record.source?.series || "Catalog item")
    .slice(0, 3)
    .map(([label, count]) => `${count} ${label}`)
    .join("; ");

  nodes.workbenchRoot.replaceChildren(
    metricCard("Chronology leads", records.length, `${openReferences.length} open web/PDF anchors across NSDDs, summit records, and Public Papers.`),
    metricCard("Page cap", pageBudget.totalPages || 1400, `${pageBudget.documentTargetPages || 1120} pages reserved for selected documents; source-copy PDFs require appended provenance sheets.`),
    metricCard("Selection calls", selectionBoard.length, `${draftSelections.length} draft candidates and ${criticalRequests.length} critical archive asks are ready for compiler triage.`),
    metricCard("Production rows", productionReadiness.length, `${draftReadyRows.length} draft packages can move now; ${requestFirstRows.length} request-first rows block the trade/monetary spine.`),
    metricCard("Summit spine", summitRecords.length, "Tokyo, Venice, Toronto, and G-7 preparation records to anchor industrialized-country cooperation."),
    metricCard("Annotation queue", annotationQueue.length, `${blockedAnnotations.length} annotation tasks need archive or verification work before final copy; ${criticalGaps.length} critical source gaps remain. ${sourceMix}`)
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

function priorityRank(priority) {
  return { Critical: 1, High: 2, Medium: 3, Low: 4 }[priority] || 9;
}

function packetTitle(item) {
  return item.title || item.target || item.workingTitle || item.recordId || item.id || "Untitled row";
}

function packetSort(a, b) {
  return (
    priorityRank(a.priority) - priorityRank(b.priority) ||
    (a.lane || "").localeCompare(b.lane || "") ||
    packetTitle(a).localeCompare(packetTitle(b))
  );
}

function selectionStatusRank(status) {
  return {
    "Draft candidate": 1,
    "Request-first": 2,
    "Context anchor": 3,
    "Boundary / exclude unless needed": 4
  }[status] || 99;
}

function selectionSort(a, b) {
  return (
    selectionStatusRank(a.status) - selectionStatusRank(b.status) ||
    priorityRank(a.priority) - priorityRank(b.priority) ||
    (a.lane || "").localeCompare(b.lane || "") ||
    (a.title || "").localeCompare(b.title || "")
  );
}

function packetSection(title, items, mapper) {
  const rows = [`${title}:`];
  if (!items.length) {
    rows.push("- None currently flagged.");
    return rows;
  }
  for (const item of [...items].sort(packetSort)) rows.push(`- ${mapper(item)}`);
  return rows;
}

function workbenchPacketText() {
  const draftReadyRows = productionReadiness.filter((item) => item.stage === "Draft package");
  const blockedReadinessRows = productionReadiness.filter((item) => item.stage !== "Draft package" && item.stage !== "Context anchor");
  const criticalRequests = requestPackets.filter((item) => item.priority === "Critical");
  const criticalLedgerRows = sourceCopyLedger.filter((item) => item.priority === "Critical");
  const blockedAnnotations = annotationQueue.filter((item) => /request-blocked|verify first|citation review|authority check|boundary check/i.test(item.status));
  const criticalGaps = gapTracker.filter((gap) => gap.priority === "Critical");
  const personsNeedingReview = persons.filter((person) => person.needsReview);

  return [
    "FRUS 1981-1988 Volume XXXVII work queue",
    `Copied: ${new Date().toISOString().slice(0, 10)}`,
    `Official volume: ${volumeConfig.url || "https://history.state.gov/historicaldocuments/frus1981-88v37"}`,
    "",
    ...packetSection("Draft packages that can move", draftReadyRows, (item) => `${item.id} ${item.title} (${item.lane}) - ${item.nextAction}`),
    "",
    ...packetSection("Production blockers", blockedReadinessRows, (item) => `${item.id} ${item.stage}/${item.priority}: ${item.title} - Blocker: ${item.blocker} Next: ${item.nextAction}`),
    "",
    ...packetSection("Critical archive asks", criticalRequests, (item) => `${item.repository}: ${item.title} - ${item.exactAsk}`),
    "",
    ...packetSection("Critical source-copy checks", criticalLedgerRows, (item) => `${item.issueType}: ${item.title} - ${item.action}`),
    "",
    ...packetSection("Annotation blockers", blockedAnnotations, (item) => `${item.id} ${item.status}: ${item.target} - Verify: ${item.verificationNeeded}`),
    "",
    ...packetSection("Critical gaps", criticalGaps, (gap) => `${gap.title} (${gap.lane}) - ${gap.needed}`),
    "",
    ...packetSection("Boundary reminders", boundaryRecords, (record) => `${record.compilerNumber} ${record.title} - ${record.boundaryReason}`),
    "",
    ...packetSection("Persons review queue", personsNeedingReview, (person) => `${person.displayName || person.entry} - ${person.reviewReason || "Normalize before final copy."}`)
  ].join("\n");
}

function estimatedSelectionPages(item) {
  if (Number.isFinite(item.budgetPages)) return item.budgetPages;
  if (item.status === "Request-first") return 90;
  if (item.status === "Draft candidate") return 6;
  if (item.status === "Context anchor") return 1;
  return 0;
}

function pageBudgetRows() {
  const targets = pageBudget.laneTargets || [];
  return targets.map((target, index) => {
    const selectionPages = selectionBoard
      .filter((item) => item.lane === target.lane)
      .reduce((sum, item) => sum + estimatedSelectionPages(item), 0);
    const currentAllowance = Number.isFinite(target.currentAllowance) ? target.currentAllowance : selectionPages;
    const remaining = Math.max(0, target.targetPages - currentAllowance);
    const percent = target.targetPages ? Math.min(100, Math.round((currentAllowance / target.targetPages) * 100)) : 0;
    return {
      budgetId: `PB-${String(index + 1).padStart(3, "0")}`,
      lane: target.lane,
      targetPages: target.targetPages || 0,
      currentAllowance,
      selectionPages,
      remaining,
      percent,
      rule: target.rule || ""
    };
  });
}

function renderPageBudget() {
  const rows = pageBudgetRows();
  const totalPages = pageBudget.totalPages || 1400;
  const documentTarget = pageBudget.documentTargetPages || rows.reduce((sum, row) => sum + row.targetPages, 0);
  const currentAllowance = rows.reduce((sum, row) => sum + row.currentAllowance, 0);
  const remaining = Math.max(0, documentTarget - currentAllowance);
  const reserve = pageBudget.apparatusReservePages || Math.max(0, totalPages - documentTarget);
  nodes.pageBudgetSummary.textContent = `${currentAllowance} working document pages allocated against a ${documentTarget}-page document target, with ${reserve} pages reserved for apparatus inside the ${totalPages}-page cap. ${remaining} document pages remain unallocated.`;
  nodes.pageBudgetRoot.replaceChildren(...rows.map(pageBudgetCard), pageBudgetRulesCard());
}

function pageBudgetCard(row) {
  const card = document.createElement("article");
  card.className = `file-card budget-card ${row.currentAllowance > row.targetPages ? "over-budget" : ""}`;
  const header = document.createElement("header");
  const titleBlock = document.createElement("div");
  const meta = document.createElement("div");
  meta.className = "file-meta";
  meta.append(textSpan(row.budgetId), textSpan(`${row.currentAllowance}/${row.targetPages} pages`));
  const title = document.createElement("h3");
  title.textContent = row.lane;
  titleBlock.append(meta, title);
  header.append(titleBlock);

  const bar = document.createElement("div");
  bar.className = "budget-bar";
  const fill = document.createElement("span");
  fill.style.width = `${row.percent}%`;
  bar.append(fill);

  const detail = document.createElement("p");
  detail.textContent = `${row.remaining} pages remain in this lane target. Current selection rows imply about ${row.selectionPages} pages before request-first lane allowances.`;
  const rule = document.createElement("p");
  rule.className = "source-note";
  rule.textContent = row.rule;
  card.append(header, chip(`${row.percent}% allocated`, row.currentAllowance > row.targetPages ? "warn" : "good"), bar, detail, rule);
  return card;
}

function pageBudgetRulesCard() {
  const card = document.createElement("article");
  card.className = "file-card budget-card rules-card";
  const title = document.createElement("h3");
  title.textContent = "Selection Rules";
  const reserve = document.createElement("p");
  reserve.textContent = pageBudget.reserveRule || "Keep apparatus and late substitutions inside the full volume cap.";
  const list = document.createElement("ul");
  list.className = "action-list";
  for (const rule of pageBudget.selectionRules || []) {
    const item = document.createElement("li");
    item.textContent = rule;
    list.append(item);
  }
  card.append(title, reserve, list);
  return card;
}

function pageBudgetBriefText() {
  const rows = pageBudgetRows();
  const totalPages = pageBudget.totalPages || 1400;
  const documentTarget = pageBudget.documentTargetPages || rows.reduce((sum, row) => sum + row.targetPages, 0);
  const currentAllowance = rows.reduce((sum, row) => sum + row.currentAllowance, 0);
  return [
    "FRUS 1981-1988 Volume XXXVII page budget",
    `Cap: ${totalPages} pages`,
    `Document target: ${documentTarget} pages`,
    `Current working allowance: ${currentAllowance} pages`,
    `Apparatus reserve: ${pageBudget.apparatusReservePages || Math.max(0, totalPages - documentTarget)} pages`,
    "",
    "Lane targets:",
    ...rows.map((row) => `- ${row.lane}: ${row.currentAllowance}/${row.targetPages} pages; ${row.remaining} remaining. Rule: ${row.rule}`),
    "",
    "Selection rules:",
    ...(pageBudget.selectionRules || []).map((rule) => `- ${rule}`)
  ].join("\n");
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
        syncUrlState("records");
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

function requestBundleText() {
  const visible = filteredRequestPackets().sort(packetSort);
  const output = [
    "FRUS Volume XXXVII archive request bundle",
    `Copied: ${new Date().toISOString().slice(0, 10)}`,
    `Filtered requests: ${visible.length} of ${requestPackets.length}`,
    ""
  ];

  if (!visible.length) {
    output.push("No archive request packets match the current filters.");
    return output.join("\n");
  }

  for (const packet of visible) {
    output.push(`${packet.priority} | ${packet.repository} | ${packet.title}`);
    output.push(`Lane/window: ${packet.lane} | ${packet.sourceWindow}`);
    output.push(`Request type: ${packet.requestType}`);
    output.push(`Purpose: ${packet.purpose}`);
    output.push(`Exact ask: ${packet.exactAsk}`);
    if (packet.requestText) output.push(`Request text: ${packet.requestText}`);
    if (packet.sourceNoteTarget) output.push(`Source-note target: ${packet.sourceNoteTarget}`);
    output.push(`Next step: ${packet.nextStep}`);
    if (packet.catalogUrl) output.push(`Source URL: ${packet.catalogUrl}`);
    if (packet.pdfUrl) output.push(`PDF URL: ${packet.pdfUrl}`);
    output.push("");
  }

  return output.join("\n").trimEnd();
}

function filteredSourceNoteAudit() {
  return sourceNoteAudit.filter((row) => {
    if (!matchesQuery(row, state.sourceNotes.query)) return false;
    if (state.sourceNotes.status && row.assessment !== state.sourceNotes.status) return false;
    if (state.sourceNotes.section && row.section !== state.sourceNotes.section) return false;
    if (state.sourceNotes.format && row.formatFamily !== state.sourceNotes.format) return false;
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
  chips.append(chip(row.formatFamily, row.assessment === "Needs review" ? "warn" : "boundary"));
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

function sourceNoteFixListText() {
  const rows = filteredSourceNoteAudit()
    .filter((row) => row.assessment === "Needs review" || row.assessment === "Target")
    .sort(
      (a, b) =>
        a.assessment.localeCompare(b.assessment) ||
        a.section.localeCompare(b.section) ||
        a.sourceTitle.localeCompare(b.sourceTitle)
    );
  const output = [
    "FRUS Volume XXXVII source-note fix list",
    `Copied: ${new Date().toISOString().slice(0, 10)}`,
    `Filtered rows: ${rows.length} of ${sourceNoteAudit.length} audited notes`,
    ""
  ];

  if (!rows.length) {
    output.push("No target or needs-review source notes match the current filters.");
    return output.join("\n");
  }

  for (const row of rows) {
    output.push(`${row.auditId} | ${row.assessment} | ${row.section} | ${row.sourceTitle}`);
    output.push(`Lane/date/format: ${row.lane}${row.dateText ? ` | ${row.dateText}` : ""} | ${row.formatFamily}`);
    if (row.identifier) output.push(`Identifier: ${row.identifier}`);
    output.push(`Flags: ${(row.flags || []).join("; ") || "No flags recorded."}`);
    output.push(`Source note: ${row.sourceNote}`);
    if (row.requestText) output.push(`Request text: ${row.requestText}`);
    if (row.catalogUrl) output.push(`Source URL: ${row.catalogUrl}`);
    if (row.pdfUrl) output.push(`PDF URL: ${row.pdfUrl}`);
    output.push("");
  }

  return output.join("\n").trimEnd();
}

function sourcePrecedentProfile(row) {
  const family = row.formatFamily;
  if (family === "NARA RG 56") {
    return {
      precedentModel: "Volume III RG 56 Treasury record",
      officialModel: "FRUS 1977-1980 Volume III source list and Document 258, note 1",
      sourceListUrl: "https://history.state.gov/historicaldocuments/frus1977-80v03/sources",
      exampleUrl: "https://history.state.gov/historicaldocuments/frus1977-80v03/d258",
      expectedShape: "Source: National Archives, RG 56, Records of [Treasury office/series], Box [number], [folder]. [Classification/handling]. [Review, routing, copy, or notation sentence when present]."
    };
  }
  if (family === "NARA RG 59") {
    return {
      precedentModel: "Volume III RG 59 State central/lot file",
      officialModel: "FRUS 1977-1980 Volume III source list",
      sourceListUrl: "https://history.state.gov/historicaldocuments/frus1977-80v03/sources",
      exampleUrl: "https://history.state.gov/historicaldocuments/frus1977-80v03/sources",
      expectedShape: "Source: National Archives, RG 59, [Central Foreign Policy File document number OR office lot-file title], [lot/accession if applicable], Box [number], [folder]. [Classification/handling]."
    };
  }
  if (family === "NARA RG 364") {
    return {
      precedentModel: "Volume III RG 364 trade representative files",
      officialModel: "FRUS 1977-1980 Volume III source list",
      sourceListUrl: "https://history.state.gov/historicaldocuments/frus1977-80v03/sources",
      exampleUrl: "https://history.state.gov/historicaldocuments/frus1977-80v03/sources",
      expectedShape: "Source: National Archives, RG 364, [Trade Representative records/subject files], [accession or series], Box [number], [folder]. [Classification/handling]. [Drafting, attachment, or signature note when present]."
    };
  }
  if (family === "Reagan Library") {
    return {
      precedentModel: "Volume XXXVIII Reagan Library staff-file note",
      officialModel: "FRUS 1981-1988 Volume XXXVIII source list and Danzansky document notes",
      sourceListUrl: "https://history.state.gov/historicaldocuments/frus1981-88v38/sources",
      exampleUrl: "https://history.state.gov/historicaldocuments/frus1981-88v38/d355",
      expectedShape: "Source: Reagan Library, [staff or NSC collection], [series or outline], [folder]; [NLR/control number when available]. [Classification/handling]. [Meeting place, drafting, routing, copy, or notation sentence when present]."
    };
  }
  if (family === "Public Papers") {
    return {
      precedentModel: "Published Public Papers endpoint",
      officialModel: "FRUS 1981-1988 Volume XXXVIII public-source cross-reference practice",
      sourceListUrl: "https://history.state.gov/historicaldocuments/frus1981-88v38/sources",
      exampleUrl: "https://history.state.gov/historicaldocuments/frus1981-88v38/d191",
      expectedShape: "Source: Public Papers: Reagan, [year], Book [I/II when applicable], pp. [page range]. Use as endpoint or cross-reference unless paired with an internal archival source."
    };
  }
  if (family === "Daily Diary") {
    return {
      precedentModel: "Presidential Daily Diary cross-reference",
      officialModel: "Volume III and Volume XXXVIII source lists include Presidential Daily Diary holdings",
      sourceListUrl: "https://history.state.gov/historicaldocuments/frus1981-88v38/sources",
      exampleUrl: "https://history.state.gov/historicaldocuments/frus1977-80v03/d26",
      expectedShape: "Cross-reference target: Reagan Library, President Reagan's Daily Diary, [date]. Use for time, place, attendees, and no-memorandum checks unless the diary itself is selected."
    };
  }
  if (family === "Reference") {
    return {
      precedentModel: "Adjacent FRUS reference control",
      officialModel: "History.state.gov adjacent-volume references",
      sourceListUrl: "https://history.state.gov/historicaldocuments/reagan",
      exampleUrl: row.catalogUrl || "https://history.state.gov/historicaldocuments/reagan",
      expectedShape: "Foreign Relations of the United States, [years], Volume [number], [title]. Use as boundary evidence, not as a selected-document source note."
    };
  }
  return {
    precedentModel: "Unmapped source-note family",
    officialModel: "Manual editor review required",
    sourceListUrl: volumeConfig.url || "https://history.state.gov/historicaldocuments/frus1981-88v37",
    exampleUrl: volumeConfig.url || "https://history.state.gov/historicaldocuments/frus1981-88v37",
    expectedShape: "Normalize against the closest published FRUS source note before final copy."
  };
}

function sourcePrecedentFailures(row, profile) {
  const note = row.sourceNote || "";
  const failures = [];
  const isTarget = note.startsWith("Source-note target:");
  const isSource = note.startsWith("Source:");
  const hasPlaceholder = /\[[^\]]+\]/.test(note);
  const hasClassification = /\b(Top Secret|Secret|Confidential|No classification marking|Limited Official Use|Unclassified)\./i.test(note);

  if (hasPlaceholder) failures.push("Resolve bracket placeholders before final copy.");
  if (!/[.!?]$/.test(note.trim())) failures.push("Add final punctuation.");

  if (profile.precedentModel.includes("RG 56")) {
    if (!isSource && !isTarget) failures.push("Use Source or Source-note target prefix.");
    if (!/National Archives,\s*RG 56/i.test(note)) failures.push("Identify National Archives, RG 56.");
    if (!/Records of/i.test(note)) failures.push("Name the Treasury records series or office.");
    if (!/\bBox\s+\d+/i.test(note) && !isTarget) failures.push("Add exact box number.");
    if (!hasClassification && !isTarget) failures.push("Add classification or handling sentence.");
  } else if (profile.precedentModel.includes("RG 59")) {
    if (!/National Archives,\s*RG 59/i.test(note)) failures.push("Identify National Archives, RG 59.");
    if (!/Central Foreign Policy File|Lot \d|Office of|Secretariat Staff/i.test(note)) failures.push("Separate Central Foreign Policy File document numbers from lot-file citations.");
    if (!/\bBox\s+\d+/i.test(note) && !/Central Foreign Policy File,\s*[A-Z]\d/i.test(note) && !isTarget) failures.push("Add box/folder or CFPF document-number detail.");
  } else if (profile.precedentModel.includes("RG 364")) {
    if (!/National Archives,\s*RG 364/i.test(note)) failures.push("Identify National Archives, RG 364.");
    if (!/Trade Representative|United States Trade Representative|Subject Files/i.test(note)) failures.push("Name the USTR/STR records or subject-file series.");
    if (!/\bBox\s+\d+/i.test(note) && !isTarget) failures.push("Add exact box number.");
    if (!hasClassification && !isTarget) failures.push("Add classification or handling sentence.");
  } else if (profile.precedentModel.includes("Reagan Library")) {
    if (!/Reagan Library/i.test(note)) failures.push("Identify Reagan Library repository.");
    if (!/Files|Executive Secretariat|NSC|WHORM|Baker|Danzansky|Sprinkel|Farrar/i.test(note)) failures.push("Name the collection or staff-file lane.");
    if (!/NLR|Box|RAC Box|OA\s+\d+/i.test(note) && !isTarget) failures.push("Add NLR, box, RAC box, or OA control.");
    if (!hasClassification && !isTarget) failures.push("Add classification or no-classification line.");
    if (!/No drafting information|Sent for|Copies? (?:were|was) sent|meeting took place|stamped notation|written at the top|approved|not approve|not disapprove/i.test(note) && !isTarget) {
      failures.push("Add document-level drafting, routing, meeting, copy, or notation context if visible.");
    }
  } else if (profile.precedentModel.includes("Public Papers")) {
    if (!/^Source: Public Papers: Reagan, \d{4}, (?:Book [IVX]+, )?pp\. \d/i.test(note)) {
      failures.push("Use FRUS short form: Source: Public Papers: Reagan, [year], [Book], pp. [pages].");
    }
    if (!/\bpp\.\s*\d/i.test(note)) failures.push("Add page range.");
  } else if (profile.precedentModel.includes("Daily Diary")) {
    if (!/^Cross-reference target: Reagan Library, President Reagan's Daily Diary,/i.test(note)) {
      failures.push("Keep Daily Diary rows as cross-reference targets unless selecting the diary itself.");
    }
  } else if (profile.precedentModel.includes("Adjacent FRUS")) {
    if (/^Source:/i.test(note)) failures.push("Use adjacent FRUS volumes as boundary references, not Source notes.");
  }

  return [...new Set([...(row.flags || []), ...failures])];
}

function sourcePrecedentStatus(row, failures) {
  if (row.assessment === "Reference") return "Reference control";
  if (row.assessment === "Target" || row.sourceNote.startsWith("Source-note target:")) return "Target only";
  if (failures.length || row.assessment === "Needs review") return "Needs repair";
  if (row.assessment === "Ready") return "Matches precedent";
  return "Manual review";
}

function sourcePrecedentNextAction(row) {
  if (row.matchStatus === "Matches precedent") return "Keep as candidate copy, but verify against source image before final publication.";
  if (row.matchStatus === "Target only") return "Do not publish with Source prefix until exact repository, series, box/folder, document, and handling data are verified.";
  if (row.matchStatus === "Reference control") return "Use for boundary, cross-reference, or adjacent-volume routing rather than selected-document source copy.";
  return "Repair the source note against the official precedent model before moving this row into draft copy.";
}

function buildSourcePrecedentRows() {
  return sourceNoteAudit.map((row, index) => {
    const profile = sourcePrecedentProfile(row);
    const failures = sourcePrecedentFailures(row, profile);
    const matchStatus = sourcePrecedentStatus(row, failures);
    const precedentRow = {
      ...row,
      precedentId: `SP-${String(index + 1).padStart(3, "0")}`,
      matchStatus,
      precedentModel: profile.precedentModel,
      officialModel: profile.officialModel,
      sourceListUrl: profile.sourceListUrl,
      exampleUrl: profile.exampleUrl,
      expectedShape: profile.expectedShape,
      repairActions: failures
    };
    precedentRow.nextAction = sourcePrecedentNextAction(precedentRow);
    return precedentRow;
  });
}

function sourcePrecedentStatusRank(status) {
  return {
    "Needs repair": 1,
    "Target only": 2,
    "Manual review": 3,
    "Reference control": 4,
    "Matches precedent": 5
  }[status] || 9;
}

function sourcePrecedentSort(a, b) {
  return (
    sourcePrecedentStatusRank(a.matchStatus) - sourcePrecedentStatusRank(b.matchStatus) ||
    (a.precedentModel || "").localeCompare(b.precedentModel || "") ||
    (a.section || "").localeCompare(b.section || "") ||
    (a.sourceTitle || "").localeCompare(b.sourceTitle || "")
  );
}

function filteredSourcePrecedentRows() {
  return sourcePrecedentRows.filter((row) => {
    if (!matchesQuery(row, state.sourcePrecedents.query)) return false;
    if (state.sourcePrecedents.status && row.matchStatus !== state.sourcePrecedents.status) return false;
    if (state.sourcePrecedents.family && row.formatFamily !== state.sourcePrecedents.family) return false;
    if (state.sourcePrecedents.precedent && row.precedentModel !== state.sourcePrecedents.precedent) return false;
    return true;
  });
}

function renderSourcePrecedents() {
  const visible = filteredSourcePrecedentRows().sort(sourcePrecedentSort);
  const counts = topCounts(sourcePrecedentRows, (row) => row.matchStatus)
    .map(([label, count]) => `${count} ${label.toLowerCase()}`)
    .join("; ");
  nodes.sourcePrecedentSummary.textContent = `${plural(visible.length, "precedent row")} visible from ${sourcePrecedentRows.length} source-note precedent checks. ${counts}.`;
  nodes.sourcePrecedentRoot.replaceChildren(...visible.map(sourcePrecedentCard));
  if (!visible.length) nodes.sourcePrecedentRoot.innerHTML = '<p class="empty">No precedent rows match the current filters.</p>';
}

function sourcePrecedentCard(row) {
  const card = document.createElement("article");
  card.className = `file-card source-precedent-card status-${slug(row.matchStatus)}`;

  const header = document.createElement("header");
  const titleBlock = document.createElement("div");
  const meta = document.createElement("div");
  meta.className = "file-meta";
  meta.append(textSpan(row.precedentId), textSpan(row.matchStatus), textSpan(row.formatFamily));
  const title = document.createElement("h3");
  title.textContent = row.sourceTitle;
  titleBlock.append(meta, title);
  header.append(titleBlock);

  const chips = document.createElement("div");
  chips.className = "chips";
  chips.append(chip(row.precedentModel, row.matchStatus === "Needs repair" ? "warn" : row.matchStatus === "Matches precedent" ? "good" : "boundary"));
  chips.append(chip(row.section));
  if (row.identifier) chips.append(chip(row.identifier));

  const model = document.createElement("p");
  model.textContent = row.officialModel;
  const expected = document.createElement("p");
  expected.className = "source-note";
  expected.textContent = `Expected shape: ${row.expectedShape}`;
  const note = document.createElement("p");
  note.className = "source-note";
  note.textContent = row.sourceNote;
  const actionsNeeded = briefList("Repair / verification actions", row.repairActions.length ? row.repairActions : ["No format repair flagged; verify against source image before publication."]);
  const next = document.createElement("p");
  next.className = "source-note";
  next.textContent = `Next action: ${row.nextAction}`;

  const actions = document.createElement("div");
  actions.className = "file-actions";
  if (row.sourceListUrl) actions.append(linkButton("Source list", row.sourceListUrl));
  if (row.exampleUrl) actions.append(linkButton("Example", row.exampleUrl));
  actions.append(copyButton(sourcePrecedentMemo(row), "Copy precedent memo"));

  card.append(header, chips, model, expected, note, actionsNeeded, next, actions);
  return card;
}

function sourcePrecedentMemo(row) {
  return [
    `${row.precedentId}: ${row.sourceTitle}`,
    `Status: ${row.matchStatus}`,
    `Family/model: ${row.formatFamily} | ${row.precedentModel}`,
    `Official model: ${row.officialModel}`,
    `Section/lane: ${row.section} | ${row.lane}`,
    "",
    `Expected shape: ${row.expectedShape}`,
    "",
    `Current note: ${row.sourceNote}`,
    "",
    "Repair / verification actions:",
    ...(row.repairActions.length ? row.repairActions : ["No format repair flagged; verify against source image before publication."]).map((item) => `- ${item}`),
    "",
    `Next action: ${row.nextAction}`,
    `Source list: ${row.sourceListUrl}`,
    `Example: ${row.exampleUrl}`
  ].join("\n");
}

function sourcePrecedentChecklistText() {
  const visible = filteredSourcePrecedentRows().sort(sourcePrecedentSort);
  const output = [
    "FRUS Volume XXXVII source-note precedent checklist",
    `Copied: ${new Date().toISOString().slice(0, 10)}`,
    `Filtered precedent rows: ${visible.length} of ${sourcePrecedentRows.length}`,
    ""
  ];

  if (!visible.length) {
    output.push("No source-note precedent rows match the current filters.");
    return output.join("\n");
  }

  for (const row of visible) {
    output.push(`${row.precedentId} | ${row.matchStatus} | ${row.precedentModel} | ${row.sourceTitle}`);
    output.push(`Section/lane/family: ${row.section} | ${row.lane} | ${row.formatFamily}`);
    output.push(`Expected shape: ${row.expectedShape}`);
    output.push(`Current note: ${row.sourceNote}`);
    output.push(`Repair actions: ${row.repairActions.length ? row.repairActions.join("; ") : "No format repair flagged; verify source image."}`);
    output.push(`Next action: ${row.nextAction}`);
    output.push(`Source list: ${row.sourceListUrl}`);
    output.push(`Example: ${row.exampleUrl}`);
    output.push("");
  }

  return output.join("\n").trimEnd();
}

function buildSourceCoverageRows() {
  const map = new Map();
  for (const row of sourceNoteAudit) {
    const key = `${row.lane}::${row.formatFamily}`;
    if (!map.has(key)) {
      map.set(key, {
        lane: row.lane,
        formatFamily: row.formatFamily,
        total: 0,
        ready: 0,
        target: 0,
        needsReview: 0,
        reference: 0,
        sectionsSet: new Set(),
        sampleTitles: []
      });
    }
    const coverage = map.get(key);
    coverage.total += 1;
    if (row.assessment === "Ready") coverage.ready += 1;
    if (row.assessment === "Target") coverage.target += 1;
    if (row.assessment === "Needs review") coverage.needsReview += 1;
    if (row.assessment === "Reference") coverage.reference += 1;
    coverage.sectionsSet.add(row.section);
    if (coverage.sampleTitles.length < 3 && (row.assessment === "Needs review" || row.assessment === "Target")) {
      coverage.sampleTitles.push(row.sourceTitle);
    }
  }

  return [...map.values()]
    .map((row, index) => {
      const normalized = {
        ...row,
        coverageId: `SC-${String(index + 1).padStart(3, "0")}`,
        sections: [...row.sectionsSet].sort((a, b) => a.localeCompare(b)).join("; ")
      };
      delete normalized.sectionsSet;
      normalized.risk = sourceCoverageRisk(normalized);
      normalized.nextAction = sourceCoverageNextAction(normalized);
      return normalized;
    })
    .sort(sourceCoverageSort)
    .map((row, index) => ({ ...row, coverageId: `SC-${String(index + 1).padStart(3, "0")}` }));
}

function sourceCoverageRisk(row) {
  if (row.formatFamily === "Public Papers" && row.needsReview > 0) return "Published citation repair";
  if (/^NARA/.test(row.formatFamily) && row.target > 0 && row.ready === 0) return "Archive target";
  if (row.needsReview > row.ready) return "Citation repair";
  if (row.ready === 0 && row.target > 0) return "Request-first";
  if (row.reference === row.total) return "Boundary/reference";
  return "Usable source base";
}

function sourceCoverageNextAction(row) {
  if (row.formatFamily === "Public Papers" && row.needsReview > 0) {
    return "Normalize to FRUS Public Papers short form with year, book where applicable, and page range.";
  }
  if (/^NARA/.test(row.formatFamily) && row.target > 0) {
    return "Keep as target until exact series/accession, box, folder, document, and classification data are verified.";
  }
  if (row.formatFamily === "Reagan Library" && row.needsReview > 0) {
    return "Verify document-level control, NLR/routing context, attachments, and classification before final source note.";
  }
  if (row.target > 0) return "Convert target rows to document-level source notes after source pulls.";
  if (row.ready > 0) return "Use ready rows only after final source-image check.";
  return "Use as a boundary or reference control rather than a selected-document source note.";
}

function sourceCoverageSort(a, b) {
  return (
    sourceCoverageRiskRank(a.risk) - sourceCoverageRiskRank(b.risk) ||
    (a.lane || "").localeCompare(b.lane || "") ||
    (a.formatFamily || "").localeCompare(b.formatFamily || "")
  );
}

function sourceCoverageRiskRank(risk) {
  return {
    "Archive target": 1,
    "Published citation repair": 2,
    "Citation repair": 3,
    "Request-first": 4,
    "Usable source base": 5,
    "Boundary/reference": 6
  }[risk] || 9;
}

function sourceCoverageStatusCount(row, status) {
  return {
    "Needs review": row.needsReview,
    Target: row.target,
    Ready: row.ready,
    Reference: row.reference
  }[status] || 0;
}

function filteredSourceCoverageRows() {
  return sourceCoverageRows.filter((row) => {
    if (!matchesQuery(row, state.sourceCoverage.query)) return false;
    if (state.sourceCoverage.format && row.formatFamily !== state.sourceCoverage.format) return false;
    if (state.sourceCoverage.status && sourceCoverageStatusCount(row, state.sourceCoverage.status) === 0) return false;
    return true;
  });
}

function renderSourceCoverage() {
  const visible = filteredSourceCoverageRows().sort(sourceCoverageSort);
  const totalNotes = visible.reduce((sum, row) => sum + row.total, 0);
  const repairRows = visible.filter((row) => row.needsReview > 0 || row.target > 0).length;
  const repairVerb = repairRows === 1 ? "needs" : "need";
  nodes.sourceCoverageSummary.textContent = `${plural(visible.length, "coverage row")} covering ${plural(totalNotes, "source note")} from ${sourceCoverageRows.length} lane/format groups. ${plural(repairRows, "row")} still ${repairVerb} citation repair or archival conversion.`;
  nodes.sourceCoverageRoot.replaceChildren(...visible.map(sourceCoverageCard));
  if (!visible.length) nodes.sourceCoverageRoot.innerHTML = '<p class="empty">No source coverage rows match the current filters.</p>';
}

function sourceCoverageCard(row) {
  const card = document.createElement("article");
  card.className = `file-card coverage-card status-${slug(row.risk)}`;

  const header = document.createElement("header");
  const titleBlock = document.createElement("div");
  const meta = document.createElement("div");
  meta.className = "file-meta";
  meta.append(textSpan(row.coverageId), textSpan(row.formatFamily), textSpan(row.risk));
  const title = document.createElement("h3");
  title.textContent = row.lane;
  titleBlock.append(meta, title);
  header.append(titleBlock);

  const counts = document.createElement("dl");
  counts.className = "coverage-counts";
  for (const [label, value] of [
    ["Total", row.total],
    ["Ready", row.ready],
    ["Target", row.target],
    ["Review", row.needsReview],
    ["Reference", row.reference]
  ]) {
    const group = document.createElement("div");
    const term = document.createElement("dt");
    term.textContent = label;
    const detail = document.createElement("dd");
    detail.textContent = value.toString();
    group.append(term, detail);
    counts.append(group);
  }

  const sections = document.createElement("p");
  sections.className = "source-note";
  sections.textContent = `Sections: ${row.sections}`;
  const next = document.createElement("p");
  next.className = "source-note";
  next.textContent = `Next action: ${row.nextAction}`;
  const samples = document.createElement("p");
  samples.className = "source-note";
  samples.textContent = `Examples: ${row.sampleTitles.length ? row.sampleTitles.join("; ") : "No repair examples in this group."}`;

  const actions = document.createElement("div");
  actions.className = "file-actions";
  actions.append(copyButton(sourceCoverageMemo(row), "Copy coverage memo"));

  card.append(header, counts, sections, next, samples, actions);
  return card;
}

function sourceCoverageMemo(row) {
  return [
    `${row.coverageId}: ${row.lane} / ${row.formatFamily}`,
    `Risk: ${row.risk}`,
    `Counts: total ${row.total}; ready ${row.ready}; target ${row.target}; needs review ${row.needsReview}; reference ${row.reference}`,
    `Sections: ${row.sections}`,
    `Next action: ${row.nextAction}`,
    `Examples: ${row.sampleTitles.length ? row.sampleTitles.join("; ") : "No repair examples in this group."}`
  ].join("\n");
}

function sourceCoverageBriefText() {
  const visible = filteredSourceCoverageRows().sort(sourceCoverageSort);
  const output = [
    "FRUS Volume XXXVII source coverage brief",
    `Copied: ${new Date().toISOString().slice(0, 10)}`,
    `Filtered coverage rows: ${visible.length} of ${sourceCoverageRows.length}`,
    ""
  ];

  if (!visible.length) {
    output.push("No source coverage rows match the current filters.");
    return output.join("\n");
  }

  for (const row of visible) {
    output.push(`${row.coverageId} | ${row.risk} | ${row.lane} | ${row.formatFamily}`);
    output.push(`Counts: total ${row.total}; ready ${row.ready}; target ${row.target}; needs review ${row.needsReview}; reference ${row.reference}`);
    output.push(`Sections: ${row.sections}`);
    output.push(`Next action: ${row.nextAction}`);
    if (row.sampleTitles.length) output.push(`Examples: ${row.sampleTitles.join("; ")}`);
    output.push("");
  }

  return output.join("\n").trimEnd();
}

function buildDateControlRows() {
  return records
    .filter(needsDateControl)
    .sort(byChapterThenDate)
    .map((record, index) => {
      const row = {
        controlId: `DC-${String(index + 1).padStart(3, "0")}`,
        lane: record.chapter?.name || "Unassigned",
        priority: dateControlPriority(record),
        dateText: record.dateText || record.date || "",
        sortDate: record.sortDate || record.date || "",
        title: record.title,
        sourceType: record.type,
        country: record.country,
        participants: record.participants || [],
        catalogUrl: record.catalogUrl,
        pdfUrl: record.pdfUrl,
        sourceNote: preferredSourceNote(record),
        publicAnchor: /Public Papers/i.test(record.type || record.source?.series || ""),
        controlType: dateControlType(record),
        dateRisk: dateControlRisk(record),
        diaryAsk: dateControlAsk(record),
        internalBridge: dateControlBridge(record)
      };
      return row;
    });
}

function needsDateControl(record) {
  const text = [record.title, record.type, record.counterpart, record.chapter?.name, record.notes, (record.participants || []).join(" ")].join(" ");
  return /Public Papers|Summit|G-7|G-5|news conference|statement|radio address|Mulroney|Nakasone|Thatcher|Kohl|Mitterrand|Takeshita|Baker|Brady|Volcker|Greenspan|Powell|Sprinkel|Diary/i.test(text);
}

function dateControlPriority(record) {
  const text = [record.title, record.type, record.counterpart, record.chapter?.name].join(" ");
  if (/Toronto|NSDD 297|Plaza|Louvre|G-5|G-7|foreign exchange|Summit Group/i.test(text)) return "Critical";
  if (/Summit|Canada Free Trade|Grain|NSDD|News Conference/i.test(text)) return "High";
  return "Medium";
}

function dateControlType(record) {
  const text = [record.title, record.type, record.counterpart].join(" ");
  if (/Public Papers|radio address|statement|news conference|declaration|remarks/i.test(text)) return "Public endpoint";
  if (/NSDD|directive/i.test(text)) return "Directive anchor";
  if (/memorandum|report|folder PDF/i.test(text)) return "Internal-file bridge";
  return "Chronology control";
}

function dateControlRisk(record) {
  const text = [record.title, record.type, record.counterpart, record.notes].join(" ");
  if (/Public Papers|radio address|statement|news conference|declaration|remarks/i.test(text)) {
    return "Public event needs Daily Diary time/location check before annotation or chronology reliance.";
  }
  if (/Summit|G-7|G-5|Toronto|Venice|Tokyo/i.test(text)) {
    return "Summit record needs diary/date control for meetings, travel, calls, and participant context.";
  }
  if (/Grain|Canada|Japan|Soviet|Mulroney|Nakasone|Takeshita/i.test(text)) {
    return "Bilateral or issue lead needs diary/contact check before treating it as a decision point.";
  }
  return "Date and participant context should be checked against the Presidential Daily Diary or backup schedule.";
}

function dateControlAsk(record) {
  return `Check President Reagan's Daily Diary and backup schedule for ${record.dateText || record.date}: ${record.title}. Confirm time, location, participants, travel/call status, and whether a substantive memorandum exists.`;
}

function dateControlBridge(record) {
  if (/Public Papers|radio address|statement|news conference|declaration|remarks/i.test([record.title, record.type].join(" "))) {
    return "Use the public item as endpoint only; pair it with speech-clearance, NSC, State, Treasury, or USTR records before final selection.";
  }
  if (/NSDD|directive/i.test(record.type || "")) {
    return "Use the diary as context only; source-copy work still needs NSDD attachments/background papers.";
  }
  return "Use the diary as corroboration; selected documentation still needs the substantive archival record.";
}

function dateControlSort(a, b) {
  return (
    priorityRank(a.priority) - priorityRank(b.priority) ||
    (a.sortDate || "").localeCompare(b.sortDate || "") ||
    (a.lane || "").localeCompare(b.lane || "") ||
    (a.title || "").localeCompare(b.title || "")
  );
}

function filteredDateControlRows() {
  return dateControlRows.filter((row) => {
    if (!matchesQuery(row, state.dateControls.query)) return false;
    if (state.dateControls.lane && row.lane !== state.dateControls.lane) return false;
    if (state.dateControls.priority && row.priority !== state.dateControls.priority) return false;
    return true;
  });
}

function renderDateControls() {
  const visible = filteredDateControlRows().sort(dateControlSort);
  const critical = visible.filter((row) => row.priority === "Critical").length;
  const publicAnchors = visible.filter((row) => row.publicAnchor).length;
  nodes.dateControlSummary.textContent = `${plural(visible.length, "date-control row")} visible from ${dateControlRows.length} diary checks. ${plural(critical, "critical row")} and ${plural(publicAnchors, "public endpoint")} in this view.`;
  nodes.dateControlRoot.replaceChildren(...visible.map(dateControlCard));
  if (!visible.length) nodes.dateControlRoot.innerHTML = '<p class="empty">No date-control rows match the current filters.</p>';
}

function dateControlCard(row) {
  const card = document.createElement("article");
  card.className = `record-card date-control-card priority-${row.priority.toLowerCase()}`;

  const header = document.createElement("header");
  const titleBlock = document.createElement("div");
  const meta = document.createElement("div");
  meta.className = "record-id";
  meta.append(textSpan(row.controlId), textSpan(row.dateText), textSpan(row.priority), textSpan(row.controlType));
  const title = document.createElement("h4");
  title.textContent = row.title;
  titleBlock.append(meta, title);
  const chips = document.createElement("div");
  chips.className = "chips";
  chips.append(chip(row.lane), chip(row.country), chip(row.publicAnchor ? "Public endpoint" : "Internal/source lead", row.publicAnchor ? "warn" : "boundary"));
  header.append(titleBlock, chips);

  const participants = document.createElement("p");
  participants.textContent = row.participants.length ? row.participants.join(" / ") : "Participants not yet recorded.";
  const risk = document.createElement("p");
  risk.className = "source-note";
  risk.textContent = `Risk: ${row.dateRisk}`;
  const ask = document.createElement("p");
  ask.className = "source-note";
  ask.textContent = `Diary ask: ${row.diaryAsk}`;
  const bridge = document.createElement("p");
  bridge.className = "source-note";
  bridge.textContent = `Bridge rule: ${row.internalBridge}`;

  const actions = document.createElement("div");
  actions.className = "record-actions";
  actions.append(linkButton("Daily Diary", "https://www.reaganlibrary.gov/archives/reagans-daily-diary"));
  if (row.catalogUrl) actions.append(linkButton("Source", row.catalogUrl));
  if (row.pdfUrl) actions.append(linkButton("PDF", row.pdfUrl));
  actions.append(copyButton(dateControlMemo(row), "Copy diary memo"));

  card.append(header, participants, risk, ask, bridge, actions);
  return card;
}

function dateControlMemo(row) {
  return [
    `${row.controlId}: ${row.title}`,
    `Date/lane: ${row.dateText} | ${row.lane}`,
    `Priority/type: ${row.priority} | ${row.controlType}`,
    `Participants: ${row.participants.length ? row.participants.join("; ") : "Participants not yet recorded."}`,
    `Risk: ${row.dateRisk}`,
    `Diary ask: ${row.diaryAsk}`,
    `Bridge rule: ${row.internalBridge}`,
    `Source note: ${row.sourceNote || "No source note recorded."}`,
    `Source URL: ${row.catalogUrl || "No source URL recorded."}`
  ].join("\n");
}

function dateControlBriefText() {
  const visible = filteredDateControlRows().sort(dateControlSort);
  const output = [
    "FRUS Volume XXXVII Daily Diary date-control brief",
    `Copied: ${new Date().toISOString().slice(0, 10)}`,
    `Filtered date-control rows: ${visible.length} of ${dateControlRows.length}`,
    ""
  ];

  if (!visible.length) {
    output.push("No date-control rows match the current filters.");
    return output.join("\n");
  }

  for (const row of visible) {
    output.push(`${row.controlId} | ${row.priority} | ${row.dateText} | ${row.lane} | ${row.title}`);
    output.push(`Type: ${row.controlType} | Country: ${row.country}`);
    output.push(`Participants: ${row.participants.length ? row.participants.join("; ") : "Participants not yet recorded."}`);
    output.push(`Diary ask: ${row.diaryAsk}`);
    output.push(`Bridge rule: ${row.internalBridge}`);
    if (row.catalogUrl) output.push(`Source URL: ${row.catalogUrl}`);
    if (row.pdfUrl) output.push(`PDF URL: ${row.pdfUrl}`);
    output.push("");
  }

  return output.join("\n").trimEnd();
}

function filteredSourceNotePatterns() {
  return sourceNotePatterns.filter((pattern) => {
    if (!matchesQuery(pattern, state.sourceNotePatterns.query)) return false;
    if (state.sourceNotePatterns.repository && pattern.repository !== state.sourceNotePatterns.repository) return false;
    if (state.sourceNotePatterns.lane && pattern.lane !== state.sourceNotePatterns.lane) return false;
    if (state.sourceNotePatterns.status && pattern.status !== state.sourceNotePatterns.status) return false;
    return true;
  });
}

function renderSourceNotePatterns() {
  const statusOrder = new Map([
    ["Copy-ready pattern", 1],
    ["Target-only pattern", 2],
    ["Published reference", 3],
    ["Corroboration only", 4]
  ]);
  const visible = filteredSourceNotePatterns().sort(
    (a, b) =>
      (statusOrder.get(a.status) || 99) - (statusOrder.get(b.status) || 99) ||
      a.repository.localeCompare(b.repository) ||
      a.patternType.localeCompare(b.patternType)
  );
  const counts = topCounts(sourceNotePatterns, (pattern) => pattern.status)
    .map(([label, count]) => `${count} ${label.toLowerCase()}`)
    .join("; ");
  nodes.sourceNotePatternSummary.textContent = `${plural(visible.length, "pattern")} visible from ${sourceNotePatterns.length} source-note templates. ${counts}.`;
  nodes.sourceNotePatternRoot.replaceChildren(...visible.map(sourceNotePatternCard));
  if (!visible.length) nodes.sourceNotePatternRoot.innerHTML = '<p class="empty">No source-note patterns match the current filters.</p>';
}

function sourceNotePatternCard(pattern) {
  const card = document.createElement("article");
  card.className = `file-card source-note-pattern-card status-${slug(pattern.status)}`;

  const header = document.createElement("header");
  const titleBlock = document.createElement("div");
  const meta = document.createElement("div");
  meta.className = "file-meta";
  meta.append(textSpan(pattern.id), textSpan(pattern.repository), textSpan(pattern.status));
  const title = document.createElement("h3");
  title.textContent = pattern.patternType;
  titleBlock.append(meta, title);
  header.append(titleBlock);

  const chips = document.createElement("div");
  chips.className = "chips";
  chips.append(
    chip(pattern.lane),
    chip(pattern.status, pattern.status === "Copy-ready pattern" ? "good" : pattern.status === "Target-only pattern" ? "warn" : "boundary")
  );

  const precedent = document.createElement("p");
  precedent.textContent = pattern.precedent;
  const template = document.createElement("p");
  template.className = "source-note";
  template.textContent = pattern.template;
  const use = document.createElement("p");
  use.textContent = pattern.volume37Use;

  const ready = briefList("Ready when", pattern.readyWhen);
  const reject = briefList("Reject if", pattern.rejectIf);

  const actions = document.createElement("div");
  actions.className = "file-actions";
  if (pattern.precedentUrl) actions.append(linkButton("Precedent", pattern.precedentUrl));
  if (pattern.sourceBaseUrl) actions.append(linkButton("Source base", pattern.sourceBaseUrl));
  actions.append(copyButton(pattern.template, "Copy template"));
  actions.append(copyButton(sourceNotePatternMemo(pattern), "Copy pattern memo"));

  card.append(header, chips, precedent, template, use, ready, reject, actions);
  return card;
}

function sourceNotePatternMemo(pattern) {
  return [
    `${pattern.id}: ${pattern.patternType}`,
    `Repository: ${pattern.repository}`,
    `Lane: ${pattern.lane}`,
    `Status: ${pattern.status}`,
    "",
    `Template: ${pattern.template}`,
    "",
    `Precedent: ${pattern.precedent}`,
    `Source base: ${pattern.sourceBase}`,
    "",
    `Volume XXXVII use: ${pattern.volume37Use}`,
    "",
    "Ready when:",
    ...(pattern.readyWhen || []).map((item) => `- ${item}`),
    "",
    "Reject if:",
    ...(pattern.rejectIf || []).map((item) => `- ${item}`)
  ].join("\n");
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
  const visible = filteredSelectionBoard().sort(selectionSort);
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

function selectionDossierText() {
  const visible = filteredSelectionBoard().sort(selectionSort);
  const activeFilters = [
    state.selections.status ? `status=${state.selections.status}` : "",
    state.selections.lane ? `lane=${state.selections.lane}` : "",
    state.selections.query ? `search=${state.selections.query}` : ""
  ].filter(Boolean);
  const output = [
    "FRUS Volume XXXVII selection dossier",
    `Copied: ${new Date().toISOString().slice(0, 10)}`,
    `Filtered selections: ${visible.length} of ${selectionBoard.length}`,
    `Filters: ${activeFilters.length ? activeFilters.join("; ") : "none"}`,
    ""
  ];

  if (!visible.length) {
    output.push("No selection rows match the current filters.");
    return output.join("\n");
  }

  for (const item of visible) {
    output.push(`${item.status} | ${item.priority} | ${item.recordId} | ${item.title}`);
    output.push(`Lane/date: ${item.lane} | ${item.dateText}`);
    output.push(`Source lead: ${item.sourceLead}`);
    output.push(`Rationale: ${item.selectionRationale}`);
    output.push(`Boundary risk: ${item.boundaryRisk}`);
    output.push(`Next action: ${item.nextAction}`);
    output.push(`Annotation lead: ${item.annotationLead}`);
    if (item.sourceNote) output.push(`Source note: ${item.sourceNote}`);
    if (item.catalogUrl) output.push(`Source URL: ${item.catalogUrl}`);
    if (item.pdfUrl) output.push(`PDF URL: ${item.pdfUrl}`);
    output.push("");
  }

  return output.join("\n").trimEnd();
}

function filteredProductionReadiness() {
  return productionReadiness.filter((item) => {
    if (!matchesQuery(item, state.production.query)) return false;
    if (state.production.stage && item.stage !== state.production.stage) return false;
    if (state.production.lane && item.lane !== state.production.lane) return false;
    if (state.production.priority && item.priority !== state.production.priority) return false;
    return true;
  });
}

function renderProductionReadiness() {
  const stageOrder = new Map([
    ["Request first", 1],
    ["Attachment check", 2],
    ["Citation review", 3],
    ["Draft package", 4],
    ["Context anchor", 5],
    ["Boundary hold", 6]
  ]);
  const priorityOrder = new Map([
    ["Critical", 1],
    ["High", 2],
    ["Medium", 3],
    ["Low", 4]
  ]);
  const visible = filteredProductionReadiness().sort(
    (a, b) =>
      (stageOrder.get(a.stage) || 99) - (stageOrder.get(b.stage) || 99) ||
      (priorityOrder.get(a.priority) || 99) - (priorityOrder.get(b.priority) || 99) ||
      a.lane.localeCompare(b.lane) ||
      a.title.localeCompare(b.title)
  );
  const counts = topCounts(productionReadiness, (item) => item.stage)
    .map(([label, count]) => `${count} ${label.toLowerCase()}`)
    .join("; ");
  nodes.productionSummary.textContent = `${plural(visible.length, "readiness row")} visible from ${productionReadiness.length} production-control rows. ${counts}.`;
  nodes.productionRoot.replaceChildren(...visible.map(productionReadinessCard));
  if (!visible.length) nodes.productionRoot.innerHTML = '<p class="empty">No production-readiness rows match the current filters.</p>';
}

function productionReadinessCard(item) {
  const card = document.createElement("article");
  card.className = `record-card production-card stage-${slug(item.stage)}`;

  const header = document.createElement("header");
  const titleBlock = document.createElement("div");
  const meta = document.createElement("div");
  meta.className = "record-id";
  meta.append(textSpan(item.id), textSpan(item.recordId), textSpan(item.dateText), textSpan(item.priority));
  const title = document.createElement("h4");
  title.textContent = item.title;
  titleBlock.append(meta, title);

  const chips = document.createElement("div");
  chips.className = "chips";
  chips.append(
    chip(item.stage, item.stage === "Draft package" ? "good" : item.stage === "Request first" || item.stage === "Attachment check" ? "warn" : "boundary"),
    chip(item.lane),
    chip(item.selectionStatus)
  );
  header.append(titleBlock, chips);

  const source = document.createElement("p");
  source.className = "source-note";
  source.textContent = `Source readiness: ${item.sourceReadiness}`;
  const sourceNote = document.createElement("p");
  sourceNote.className = "source-note";
  sourceNote.textContent = `Source-note readiness: ${item.sourceNoteReadiness}`;
  const copy = document.createElement("p");
  copy.className = "source-note";
  copy.textContent = `Copy status: ${item.copyStatus}`;
  const annotation = document.createElement("p");
  annotation.className = "source-note";
  annotation.textContent = `Annotation load: ${item.annotationLoad}`;
  const boundary = document.createElement("p");
  boundary.className = "source-note";
  boundary.textContent = `Boundary disposition: ${item.boundaryDisposition}`;
  const blocker = document.createElement("p");
  blocker.className = "source-note";
  blocker.textContent = `Blocker: ${item.blocker}`;
  const move = document.createElement("p");
  move.textContent = item.compilerMove;

  const actions = document.createElement("div");
  actions.className = "record-actions";
  if (item.catalogUrl) actions.append(linkButton(item.catalogLabel || "Source", item.catalogUrl));
  if (item.pdfUrl) actions.append(linkButton("PDF", item.pdfUrl));
  if (item.sourceNote) actions.append(copyButton(item.sourceNote, "Copy source note"));
  actions.append(copyButton(productionReadinessMemo(item), "Copy readiness memo"));

  card.append(header, move, source, sourceNote, copy, annotation, boundary, blocker, actions);
  return card;
}

function productionReadinessMemo(item) {
  return [
    `${item.stage}: ${item.title}`,
    `Readiness ID: ${item.id}`,
    `Record ID: ${item.recordId}`,
    `Date: ${item.dateText}`,
    `Lane: ${item.lane}`,
    `Priority: ${item.priority}`,
    `Selection status: ${item.selectionStatus}`,
    "",
    `Source readiness: ${item.sourceReadiness}`,
    `Source-note readiness: ${item.sourceNoteReadiness}`,
    `Copy status: ${item.copyStatus}`,
    `Annotation load: ${item.annotationLoad}`,
    `Boundary disposition: ${item.boundaryDisposition}`,
    "",
    `Next action: ${item.nextAction}`,
    `Blocker: ${item.blocker}`,
    `Compiler move: ${item.compilerMove}`,
    `Source-note pattern: ${item.sourcePattern}`,
    `Source note: ${item.sourceNote}`
  ].join("\n");
}

function filteredAnnotations() {
  return annotationQueue.filter((item) => {
    if (!matchesQuery(item, state.annotations.query)) return false;
    if (state.annotations.status && item.status !== state.annotations.status) return false;
    if (state.annotations.lane && item.lane !== state.annotations.lane) return false;
    if (state.annotations.type && item.targetType !== state.annotations.type) return false;
    return true;
  });
}

function renderAnnotations() {
  const statusOrder = new Map([
    ["Request-blocked", 1],
    ["Verify first", 2],
    ["Citation review", 3],
    ["Authority check", 4],
    ["Boundary check", 5],
    ["Context only", 6],
    ["Ready to draft", 7]
  ]);
  const priorityOrder = new Map([
    ["Critical", 1],
    ["High", 2],
    ["Medium", 3],
    ["Low", 4]
  ]);
  const visible = filteredAnnotations().sort(
    (a, b) =>
      (statusOrder.get(a.status) || 99) - (statusOrder.get(b.status) || 99) ||
      (priorityOrder.get(a.priority) || 99) - (priorityOrder.get(b.priority) || 99) ||
      a.lane.localeCompare(b.lane) ||
      a.target.localeCompare(b.target)
  );
  const counts = topCounts(annotationQueue, (item) => item.status)
    .map(([label, count]) => `${count} ${label.toLowerCase()}`)
    .join("; ");
  nodes.annotationSummary.textContent = `${plural(visible.length, "annotation task")} visible from ${annotationQueue.length} first-reference and issue-note tasks. ${counts}.`;
  nodes.annotationRoot.replaceChildren(...visible.map(annotationCard));
  if (!visible.length) nodes.annotationRoot.innerHTML = '<p class="empty">No annotation tasks match the current filters.</p>';
}

function annotationCard(item) {
  const card = document.createElement("article");
  card.className = `file-card annotation-card status-${slug(item.status)}`;

  const header = document.createElement("header");
  const titleBlock = document.createElement("div");
  const meta = document.createElement("div");
  meta.className = "file-meta";
  meta.append(textSpan(item.id), textSpan(item.priority), textSpan(item.targetType));
  const title = document.createElement("h3");
  title.textContent = item.target;
  titleBlock.append(meta, title);
  header.append(titleBlock);

  const chips = document.createElement("div");
  chips.className = "chips";
  chips.append(
    chip(item.status, item.status === "Ready to draft" ? "good" : item.status === "Request-blocked" || item.status === "Verify first" ? "warn" : "boundary"),
    chip(item.lane)
  );

  const question = document.createElement("p");
  question.textContent = item.annotationQuestion;
  const prompt = document.createElement("p");
  prompt.className = "source-note";
  prompt.textContent = `Draft prompt: ${item.draftPrompt}`;
  const verify = document.createElement("p");
  verify.className = "source-note";
  verify.textContent = `Verify: ${item.verificationNeeded}`;
  const firstUse = document.createElement("p");
  firstUse.className = "source-note";
  firstUse.textContent = `First use: ${item.firstUse}`;
  const boundary = document.createElement("p");
  boundary.className = "source-note";
  boundary.textContent = `Boundary rule: ${item.boundaryRule}`;
  const linked = briefList("Linked records", item.linkedRecords);

  const actions = document.createElement("div");
  actions.className = "file-actions";
  if (item.sourceUrl) actions.append(linkButton(item.sourceLabel || "Source", item.sourceUrl));
  actions.append(copyButton(annotationMemo(item), "Copy annotation memo"));

  card.append(header, chips, question, prompt, verify, firstUse, boundary, linked, actions);
  return card;
}

function annotationMemo(item) {
  return [
    `${item.id}: ${item.target}`,
    `Priority: ${item.priority}`,
    `Status: ${item.status}`,
    `Lane: ${item.lane}`,
    `Type: ${item.targetType}`,
    "",
    `First use: ${item.firstUse}`,
    `Question: ${item.annotationQuestion}`,
    `Draft prompt: ${item.draftPrompt}`,
    `Verify: ${item.verificationNeeded}`,
    `Source hook: ${item.sourceHook}`,
    `Boundary rule: ${item.boundaryRule}`,
    "",
    `Linked records: ${(item.linkedRecords || []).join("; ")}`,
    `Export note: ${item.exportNote}`
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

function filteredSourceCopyLedger() {
  return sourceCopyLedger.filter((item) => {
    if (!matchesQuery(item, state.ledger.query)) return false;
    if (state.ledger.issue && item.issueType !== state.ledger.issue) return false;
    if (state.ledger.lane && item.lane !== state.ledger.lane) return false;
    if (state.ledger.priority && item.priority !== state.ledger.priority) return false;
    return true;
  });
}

function renderSourceCopyLedger() {
  const priorityOrder = new Map([
    ["Critical", 1],
    ["High", 2],
    ["Medium", 3],
    ["Low", 4]
  ]);
  const issueOrder = new Map([
    ["Missing channel", 1],
    ["Research-room file", 2],
    ["FOIA folder-list lead", 3],
    ["Declassified folder PDF", 4],
    ["Attachment check", 5],
    ["Digitized reference copy", 6],
    ["Public-private bridge", 7],
    ["Marker / no memorandum", 8]
  ]);
  const visible = filteredSourceCopyLedger().sort(
    (a, b) =>
      (priorityOrder.get(a.priority) || 99) - (priorityOrder.get(b.priority) || 99) ||
      (issueOrder.get(a.issueType) || 99) - (issueOrder.get(b.issueType) || 99) ||
      (a.sortDate || "").localeCompare(b.sortDate || "") ||
      a.title.localeCompare(b.title)
  );
  const counts = topCounts(sourceCopyLedger, (item) => item.issueType)
    .slice(0, 4)
    .map(([label, count]) => `${count} ${label.toLowerCase()}`)
    .join("; ");
  nodes.ledgerSummary.textContent = `${plural(visible.length, "row")} visible from ${sourceCopyLedger.length} source-copy ledger rows. ${counts}.`;
  nodes.ledgerRoot.replaceChildren(...visible.map(ledgerCard));
  if (!visible.length) nodes.ledgerRoot.innerHTML = '<p class="empty">No source-copy ledger rows match the current filters.</p>';
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

function inferRepository(item) {
  const text = [item.repository, item.frusSourceNote, item.sourceNote, item.catalogUrl, item.pdfUrl].filter(Boolean).join(" ");
  if (/Reagan Library|reaganlibrary\.gov/i.test(text)) return "Reagan Library";
  if (/National Archives|NARA|archives\.gov|RG\s*\d+/i.test(text)) return "NARA.gov";
  if (/Public Papers|govinfo/i.test(text)) return "Published";
  return item.repository || "Unspecified";
}

function buildProvenanceRows() {
  const sourceRows = [];
  const add = (source, item, options = {}) => {
    const pdfUrl = options.pdfUrl || item.pdfUrl || "";
    const catalogUrl = options.catalogUrl || item.catalogUrl || item.sourceUrl || "";
    const sourceNote = options.sourceNote || item.frusSourceNote || item.sourceNote || item.sourceNoteTarget || "";
    if (!pdfUrl && !catalogUrl && !sourceNote) return;
    sourceRows.push({
      source,
      title: options.title || item.title || item.target || item.workingTitle || "Untitled candidate",
      dateText: options.dateText || item.dateText || item.date || item.sourceWindow || "",
      lane: options.lane || item.lane || item.chapter?.name || item.chapter || "",
      repository: options.repository || inferRepository(item),
      priority: item.priority || "Medium",
      status: options.status || item.issueType || item.status || item.stage || item.requestType || "Source lead",
      identifier: options.identifier || item.identifier || item.recordId || item.compilerNumber || item.id || "",
      releaseStatus: item.releaseStatus || item.sourceNoteStatus || item.copyStatus || "",
      catalogLabel: options.catalogLabel || item.catalogLabel || item.sourceLabel || "Source",
      catalogUrl,
      pdfUrl,
      sourceNote,
      action: options.action || item.action || item.nextAction || item.nextStep || item.compilerMove || ""
    });
  };

  for (const item of sourceCopyLedger) add("Source-copy ledger", item);
  for (const item of requestPackets) add("Request packet", item, { sourceNote: item.sourceNoteTarget });
  for (const item of selectionBoard) add("Selection board", item, { status: item.status });

  const seen = new Set();
  return sourceRows
    .filter((row) => row.pdfUrl || /NARA|Reagan Library/i.test(row.repository))
    .filter((row) => {
      const key = [row.title, row.pdfUrl, row.catalogUrl, row.sourceNote].join("|");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((row, index) => ({ ...row, provenanceId: `PV-${String(index + 1).padStart(3, "0")}` }));
}

function filteredProvenanceRows() {
  return provenanceRows.filter((row) => {
    if (!matchesQuery(row, state.provenance.query)) return false;
    if (state.provenance.repository && row.repository !== state.provenance.repository) return false;
    if (state.provenance.lane && row.lane !== state.provenance.lane) return false;
    return true;
  });
}

function renderProvenanceSheets() {
  const visible = filteredProvenanceRows().sort(packetSort);
  const pdfCount = visible.filter((row) => row.pdfUrl).length;
  nodes.provenanceSummary.textContent = `${plural(visible.length, "provenance row")} visible from ${provenanceRows.length} candidate rows; ${pdfCount} have direct PDF URLs for sheet append checks.`;
  nodes.provenanceRoot.replaceChildren(...visible.map(provenanceCard));
  if (!visible.length) nodes.provenanceRoot.innerHTML = '<p class="empty">No provenance rows match the current filters.</p>';
}

function provenanceCard(row) {
  const card = document.createElement("article");
  card.className = `file-card provenance-card priority-${row.priority.toLowerCase()}`;
  const header = document.createElement("header");
  const titleBlock = document.createElement("div");
  const meta = document.createElement("div");
  meta.className = "file-meta";
  meta.append(textSpan(row.provenanceId), textSpan(row.repository), textSpan(row.status));
  const title = document.createElement("h3");
  title.textContent = row.title;
  titleBlock.append(meta, title);
  header.append(titleBlock);

  const instruction = document.createElement("p");
  instruction.textContent = "Append the generated provenance sheet after the selected document pages. For folder PDFs, extract only the selected item pages and keep marker or withdrawal pages only when they document release status.";
  const note = document.createElement("p");
  note.className = "source-note";
  note.textContent = row.sourceNote || "Source-note target still needs repository details before publication.";
  const actions = document.createElement("div");
  actions.className = "file-actions";
  if (row.catalogUrl) actions.append(linkButton(row.catalogLabel || "Source", row.catalogUrl));
  if (row.pdfUrl) actions.append(linkButton("PDF", row.pdfUrl));
  actions.append(copyButton(provenanceSheetText(row), "Copy sheet"));

  card.append(header, chip(row.lane || "Unassigned"), chip(row.pdfUrl ? "PDF candidate" : "Search lead", row.pdfUrl ? "good" : "warn"), instruction, note, actions);
  return card;
}

function provenanceSheetText(row) {
  return [
    "FRUS 1981-1988 Volume XXXVII Potential Document Provenance Sheet",
    "",
    `Candidate ID: ${row.provenanceId}`,
    `Candidate title: ${row.title}`,
    `Working lane: ${row.lane || "Unassigned"}`,
    `Date or source window: ${row.dateText || "Verify"}`,
    `Repository: ${row.repository}`,
    `Source row: ${row.source}`,
    `Identifier: ${row.identifier || "Verify"}`,
    `Release/copy status: ${row.releaseStatus || row.status || "Verify"}`,
    "",
    `Source URL: ${row.catalogUrl || "Verify in NARA Scout/NARA.gov/Reagan Library"}`,
    `PDF URL: ${row.pdfUrl || "No direct PDF yet"}`,
    "",
    `FRUS source-note target: ${row.sourceNote || "Draft only after repository, series, box, folder, date, classification, and page span are verified."}`,
    "",
    "Selected document pages:",
    "- Page span in source PDF: [fill before final packet]",
    "- Page span in derivative packet: [fill before final packet]",
    "- Attachments printed, omitted, or not found: [verify]",
    "- Marker, cover, withdrawal, or release-status pages retained: [verify]",
    "",
    "Provenance checks:",
    "- NARA Scout/NARA.gov Catalog search trail: [query/date/NAID or no-hit note]",
    "- Reagan Library page or finding aid checked: [URL/date]",
    "- Duplicate/source-copy relationship checked against adjacent FRUS volumes: [yes/no]",
    "- Page-budget disposition under 1,400-page cap: [print / annotate / exclude / hold]",
    "",
    "PDF packet rule:",
    "- Append this sheet after the selected document pages.",
    "- Do not append unrelated folder pages just because they share a source PDF.",
    "- Keep the formal FRUS source note free of derivative PDF page-map language."
  ].join("\n");
}

function provenanceBundleText() {
  const visible = filteredProvenanceRows().sort(packetSort);
  if (!visible.length) return "No provenance rows match the current filters.";
  return visible.map(provenanceSheetText).join("\n\n---\n\n");
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
  addOptions(nodes.boundaryTypeFilter, uniqueSorted(boundaryRecords.map((record) => record.type)), "All row types");
  addOptions(nodes.selectionStatusFilter, uniqueSorted(selectionBoard.map((item) => item.status)), "All statuses");
  addOptions(nodes.selectionLaneFilter, uniqueSorted(selectionBoard.map((item) => item.lane)), "All lanes");
  addOptions(nodes.productionStageFilter, uniqueSorted(productionReadiness.map((item) => item.stage)), "All stages");
  addOptions(nodes.productionLaneFilter, uniqueSorted(productionReadiness.map((item) => item.lane)), "All lanes");
  addOptions(nodes.productionPriorityFilter, uniqueSorted(productionReadiness.map((item) => item.priority)), "All priorities");
  addOptions(nodes.annotationStatusFilter, uniqueSorted(annotationQueue.map((item) => item.status)), "All statuses");
  addOptions(nodes.annotationLaneFilter, uniqueSorted(annotationQueue.map((item) => item.lane)), "All lanes");
  addOptions(nodes.annotationTypeFilter, uniqueSorted(annotationQueue.map((item) => item.targetType)), "All types");
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
  addOptions(nodes.sourceNoteFormatFilter, uniqueSorted(sourceNoteAudit.map((row) => row.formatFamily)), "All formats");
  addOptions(nodes.sourceCoverageStatusFilter, ["Needs review", "Target", "Ready", "Reference"], "All statuses");
  addOptions(nodes.sourceCoverageFormatFilter, uniqueSorted(sourceCoverageRows.map((row) => row.formatFamily)), "All formats");
  addOptions(nodes.sourcePrecedentStatusFilter, uniqueSorted(sourcePrecedentRows.map((row) => row.matchStatus)), "All statuses");
  addOptions(nodes.sourcePrecedentFamilyFilter, uniqueSorted(sourcePrecedentRows.map((row) => row.formatFamily)), "All families");
  addOptions(nodes.sourcePrecedentModelFilter, uniqueSorted(sourcePrecedentRows.map((row) => row.precedentModel)), "All models");
  addOptions(nodes.dateControlLaneFilter, uniqueSorted(dateControlRows.map((row) => row.lane)), "All lanes");
  addOptions(nodes.dateControlPriorityFilter, uniqueSorted(dateControlRows.map((row) => row.priority)), "All priorities");
  addOptions(nodes.sourceNotePatternRepositoryFilter, uniqueSorted(sourceNotePatterns.map((pattern) => pattern.repository)), "All repositories");
  addOptions(nodes.sourceNotePatternLaneFilter, uniqueSorted(sourceNotePatterns.map((pattern) => pattern.lane)), "All lanes");
  addOptions(nodes.sourceNotePatternStatusFilter, uniqueSorted(sourceNotePatterns.map((pattern) => pattern.status)), "All statuses");
  addOptions(nodes.ledgerIssueFilter, uniqueSorted(sourceCopyLedger.map((item) => item.issueType)), "All issue types");
  addOptions(nodes.ledgerLaneFilter, uniqueSorted(sourceCopyLedger.map((item) => item.lane)), "All lanes");
  addOptions(nodes.ledgerPriorityFilter, uniqueSorted(sourceCopyLedger.map((item) => item.priority)), "All priorities");
  addOptions(nodes.provenanceRepositoryFilter, uniqueSorted(provenanceRows.map((row) => row.repository)), "All repositories");
  addOptions(nodes.provenanceLaneFilter, uniqueSorted(provenanceRows.map((row) => row.lane)), "All lanes");
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
    if (state.boundary.type && record.type !== state.boundary.type) return false;
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
      // Fall through to the textarea copy path for static/local browser contexts.
    }
  }
  return fallbackCopyText(text);
}

function copyButton(value, label = "Copy note") {
  const button = document.createElement("button");
  button.className = "copy-note";
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", async () => {
    let copied = false;
    try {
      copied = await writeClipboardText(value);
    } catch (error) {
      copied = false;
    }
    button.textContent = copied ? "Copied" : "Copy failed";
    if (copied) button.dataset.copied = "true";
    else button.dataset.copyFailed = "true";
    setTimeout(() => {
      button.textContent = label;
      delete button.dataset.copied;
      delete button.dataset.copyFailed;
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
  nodes.copyWorkbenchPacket.addEventListener("click", async () => {
    const label = "Copy Work Queue";
    let copied = false;
    try {
      copied = await writeClipboardText(workbenchPacketText());
    } catch (error) {
      copied = false;
    }
    nodes.copyWorkbenchPacket.textContent = copied ? "Copied" : "Copy failed";
    if (copied) nodes.copyWorkbenchPacket.dataset.copied = "true";
    else nodes.copyWorkbenchPacket.dataset.copyFailed = "true";
    setTimeout(() => {
      nodes.copyWorkbenchPacket.textContent = label;
      delete nodes.copyWorkbenchPacket.dataset.copied;
      delete nodes.copyWorkbenchPacket.dataset.copyFailed;
    }, 1200);
  });

  nodes.copyPageBudgetBrief.addEventListener("click", async () => {
    const label = "Copy Budget Brief";
    let copied = false;
    try {
      copied = await writeClipboardText(pageBudgetBriefText());
    } catch (error) {
      copied = false;
    }
    nodes.copyPageBudgetBrief.textContent = copied ? "Copied" : "Copy failed";
    if (copied) nodes.copyPageBudgetBrief.dataset.copied = "true";
    else nodes.copyPageBudgetBrief.dataset.copyFailed = "true";
    setTimeout(() => {
      nodes.copyPageBudgetBrief.textContent = label;
      delete nodes.copyPageBudgetBrief.dataset.copied;
      delete nodes.copyPageBudgetBrief.dataset.copyFailed;
    }, 1200);
  });
  nodes.exportPageBudget.addEventListener("click", () => {
    downloadCsv(
      "frus-volume37-page-budget.csv",
      toCsv(pageBudgetRows(), [
        { label: "Budget ID", value: (row) => row.budgetId },
        { label: "Lane", value: (row) => row.lane },
        { label: "Current Allowance", value: (row) => row.currentAllowance },
        { label: "Target Pages", value: (row) => row.targetPages },
        { label: "Selection Pages", value: (row) => row.selectionPages },
        { label: "Remaining", value: (row) => row.remaining },
        { label: "Rule", value: (row) => row.rule }
      ])
    );
  });

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
  nodes.copyRequestBundle.addEventListener("click", async () => {
    const label = "Copy Bundle";
    let copied = false;
    try {
      copied = await writeClipboardText(requestBundleText());
    } catch (error) {
      copied = false;
    }
    nodes.copyRequestBundle.textContent = copied ? "Copied" : "Copy failed";
    if (copied) nodes.copyRequestBundle.dataset.copied = "true";
    else nodes.copyRequestBundle.dataset.copyFailed = "true";
    setTimeout(() => {
      nodes.copyRequestBundle.textContent = label;
      delete nodes.copyRequestBundle.dataset.copied;
      delete nodes.copyRequestBundle.dataset.copyFailed;
    }, 1200);
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
  nodes.sourceNoteFormatFilter.addEventListener("change", (event) => {
    state.sourceNotes.format = event.target.value;
    renderSourceNoteAudit();
  });
  nodes.clearSourceNoteFilters.addEventListener("click", () => {
    state.sourceNotes = { query: "", status: "", section: "", format: "" };
    nodes.sourceNoteSearch.value = "";
    nodes.sourceNoteStatusFilter.value = "";
    nodes.sourceNoteSectionFilter.value = "";
    nodes.sourceNoteFormatFilter.value = "";
    renderSourceNoteAudit();
  });
  nodes.copySourceNoteFixes.addEventListener("click", async () => {
    const label = "Fix List";
    let copied = false;
    try {
      copied = await writeClipboardText(sourceNoteFixListText());
    } catch (error) {
      copied = false;
    }
    nodes.copySourceNoteFixes.textContent = copied ? "Copied" : "Copy failed";
    if (copied) nodes.copySourceNoteFixes.dataset.copied = "true";
    else nodes.copySourceNoteFixes.dataset.copyFailed = "true";
    setTimeout(() => {
      nodes.copySourceNoteFixes.textContent = label;
      delete nodes.copySourceNoteFixes.dataset.copied;
      delete nodes.copySourceNoteFixes.dataset.copyFailed;
    }, 1200);
  });
  nodes.exportSourceNotes.addEventListener("click", () => {
    downloadCsv(
      "frus-volume37-source-note-qa.csv",
      toCsv(filteredSourceNoteAudit(), [
        { label: "Audit ID", value: (row) => row.auditId },
        { label: "Status", value: (row) => row.assessment },
        { label: "Section", value: (row) => row.section },
        { label: "Format", value: (row) => row.formatFamily },
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

  nodes.sourceCoverageSearch.addEventListener("input", (event) => {
    state.sourceCoverage.query = event.target.value;
    renderSourceCoverage();
  });
  nodes.sourceCoverageStatusFilter.addEventListener("change", (event) => {
    state.sourceCoverage.status = event.target.value;
    renderSourceCoverage();
  });
  nodes.sourceCoverageFormatFilter.addEventListener("change", (event) => {
    state.sourceCoverage.format = event.target.value;
    renderSourceCoverage();
  });
  nodes.clearSourceCoverageFilters.addEventListener("click", () => {
    state.sourceCoverage = { query: "", status: "", format: "" };
    nodes.sourceCoverageSearch.value = "";
    nodes.sourceCoverageStatusFilter.value = "";
    nodes.sourceCoverageFormatFilter.value = "";
    renderSourceCoverage();
  });
  nodes.copySourceCoverageBrief.addEventListener("click", async () => {
    const label = "Copy Brief";
    let copied = false;
    try {
      copied = await writeClipboardText(sourceCoverageBriefText());
    } catch (error) {
      copied = false;
    }
    nodes.copySourceCoverageBrief.textContent = copied ? "Copied" : "Copy failed";
    if (copied) nodes.copySourceCoverageBrief.dataset.copied = "true";
    else nodes.copySourceCoverageBrief.dataset.copyFailed = "true";
    setTimeout(() => {
      nodes.copySourceCoverageBrief.textContent = label;
      delete nodes.copySourceCoverageBrief.dataset.copied;
      delete nodes.copySourceCoverageBrief.dataset.copyFailed;
    }, 1200);
  });
  nodes.exportSourceCoverage.addEventListener("click", () => {
    downloadCsv(
      "frus-volume37-source-coverage.csv",
      toCsv(filteredSourceCoverageRows(), [
        { label: "Coverage ID", value: (row) => row.coverageId },
        { label: "Risk", value: (row) => row.risk },
        { label: "Lane", value: (row) => row.lane },
        { label: "Format", value: (row) => row.formatFamily },
        { label: "Total", value: (row) => row.total },
        { label: "Ready", value: (row) => row.ready },
        { label: "Target", value: (row) => row.target },
        { label: "Needs Review", value: (row) => row.needsReview },
        { label: "Reference", value: (row) => row.reference },
        { label: "Sections", value: (row) => row.sections },
        { label: "Next Action", value: (row) => row.nextAction },
        { label: "Examples", value: (row) => row.sampleTitles.join("; ") }
      ])
    );
  });

  nodes.sourcePrecedentSearch.addEventListener("input", (event) => {
    state.sourcePrecedents.query = event.target.value;
    renderSourcePrecedents();
  });
  nodes.sourcePrecedentStatusFilter.addEventListener("change", (event) => {
    state.sourcePrecedents.status = event.target.value;
    renderSourcePrecedents();
  });
  nodes.sourcePrecedentFamilyFilter.addEventListener("change", (event) => {
    state.sourcePrecedents.family = event.target.value;
    renderSourcePrecedents();
  });
  nodes.sourcePrecedentModelFilter.addEventListener("change", (event) => {
    state.sourcePrecedents.precedent = event.target.value;
    renderSourcePrecedents();
  });
  nodes.clearSourcePrecedentFilters.addEventListener("click", () => {
    state.sourcePrecedents = { query: "", status: "", family: "", precedent: "" };
    nodes.sourcePrecedentSearch.value = "";
    nodes.sourcePrecedentStatusFilter.value = "";
    nodes.sourcePrecedentFamilyFilter.value = "";
    nodes.sourcePrecedentModelFilter.value = "";
    renderSourcePrecedents();
  });
  nodes.copySourcePrecedentChecklist.addEventListener("click", async () => {
    const label = "Copy Checklist";
    let copied = false;
    try {
      copied = await writeClipboardText(sourcePrecedentChecklistText());
    } catch (error) {
      copied = false;
    }
    nodes.copySourcePrecedentChecklist.textContent = copied ? "Copied" : "Copy failed";
    if (copied) nodes.copySourcePrecedentChecklist.dataset.copied = "true";
    else nodes.copySourcePrecedentChecklist.dataset.copyFailed = "true";
    setTimeout(() => {
      nodes.copySourcePrecedentChecklist.textContent = label;
      delete nodes.copySourcePrecedentChecklist.dataset.copied;
      delete nodes.copySourcePrecedentChecklist.dataset.copyFailed;
    }, 1200);
  });
  nodes.exportSourcePrecedents.addEventListener("click", () => {
    downloadCsv(
      "frus-volume37-source-note-precedents.csv",
      toCsv(filteredSourcePrecedentRows(), [
        { label: "Precedent ID", value: (row) => row.precedentId },
        { label: "Status", value: (row) => row.matchStatus },
        { label: "Family", value: (row) => row.formatFamily },
        { label: "Precedent Model", value: (row) => row.precedentModel },
        { label: "Official Model", value: (row) => row.officialModel },
        { label: "Section", value: (row) => row.section },
        { label: "Lane", value: (row) => row.lane },
        { label: "Title", value: (row) => row.sourceTitle },
        { label: "Expected Shape", value: (row) => row.expectedShape },
        { label: "Current Note", value: (row) => row.sourceNote },
        { label: "Repair Actions", value: (row) => row.repairActions.join("; ") },
        { label: "Next Action", value: (row) => row.nextAction },
        { label: "Source List URL", value: (row) => row.sourceListUrl },
        { label: "Example URL", value: (row) => row.exampleUrl }
      ])
    );
  });

  nodes.dateControlSearch.addEventListener("input", (event) => {
    state.dateControls.query = event.target.value;
    renderDateControls();
  });
  nodes.dateControlLaneFilter.addEventListener("change", (event) => {
    state.dateControls.lane = event.target.value;
    renderDateControls();
  });
  nodes.dateControlPriorityFilter.addEventListener("change", (event) => {
    state.dateControls.priority = event.target.value;
    renderDateControls();
  });
  nodes.clearDateControlFilters.addEventListener("click", () => {
    state.dateControls = { query: "", lane: "", priority: "" };
    nodes.dateControlSearch.value = "";
    nodes.dateControlLaneFilter.value = "";
    nodes.dateControlPriorityFilter.value = "";
    renderDateControls();
  });
  nodes.copyDateControlBrief.addEventListener("click", async () => {
    const label = "Copy Brief";
    let copied = false;
    try {
      copied = await writeClipboardText(dateControlBriefText());
    } catch (error) {
      copied = false;
    }
    nodes.copyDateControlBrief.textContent = copied ? "Copied" : "Copy failed";
    if (copied) nodes.copyDateControlBrief.dataset.copied = "true";
    else nodes.copyDateControlBrief.dataset.copyFailed = "true";
    setTimeout(() => {
      nodes.copyDateControlBrief.textContent = label;
      delete nodes.copyDateControlBrief.dataset.copied;
      delete nodes.copyDateControlBrief.dataset.copyFailed;
    }, 1200);
  });
  nodes.exportDateControls.addEventListener("click", () => {
    downloadCsv(
      "frus-volume37-date-controls.csv",
      toCsv(filteredDateControlRows(), [
        { label: "Control ID", value: (row) => row.controlId },
        { label: "Priority", value: (row) => row.priority },
        { label: "Lane", value: (row) => row.lane },
        { label: "Date", value: (row) => row.dateText },
        { label: "Title", value: (row) => row.title },
        { label: "Type", value: (row) => row.controlType },
        { label: "Country", value: (row) => row.country },
        { label: "Participants", value: (row) => row.participants.join("; ") },
        { label: "Risk", value: (row) => row.dateRisk },
        { label: "Diary Ask", value: (row) => row.diaryAsk },
        { label: "Bridge Rule", value: (row) => row.internalBridge },
        { label: "Source URL", value: (row) => row.catalogUrl },
        { label: "PDF URL", value: (row) => row.pdfUrl },
        { label: "Source Note", value: (row) => row.sourceNote }
      ])
    );
  });

  nodes.sourceNotePatternSearch.addEventListener("input", (event) => {
    state.sourceNotePatterns.query = event.target.value;
    renderSourceNotePatterns();
  });
  nodes.sourceNotePatternRepositoryFilter.addEventListener("change", (event) => {
    state.sourceNotePatterns.repository = event.target.value;
    renderSourceNotePatterns();
  });
  nodes.sourceNotePatternLaneFilter.addEventListener("change", (event) => {
    state.sourceNotePatterns.lane = event.target.value;
    renderSourceNotePatterns();
  });
  nodes.sourceNotePatternStatusFilter.addEventListener("change", (event) => {
    state.sourceNotePatterns.status = event.target.value;
    renderSourceNotePatterns();
  });
  nodes.clearSourceNotePatternFilters.addEventListener("click", () => {
    state.sourceNotePatterns = { query: "", repository: "", lane: "", status: "" };
    nodes.sourceNotePatternSearch.value = "";
    nodes.sourceNotePatternRepositoryFilter.value = "";
    nodes.sourceNotePatternLaneFilter.value = "";
    nodes.sourceNotePatternStatusFilter.value = "";
    renderSourceNotePatterns();
  });
  nodes.exportSourceNotePatterns.addEventListener("click", () => {
    downloadCsv(
      "frus-volume37-source-note-patterns.csv",
      toCsv(filteredSourceNotePatterns(), [
        { label: "ID", value: (pattern) => pattern.id },
        { label: "Status", value: (pattern) => pattern.status },
        { label: "Repository", value: (pattern) => pattern.repository },
        { label: "Lane", value: (pattern) => pattern.lane },
        { label: "Pattern Type", value: (pattern) => pattern.patternType },
        { label: "Template", value: (pattern) => pattern.template },
        { label: "Precedent", value: (pattern) => pattern.precedent },
        { label: "Precedent URL", value: (pattern) => pattern.precedentUrl },
        { label: "Source Base", value: (pattern) => pattern.sourceBase },
        { label: "Source Base URL", value: (pattern) => pattern.sourceBaseUrl },
        { label: "Volume XXXVII Use", value: (pattern) => pattern.volume37Use },
        { label: "Ready When", value: (pattern) => (pattern.readyWhen || []).join("; ") },
        { label: "Reject If", value: (pattern) => (pattern.rejectIf || []).join("; ") }
      ])
    );
  });

  nodes.ledgerSearch.addEventListener("input", (event) => {
    state.ledger.query = event.target.value;
    renderSourceCopyLedger();
  });
  nodes.ledgerIssueFilter.addEventListener("change", (event) => {
    state.ledger.issue = event.target.value;
    renderSourceCopyLedger();
  });
  nodes.ledgerLaneFilter.addEventListener("change", (event) => {
    state.ledger.lane = event.target.value;
    renderSourceCopyLedger();
  });
  nodes.ledgerPriorityFilter.addEventListener("change", (event) => {
    state.ledger.priority = event.target.value;
    renderSourceCopyLedger();
  });
  nodes.clearLedgerFilters.addEventListener("click", () => {
    state.ledger = { query: "", issue: "", lane: "", priority: "" };
    nodes.ledgerSearch.value = "";
    nodes.ledgerIssueFilter.value = "";
    nodes.ledgerLaneFilter.value = "";
    nodes.ledgerPriorityFilter.value = "";
    renderSourceCopyLedger();
  });
  nodes.exportLedger.addEventListener("click", () => {
    downloadCsv(
      "frus-volume37-source-copy-ledger.csv",
      toCsv(filteredSourceCopyLedger(), [
        { label: "Issue Type", value: (item) => item.issueType },
        { label: "Priority", value: (item) => item.priority },
        { label: "Date", value: (item) => item.dateText || item.date },
        { label: "Lane", value: (item) => item.lane },
        { label: "Country", value: (item) => item.country },
        { label: "Title", value: (item) => item.title },
        { label: "Identifier", value: (item) => item.identifier || item.naid },
        { label: "Release Status", value: (item) => item.releaseStatus },
        { label: "Participants", value: (item) => (item.participants || []).join("; ") },
        { label: "Action", value: (item) => item.action },
        { label: "Source URL", value: (item) => item.catalogUrl },
        { label: "PDF URL", value: (item) => item.pdfUrl },
        { label: "FRUS Source Note", value: (item) => item.frusSourceNote }
      ])
    );
  });

  nodes.provenanceSearch.addEventListener("input", (event) => {
    state.provenance.query = event.target.value;
    renderProvenanceSheets();
  });
  nodes.provenanceRepositoryFilter.addEventListener("change", (event) => {
    state.provenance.repository = event.target.value;
    renderProvenanceSheets();
  });
  nodes.provenanceLaneFilter.addEventListener("change", (event) => {
    state.provenance.lane = event.target.value;
    renderProvenanceSheets();
  });
  nodes.clearProvenanceFilters.addEventListener("click", () => {
    state.provenance = { query: "", repository: "", lane: "" };
    nodes.provenanceSearch.value = "";
    nodes.provenanceRepositoryFilter.value = "";
    nodes.provenanceLaneFilter.value = "";
    renderProvenanceSheets();
  });
  nodes.copyProvenanceBundle.addEventListener("click", async () => {
    const label = "Copy Sheets";
    let copied = false;
    try {
      copied = await writeClipboardText(provenanceBundleText());
    } catch (error) {
      copied = false;
    }
    nodes.copyProvenanceBundle.textContent = copied ? "Copied" : "Copy failed";
    if (copied) nodes.copyProvenanceBundle.dataset.copied = "true";
    else nodes.copyProvenanceBundle.dataset.copyFailed = "true";
    setTimeout(() => {
      nodes.copyProvenanceBundle.textContent = label;
      delete nodes.copyProvenanceBundle.dataset.copied;
      delete nodes.copyProvenanceBundle.dataset.copyFailed;
    }, 1200);
  });
  nodes.exportProvenance.addEventListener("click", () => {
    downloadCsv(
      "frus-volume37-provenance-sheets.csv",
      toCsv(filteredProvenanceRows(), [
        { label: "Provenance ID", value: (row) => row.provenanceId },
        { label: "Repository", value: (row) => row.repository },
        { label: "Lane", value: (row) => row.lane },
        { label: "Date", value: (row) => row.dateText },
        { label: "Title", value: (row) => row.title },
        { label: "Identifier", value: (row) => row.identifier },
        { label: "Status", value: (row) => row.status },
        { label: "Release Status", value: (row) => row.releaseStatus },
        { label: "Action", value: (row) => row.action },
        { label: "Source URL", value: (row) => row.catalogUrl },
        { label: "PDF URL", value: (row) => row.pdfUrl },
        { label: "Source Note", value: (row) => row.sourceNote },
        { label: "Provenance Sheet", value: provenanceSheetText }
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
  nodes.copySelectionDossier.addEventListener("click", async () => {
    const label = "Copy Dossier";
    let copied = false;
    try {
      copied = await writeClipboardText(selectionDossierText());
    } catch (error) {
      copied = false;
    }
    nodes.copySelectionDossier.textContent = copied ? "Copied" : "Copy failed";
    if (copied) nodes.copySelectionDossier.dataset.copied = "true";
    else nodes.copySelectionDossier.dataset.copyFailed = "true";
    setTimeout(() => {
      nodes.copySelectionDossier.textContent = label;
      delete nodes.copySelectionDossier.dataset.copied;
      delete nodes.copySelectionDossier.dataset.copyFailed;
    }, 1200);
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

  nodes.productionSearch.addEventListener("input", (event) => {
    state.production.query = event.target.value;
    renderProductionReadiness();
  });
  nodes.productionStageFilter.addEventListener("change", (event) => {
    state.production.stage = event.target.value;
    renderProductionReadiness();
  });
  nodes.productionLaneFilter.addEventListener("change", (event) => {
    state.production.lane = event.target.value;
    renderProductionReadiness();
  });
  nodes.productionPriorityFilter.addEventListener("change", (event) => {
    state.production.priority = event.target.value;
    renderProductionReadiness();
  });
  nodes.clearProductionFilters.addEventListener("click", () => {
    state.production = { query: "", stage: "", lane: "", priority: "" };
    nodes.productionSearch.value = "";
    nodes.productionStageFilter.value = "";
    nodes.productionLaneFilter.value = "";
    nodes.productionPriorityFilter.value = "";
    renderProductionReadiness();
  });
  nodes.exportProduction.addEventListener("click", () => {
    downloadCsv(
      "frus-volume37-production-readiness.csv",
      toCsv(filteredProductionReadiness(), [
        { label: "Readiness ID", value: (item) => item.id },
        { label: "Stage", value: (item) => item.stage },
        { label: "Priority", value: (item) => item.priority },
        { label: "Lane", value: (item) => item.lane },
        { label: "Record ID", value: (item) => item.recordId },
        { label: "Date", value: (item) => item.dateText },
        { label: "Title", value: (item) => item.title },
        { label: "Selection Status", value: (item) => item.selectionStatus },
        { label: "Source Readiness", value: (item) => item.sourceReadiness },
        { label: "Source-Note Readiness", value: (item) => item.sourceNoteReadiness },
        { label: "Copy Status", value: (item) => item.copyStatus },
        { label: "Annotation Load", value: (item) => item.annotationLoad },
        { label: "Boundary Disposition", value: (item) => item.boundaryDisposition },
        { label: "Next Action", value: (item) => item.nextAction },
        { label: "Blocker", value: (item) => item.blocker },
        { label: "Compiler Move", value: (item) => item.compilerMove },
        { label: "Source Pattern", value: (item) => item.sourcePattern },
        { label: "Source Note", value: (item) => item.sourceNote },
        { label: "Source URL", value: (item) => item.catalogUrl },
        { label: "PDF URL", value: (item) => item.pdfUrl }
      ])
    );
  });

  nodes.annotationSearch.addEventListener("input", (event) => {
    state.annotations.query = event.target.value;
    renderAnnotations();
  });
  nodes.annotationStatusFilter.addEventListener("change", (event) => {
    state.annotations.status = event.target.value;
    renderAnnotations();
  });
  nodes.annotationLaneFilter.addEventListener("change", (event) => {
    state.annotations.lane = event.target.value;
    renderAnnotations();
  });
  nodes.annotationTypeFilter.addEventListener("change", (event) => {
    state.annotations.type = event.target.value;
    renderAnnotations();
  });
  nodes.clearAnnotationFilters.addEventListener("click", () => {
    state.annotations = { query: "", status: "", lane: "", type: "" };
    nodes.annotationSearch.value = "";
    nodes.annotationStatusFilter.value = "";
    nodes.annotationLaneFilter.value = "";
    nodes.annotationTypeFilter.value = "";
    renderAnnotations();
  });
  nodes.exportAnnotations.addEventListener("click", () => {
    downloadCsv(
      "frus-volume37-annotation-queue.csv",
      toCsv(filteredAnnotations(), [
        { label: "Annotation ID", value: (item) => item.id },
        { label: "Priority", value: (item) => item.priority },
        { label: "Status", value: (item) => item.status },
        { label: "Lane", value: (item) => item.lane },
        { label: "Target Type", value: (item) => item.targetType },
        { label: "Target", value: (item) => item.target },
        { label: "Linked Records", value: (item) => (item.linkedRecords || []).join("; ") },
        { label: "First Use", value: (item) => item.firstUse },
        { label: "Annotation Question", value: (item) => item.annotationQuestion },
        { label: "Draft Prompt", value: (item) => item.draftPrompt },
        { label: "Verification Needed", value: (item) => item.verificationNeeded },
        { label: "Source Hook", value: (item) => item.sourceHook },
        { label: "Boundary Rule", value: (item) => item.boundaryRule },
        { label: "Export Note", value: (item) => item.exportNote },
        { label: "Source URL", value: (item) => item.sourceUrl }
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
  nodes.boundaryTypeFilter.addEventListener("change", (event) => {
    state.boundary.type = event.target.value;
    renderBoundaryRecords();
  });
  nodes.clearBoundaryFilters.addEventListener("click", () => {
    state.boundary = { query: "", country: "", type: "" };
    nodes.boundarySearch.value = "";
    nodes.boundaryCountryFilter.value = "";
    nodes.boundaryTypeFilter.value = "";
    renderBoundaryRecords();
  });
  nodes.exportBoundary.addEventListener("click", () => {
    downloadCsv(
      "frus-volume37-boundary-control.csv",
      toCsv(filteredBoundaryRecords(), [
        { label: "Boundary ID", value: (record) => record.compilerNumber },
        { label: "Date", value: (record) => record.dateText || record.date },
        { label: "Country", value: (record) => record.country },
        { label: "Type", value: (record) => record.type },
        { label: "Release", value: (record) => record.releaseStatus },
        { label: "Title", value: (record) => record.title },
        { label: "Participants", value: (record) => (record.participants || []).join("; ") },
        { label: "Boundary Reason", value: (record) => record.boundaryReason },
        { label: "Source URL", value: (record) => record.catalogUrl },
        { label: "FRUS Source Note", value: (record) => record.frusSourceNote }
      ])
    );
  });
}

function init() {
  setStats();
  renderWorkbench();
  populateFilters();
  restoreUrlState();
  renderSelectionBoard();
  renderPageBudget();
  renderProductionReadiness();
  renderAnnotations();
  renderChapterBriefs();
  renderGapTracker();
  renderSourcePools();
  renderRequestPackets();
  renderSourceNoteAudit();
  renderSourceCoverage();
  renderSourcePrecedents();
  renderDateControls();
  renderSourceNotePatterns();
  renderSourceCopyLedger();
  renderProvenanceSheets();
  renderChapters();
  renderRecords();
  renderPolicyFiles();
  renderPublicReferences();
  renderBoundaryRecords();
  scheduleCurrentHashScroll();
  setupEvents();
  setupViewStateEvents();
  scheduleCurrentHashScroll();
}

init();
