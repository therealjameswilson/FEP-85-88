# FRUS Assist: Volume XXXVII

Compiler-facing static workbench for:

**Foreign Relations of the United States, 1981-1988, Volume XXXVII, Trade; Monetary Policy; Industrialized Country Cooperation, 1985-1988**

Official volume page: <https://history.state.gov/historicaldocuments/frus1981-88v37>

The page is deliberately source-first: every cue is meant to remain reviewable, exportable, and subordinate to compiler judgment.

## What It Includes

- chronological leads from NSDD reference copies and Reagan Public Papers
- compiler desk metrics
- copyable work queue combining draft-ready rows, blockers, archive asks, annotation checks, gaps, boundary reminders, and persons review
- shareable filtered view links for the chronology, request, source-note, source-copy, date-control, boundary, and persons queues
- research lanes for trade, monetary policy, economic summits, strategic trade controls, and boundaries
- searchable/exportable gap tracker
- searchable/exportable source pools
- searchable/exportable request packets with copyable Reagan Library and NARA request bundles
- source-note QA audit with FRUS-format filters and copyable fix list for ready notes, target notes, references, and rows needing review
- separate Reagan Library source-note section listing exact `Source: Reagan Library, ...` citations with bracketed templates excluded
- source coverage matrix with lane/format readiness counts, copyable brief, and CSV export
- source-note precedent-match queue keyed to official Volume III, Volume XXXVIII, Public Papers, Daily Diary, and adjacent-volume models
- Daily Diary date-control queue for public endpoints, summit anchors, calls, and meeting-context checks
- source-note pattern lab for Reagan Library, NARA, Public Papers, NSDD, and Daily Diary citation formats
- selection board with copyable filtered dossiers for draft candidates, context anchors, request-first leads, and boundary/exclusion calls
- 1,400-page budget desk with lane allowances, selection rules, copyable brief, and CSV export
- production-readiness worksheet for draft packages, citation review, attachment checks, request-first blockers, and boundary holds
- annotation queue for first-reference notes, issue prompts, verification needs, authority checks, and boundary rules
- chapter briefs with document spines, must-harvest items, annotation questions, exclusion rules, and copyable assembly memos
- searchable/exportable source-copy ledger for attachment checks, missing channels, and public-private bridge work
- searchable/exportable provenance-sheet desk for candidate PDFs; sheets are designed to be appended after selected document pages
- policy file anchors for Reagan Library, Public Papers, Treasury/Fed routing, and adjacent FRUS volumes
- declassified Reagan Library leads from Danzansky, Baker, and Sprinkel files
- NARA Scout and NARA.gov Catalog search anchors for RG 56, RG 59, RG 364, and declassified hit verification
- NARA RG 56, RG 59, and RG 364 source-note targets modeled on the same compiler's Carter foreign economic policy volume
- public-line reference layer
- searchable/exportable boundary-control rows for adjacent FRUS volumes and excluded domestic-only material
- resilient copy buttons for source notes, request text, selection memos, annotation prompts, and assembly notes
- persons page with search, source/scope/review filters, copyable review queue, and CSV export

## Run Locally

```bash
python3 -m http.server 4197
```

Open:

<http://127.0.0.1:4197/>

Validation:

```bash
node --check app.js
node --check persons.js
node --check data/volume-data.js
node --check data/persons.js
```

## Source Base

- Official Volume XXXVII page: <https://history.state.gov/historicaldocuments/frus1981-88v37>
- Reagan Foundations model volume: <https://history.state.gov/historicaldocuments/frus1981-88v01>
- Reagan Foundations source list: <https://history.state.gov/historicaldocuments/frus1981-88v01/sources>
- FRUS Volume III source-note precedent: <https://history.state.gov/historicaldocuments/frus1977-80v03/sources>
- Reagan administration FRUS volume list: <https://history.state.gov/historicaldocuments/reagan>
- NARA Scout: <https://therealjameswilson.github.io/nara-scout/>
- NARA Catalog: <https://catalog.archives.gov/>
- NARA Catalog API notes: <https://www.archives.gov/research/catalog/help/api>
- Reagan Library NSDD digitized reference copies: <https://www.reaganlibrary.gov/reagans/reagan-administration/nsdd-digitized-reference-copies>
- Reagan Public Papers: <https://www.reaganlibrary.gov/archives/public-papers-president-ronald-reagan>
- Reagan Library Danzansky files: <https://www.reaganlibrary.gov/research/finding-aids/danzansky-stephen-i-files-1985-1988>
- Reagan Library Trade topic guide: <https://www.reaganlibrary.gov/archives/topic-guide/trade>
- FRUS Volume XXXVIII sources and boundary precedent: <https://history.state.gov/historicaldocuments/frus1981-88v38/sources>

## Source-Note Discipline

FRUS 1977-1980, Volume III was compiled by Kathleen B. Rasmussen and is the source-note model for this page.
Rows marked `Source:` are copy-ready only when repository, collection, box, folder, and classification/handling are specific.
Rows marked `Source-note target` are archival leads that still need exact box/folder or record-group data before publication.

## PDF Provenance Discipline

Potential-document PDFs should be built from selected document pages, not whole folder PDFs by default.
Append the generated provenance sheet after the selected pages, preserve marker or withdrawal pages only when they document release status, and keep derivative packet page maps out of the formal FRUS source note.
