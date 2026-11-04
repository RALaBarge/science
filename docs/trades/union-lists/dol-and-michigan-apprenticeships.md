# DOL and Michigan apprenticeable occupations: research notes (2026-11-04)

Status: no complete occupation list was extracted from either source. Everything below is what was actually read, with URLs.

## 1. U.S. DOL Office of Apprenticeship

Occupations table: none extracted (0 occupations with codes and terms).

| Source | What it is | What was seen | Status |
|---|---|---|---|
| https://www.apprenticeship.gov/apprenticeship-occupations | DOL "Occupation Finder" | Page loads, but the occupation list is rendered client-side by a React app. The static HTML has no occupation rows. | Not read. The React config (https://www.apprenticeship.gov/react/static/js/config.js) embeds a search API key and endpoint for an Azure index. I did not call that API with the embedded keys. |
| https://apprenticeship.gov/sites/default/files/bulletins/Bulletin%202020-64%20List%20of%20Apprenticeable%20Occupations.doc | DOL Bulletin 2020-64 (March 26, 2020), "List of Officially Recognized Apprenticeable Occupations" | The list is an attached Excel file. The fetched .doc contains only the binary spreadsheet, with no readable rows. Bulletin 2020-64 says the list was checked against RAPIDS. | Not extracted. |
| https://www.doleta.gov/oa/bul16/Bulletin_2016-28_Attachment1.xlsx | Bulletin 2016-28 attachment (occupations list in xlsx) | Now redirects (301) to https://www.dol.gov/agencies/eta. The file is gone. | Not found. |
| https://www.dol.gov/sites/dolgov/files/ETA/apprenticeship/pdfs/Bulletin_2016-28.pdf | Bulletin 2016-28 | Refers to the xlsx attachment above. The PDF is corrupt in the fetch path. | Not extracted. |

RAPIDS code conventions as stated in Bulletin 2020-64 (from WebFetch of the .doc): CL (Career Lattice), CB (Competency-based), HY (Hybrid), TB (Time-based), R (Revised Term). Source: https://apprenticeship.gov/sites/default/files/bulletins/Bulletin%202020-64%20List%20of%20Apprenticeable%20Occupations.doc

Most complete DOL list: the one attached to Bulletin 2020-64 (count unknown, not readable here). Bulletin 2020-64 is the newest version found. To get the count and codes, download the Excel attachment from apprenticeship.gov, or use the Occupation Finder in a browser.

## 2. Michigan (LEO / Michigan Works!)

Occupations table: none extracted.

| Source | What was seen | Status |
|---|---|---|
| https://www.michigan.gov/leo/bureaus-agencies/wd/apprenticeships/registered-apprenticeship-group-sponsors | Sponsor table (Michigan Works! agencies and organizations) with an "Industries/Occupations" column | Read. Industry and occupation labels are sponsor-declared, not a state list. See the sponsor-listed table below. |
| https://www.michigan.gov/leo/bureaus-agencies/wd/apprenticeships/data-and-reports | Points to the Registered Apprenticeship Michigan Dashboard (interactive, data by occupation) and the DOL Interactive Apprenticeship Data | Read the page text only. The dashboard was not readable with static fetch. |
| https://michigan.gov/leo/bureaus-agencies/wd/data-public-notices/credential-engine/registered-apprenticeships | Credential Engine notice | Read. No occupation list. Data covers only sponsors whose programs are on the ETPL (MiTC). |
| https://www.michigan.gov/mcda/reports/2026-registered-apprenticeships-in-michigan-report | 2026 MCDA report page (the report has occupation tables per its summary) | Page read. The PDF (https://www.michigan.gov/mcda/-/media/Project/Websites/mcda/reports/2026/2026-Registered-Apprenticeships-in-Michigan-Report.pdf) timed out in browserbox (pdf.extract, 240 s) and returned 403 to WebFetch. Not extracted. |

Sponsor-listed occupations and industries (from the group sponsor table; these are what each sponsor declares, not the state list):

| Sponsor | Declared occupations / industries |
|---|---|
| West Michigan Works! | Advanced Manufacturing, Construction, Healthcare, Information Technology, Professional Services |
| Jackson Area Manufacturers Association (JAMA) | Advanced Manufacturing, Technology (IT/Tech), Construction, Finance, Energy (including Renewable Energy), Public Administration |
| Workforce Intelligence Network (WIN) | Advanced Manufacturing, Healthcare, Information Technology, Skilled Trades |
| Michigan Career & Technical Institute | Automotive Technology, Cabinetmaking/Millwork, Industrial Electronics, Machine Technology (CNC and Welding), Commercial Printing, others |
| Zero Day Inc. (Veteran focused) | Agriculture, Commercial Drone Pilot, Conservation Officer/Wildlife Management, Construction, Restaurant Management |
| Child Care Network | Child Care Development Specialist |
| Legacy Barber College | Barber |
| Barcos Institute & Foundation | Barbering, Medical Esthetics |
| Detroit Institute of Gastronomy | Culinary Arts |
| Alma College | Education, Special Education Teacher |

Group sponsor count in the table: 16 Michigan Works! agencies plus 22 other organizations (counted from the page's tables), including "All*" entries that mean no restriction.

Most complete Michigan list: not found. The state has no published occupation list on the LEO pages read. The dashboard and 2026 MCDA report PDF are the likely sources, but neither was readable.

## 3. Not found / could not confirm

- DOL Occupation Finder data (JS-rendered, Azure-backed): not read.
- DOL Bulletin 2020-64 Excel attachment: binary only, not readable through the fetch path.
- DOL Bulletin 2016-28 xlsx: now redirects to dol.gov/agencies/eta, so not found.
- Michigan occupation-level list: not found on LEO pages.
- Michigan Registered Apprenticeship Dashboard: interactive, not readable with static fetch.
- 2026 MCDA report PDF: browserbox pdf.extract timed out at 240 s, WebFetch got 403.
- Code and term data for any occupation: none confirmed from these sources.
