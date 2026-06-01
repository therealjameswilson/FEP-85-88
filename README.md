# FRUS Assist: Volume XXXVII

Compiler-facing static workbench for:

**Foreign Relations of the United States, 1981-1988, Volume XXXVII, Trade; Monetary Policy; Industrialized Country Cooperation, 1985-1988**

Official volume page: <https://history.state.gov/historicaldocuments/frus1981-88v37>

## What It Includes

- chronological leads from NSDD reference copies and Reagan Public Papers
- compiler desk metrics
- research lanes for trade, monetary policy, economic summits, strategic trade controls, and boundaries
- searchable/exportable gap tracker
- searchable/exportable source pools
- searchable/exportable request packets with copy-ready Reagan Library and NARA ask text
- source-note QA audit for ready notes, target notes, references, and rows needing review
- selection board for draft candidates, context anchors, request-first leads, and boundary/exclusion calls
- source-copy ledger for attachment checks, missing channels, and public-private bridge work
- policy file anchors for Reagan Library, Public Papers, Treasury/Fed routing, and adjacent FRUS volumes
- declassified Reagan Library leads from Danzansky, Baker, and Sprinkel files
- NARA RG 56, RG 59, and RG 364 source-note targets modeled on the same compiler's Carter foreign economic policy volume
- public-line reference layer
- boundary-control rows for adjacent FRUS volumes and excluded domestic-only material
- persons page with search, filters, and CSV export

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
- FRUS Volume III source-note precedent: <https://history.state.gov/historicaldocuments/frus1977-80v03/sources>
- Reagan administration FRUS volume list: <https://history.state.gov/historicaldocuments/reagan>
- Reagan Library NSDD digitized reference copies: <https://www.reaganlibrary.gov/reagans/reagan-administration/nsdd-digitized-reference-copies>
- Reagan Public Papers: <https://www.reaganlibrary.gov/archives/public-papers-president-ronald-reagan>
- Reagan Library Danzansky files: <https://www.reaganlibrary.gov/research/finding-aids/danzansky-stephen-i-files-1985-1988>
- Reagan Library Trade topic guide: <https://www.reaganlibrary.gov/archives/topic-guide/trade>
- FRUS Volume XXXVIII sources and boundary precedent: <https://history.state.gov/historicaldocuments/frus1981-88v38/sources>

## Source-Note Discipline

FRUS 1977-1980, Volume III was compiled by Kathleen B. Rasmussen and is the source-note model for this page.
Rows marked `Source:` are copy-ready only when repository, collection, box, folder, and classification/handling are specific.
Rows marked `Source-note target` are archival leads that still need exact box/folder or record-group data before publication.
