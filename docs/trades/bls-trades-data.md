# BLS data: trades and hands-on occupations (US and Michigan)

**Releases used**

- Employment Projections: **2025-35 edition** (base year 2025, projected 2035; Table 1.2 of occupation.xlsx). Source: https://www.bls.gov/emp/tables/occupational-projections-and-characteristics.htm and https://www.bls.gov/emp/ind-occ-matrix/occupation.xlsx
- OEWS **May 2025** (latest): national, Michigan state, and Ann Arbor MSA employment and median annual wage. Sources: https://www.bls.gov/oes/special-requests/oesm25nat.zip , https://www.bls.gov/oes/special-requests/oesm25st.zip , https://www.bls.gov/oes/special-requests/oesm25ma.zip (index: https://www.bls.gov/oes/tables.htm)
- OEWS **May 2024** (prior year), used only for year-over-year employment change: https://www.bls.gov/oes/special-requests/oesm24nat.zip , https://www.bls.gov/oes/special-requests/oesm24st.zip

**Notes**

- YoY % = (May 2025 employment minus May 2024 employment) / May 2024 employment, computed from the two OEWS releases. OEWS is a rolling 3-year panel sample and BLS cautions against reading year-to-year changes as precise trends; small Michigan occupations swing a lot. US YoY is the more stable one.
- OEWS counts wage-and-salary jobs only. Projections count all jobs including self-employed, so the two employment figures differ for the same occupation. Projected employment is in thousands (CSV).
- Annualized % = (2035 employment / 2025 employment)^(1/10) - 1, from the projections columns.
- Blank = not in the data (suppressed by BLS, not published for that area, or wage top-coded). Nothing is estimated. The CSV also has Ann Arbor employment and wage, Michigan YoY, and the raw 2024 employment counts.
- Scope: all detailed occupations in SOC major groups 47, 49, 51, 53, plus selected hands-on occupations from other groups (nurses, dental hygienists, respiratory therapists, sonographers and other health technologists, EMTs/paramedics, firefighters, police, 911 dispatchers, opticians, hearing aid specialists, funeral occupations, surveyors, tree trimmers, landscaping, cooks/chefs, barbers/hairdressers). Farriers have no separate SOC code, so they are not in the data.
- Typical entry education is the BLS category; text after 'OJT:' is the typical on-the-job training.

**Occupations in table: 306**

## Top 25 by projected growth, 2025-35

| Rank | Occupation | SOC | Proj. change % | Annual openings (K) | US median wage | US employment (OEWS 2025) |
|---|---|---|---|---|---|---|
| 1 | Solar photovoltaic installers | 47-2231 | 36.5 | 4.2 | 53,140 | 31,350 |
| 2 | Wind turbine service technicians | 49-9081 | 29.5 | 1.5 | 64,120 | 9,980 |
| 3 | Physical therapist assistants | 31-2021 | 23.0 | 18.5 | 68,380 | 112,430 |
| 4 | Occupational therapy assistants | 31-2011 | 21.5 | 8.1 | 72,300 | 51,290 |
| 5 | Ophthalmic medical technicians | 29-2057 | 21.4 | 11.8 | 45,570 | 71,010 |
| 6 | Hearing aid specialists | 29-2092 | 19.4 | 0.9 | 65,160 | 11,270 |
| 7 | Industrial machinery mechanics | 49-9041 | 17.8 | 44.4 | 64,520 | 439,640 |
| 8 | Massage therapists | 31-9011 | 15.3 | 20.4 | 58,450 | 98,790 |
| 9 | Occupational therapists | 29-1122 | 14.8 | 10 | 100,330 | 162,450 |
| 10 | Diagnostic medical sonographers | 29-2032 | 13.9 | 6 | 96,590 | 90,160 |
| 11 | Medical equipment repairers | 49-9062 | 12.6 | 8.2 | 61,660 | 65,990 |
| 12 | Cooks, restaurant | 35-2014 | 12.1 | 218.6 | 37,390 | 1,409,890 |
| 13 | Physical therapists | 29-1123 | 11.9 | 13.4 | 102,760 | 267,330 |
| 14 | Taxi drivers | 53-3054 | 11.5 | 20.4 | 42,100 | 41,050 |
| 15 | Heating, air conditioning, and refrigeration mechanics and installers | 49-9021 | 10.9 | 40.6 | 61,010 | 409,670 |
| 16 | Farm equipment mechanics and service technicians | 49-3041 | 10.7 | 3.7 | 56,550 | 37,870 |
| 17 | Electrical power-line installers and repairers | 49-9051 | 10.3 | 10.9 | 95,320 | 131,070 |
| 18 | Tile and stone setters | 47-2044 | 9.8 | 3.3 | 55,690 | 35,850 |
| 19 | Electrical and electronics repairers, powerhouse, substation, and relay | 49-2095 | 9.7 | 1.8 | 103,020 | 20,720 |
| 20 | Recreational vehicle service technicians | 49-3092 | 9.7 | 2.2 | 52,000 | 17,430 |
| 21 | Veterinary technologists and technicians | 29-2056 | 9.4 | 13.4 | 47,380 | 129,140 |
| 22 | Avionics technicians | 49-2091 | 9.4 | 1.7 | 82,280 | 18,830 |
| 23 | Electricians | 47-2111 | 9.2 | 72.7 | 63,190 | 757,220 |
| 24 | Aircraft cargo handling supervisors | 53-1041 | 9.2 | 0.9 | 58,170 | 9,760 |
| 25 | Floor layers, except carpet, wood, and hard tiles | 47-2042 | 9.0 | 2.2 | 56,460 | 23,640 |

## 15 shrinking or flattest, 2025-35 (lowest projected change)

| Rank | Occupation | SOC | Proj. change % | Annual openings (K) | US median wage | US employment (OEWS 2025) |
|---|---|---|---|---|---|---|
| 1 | Foundry mold and coremakers | 51-4071 | -23.0 | 0.8 | 48,110 | 12,790 |
| 2 | Patternmakers, metal and plastic | 51-4062 | -22.8 | 0.1 | 58,000 | 1,470 |
| 3 | Grinding and polishing workers, hand | 51-9022 | -19.2 | 0.7 | 42,660 | 10,510 |
| 4 | Cutters and trimmers, hand | 51-9031 | -18.9 | 0.5 | 38,020 | 6,060 |
| 5 | Roof bolters, mining | 47-5043 | -18.9 | 0.1 | 78,540 | 2,160 |
| 6 | Print binding and finishing workers | 51-5113 | -17.5 | 2.3 | 42,290 | 33,180 |
| 7 | Model makers, metal and plastic | 51-4061 | -17.3 | 0.2 | 63,340 | 2,610 |
| 8 | Forging machine setters, operators, and tenders, metal and plastic | 51-4022 | -17.2 | 0.6 | 49,030 | 8,930 |
| 9 | Engine and other machine assemblers | 51-2031 | -17.0 | 2.1 | 53,710 | 34,000 |
| 10 | Carpet installers | 47-2041 | -16.4 | 0.7 | 50,340 | 13,780 |
| 11 | Loading and moving machine operators, underground mining | 47-5044 | -15.8 | 0.4 | 74,500 | 5,930 |
| 12 | Pressers, textile, garment, and related materials | 51-6021 | -15.7 | 2.2 | 35,060 | 26,120 |
| 13 | Camera and photographic equipment repairers | 49-9061 | -15.5 | 0.1 | 52,720 | 1,650 |
| 14 | Prepress technicians and workers | 51-5111 | -15.3 | 2.1 | 48,690 | 23,840 |
| 15 | Sewing machine operators | 51-6031 | -15.1 | 9.8 | 36,670 | 104,880 |

## Full table, sorted by US employment (May 2025), descending

| Occupation | SOC | US emp. | MI emp. | US median wage | MI median wage | Proj. change % 2025-35 | Annualized % | Annual openings (K) | Typical entry education / training | US emp. YoY % (May25 vs May24) |
|---|---|---|---|---|---|---|---|---|---|---|
| Registered nurses | 29-1141 | 3,379,720 | 104,950 | 97,550 | 94,300 | 5.6 | 0.55 | 180.8 | Bachelor's degree | 3.0 |
| Laborers and freight, stock, and material movers, hand | 53-7062 | 2,950,280 | 79,410 | 40,240 | 38,860 | 1.8 | 0.17 | 340.5 | No formal educational credential; OJT: Short-term on-the-job training | -1.1 |
| Stockers and order fillers | 53-7065 | 2,833,810 | 82,730 | 37,330 | 35,930 | 8.9 | 0.86 | 430.7 | No formal educational credential; OJT: Short-term on-the-job training | 2.0 |
| Heavy and tractor-trailer truck drivers | 53-3032 | 2,062,040 | 60,800 | 58,640 | 57,180 | 3.8 | 0.37 | 214.5 | Postsecondary nondegree award; OJT: Short-term on-the-job training | -0.4 |
| Maintenance and repair workers, general | 49-9071 | 1,529,700 | 39,490 | 49,590 | 47,580 | 4.2 | 0.42 | 148.7 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -0.1 |
| Nursing assistants | 31-1131 | 1,448,910 | 43,290 | 42,260 | 39,570 | 2.6 | 0.26 | 196.2 | Postsecondary nondegree award | 4.4 |
| Cooks, restaurant | 35-2014 | 1,409,890 | 39,100 | 37,390 | 36,980 | 12.1 | 1.15 | 218.6 | No formal educational credential; OJT: Moderate-term on-the-job training | -2.9 |
| Miscellaneous assemblers and fabricators | 51-2090 | 1,405,030 | 112,310 | 44,650 | 44,690 | 1.1 | 0.11 | 138.7 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -3.6 |
| Construction laborers | 47-2061 | 1,096,780 | 28,490 | 47,120 | 49,590 | 7.3 | 0.71 | 120 | No formal educational credential; OJT: Short-term on-the-job training | 3.7 |
| Light truck drivers | 53-3033 | 983,300 | 26,160 | 44,860 | 43,000 | 6.3 | 0.62 | 107.2 | High school diploma or equivalent; OJT: Short-term on-the-job training | -1.1 |
| Landscaping and groundskeeping workers | 37-3011 | 952,640 | 32,330 | 39,150 | 38,120 | 4.7 | 0.46 | 149.5 | No formal educational credential; OJT: Short-term on-the-job training | 1.0 |
| First-line supervisors of construction trades and extraction workers | 47-1011 | 812,210 | 16,660 | 79,920 | 78,180 | 5.0 | 0.49 | 67 | High school diploma or equivalent | 0.8 |
| Industrial truck and tractor operators | 53-7051 | 774,420 | 23,470 | 46,420 | 45,220 | 1.5 | 0.14 | 64.7 | No formal educational credential; OJT: Short-term on-the-job training | -3.9 |
| Electricians | 47-2111 | 757,220 | 23,530 | 63,190 | 76,270 | 9.2 | 0.89 | 72.7 | High school diploma or equivalent; OJT: Apprenticeship | 2.0 |
| Automotive service technicians and mechanics | 49-3023 | 704,640 | 22,280 | 50,620 | 54,120 | 5.0 | 0.48 | 66.2 | Postsecondary nondegree award; OJT: Short-term on-the-job training | 2.3 |
| First-line supervisors of production and operating workers | 51-1011 | 673,430 | 26,650 | 74,450 | 72,170 | 1.8 | 0.18 | 61 | High school diploma or equivalent | -1.7 |
| Police and sheriff's patrol officers | 33-3051 | 670,520 | 16,750 | 76,210 | 73,730 | 3.5 | 0.34 | 51.5 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 0.5 |
| Carpenters | 47-2031 | 670,090 | 18,590 | 60,580 | 61,680 | 3.9 | 0.39 | 62.8 | High school diploma or equivalent; OJT: Apprenticeship | -4.0 |
| Licensed practical and licensed vocational nurses | 29-2061 | 648,410 | 10,880 | 64,400 | 65,460 | 3.0 | 0.29 | 51.8 | Postsecondary nondegree award | 2.5 |
| First-line supervisors of transportation and material moving workers, except aircraft cargo handling supervisors | 53-1047 | 623,640 | 14,600 | 62,890 | 60,280 | 3.0 | 0.3 | 54.9 | High school diploma or equivalent | 3.0 |
| First-line supervisors of mechanics, installers, and repairers | 49-1011 | 617,500 | 15,740 | 79,860 | 77,810 | 4.1 | 0.4 | 48.9 | High school diploma or equivalent | 2.8 |
| Inspectors, testers, sorters, samplers, and weighers | 51-9061 | 597,370 | 27,980 | 48,570 | 44,490 | 2.5 | 0.25 | 66.7 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 1.0 |
| Packers and packagers, hand | 53-7064 | 559,820 | 15,590 | 36,280 | 35,340 | -5.0 | -0.51 | 61.8 | No formal educational credential; OJT: Short-term on-the-job training | -6.9 |
| Operating engineers and other construction equipment operators | 47-2073 | 478,090 | 9,500 | 59,850 | 62,690 | 4.6 | 0.45 | 39.2 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 1.9 |
| Plumbers, pipefitters, and steamfitters | 47-2152 | 465,840 | 14,120 | 63,800 | 80,190 | 6.8 | 0.66 | 42 | High school diploma or equivalent; OJT: Apprenticeship | 2.2 |
| Industrial machinery mechanics | 49-9041 | 439,640 | 17,310 | 64,520 | 64,250 | 17.8 | 1.65 | 44.4 | High school diploma or equivalent; OJT: Long-term on-the-job training | 4.2 |
| Welders, cutters, solderers, and brazers | 51-4121 | 416,210 | 13,330 | 53,750 | 49,990 | 2.4 | 0.24 | 40.3 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -1.8 |
| Heating, air conditioning, and refrigeration mechanics and installers | 49-9021 | 409,670 | 12,590 | 61,010 | 60,850 | 10.9 | 1.04 | 40.6 | Postsecondary nondegree award; OJT: Long-term on-the-job training | 3.2 |
| Driver/sales workers | 53-3031 | 409,180 | 15,490 | 38,770 | 39,610 | 7.9 | 0.77 | 45.5 | High school diploma or equivalent; OJT: Short-term on-the-job training | -2.0 |
| Bus drivers, school | 53-3051 | 402,930 | 8,780 | 47,920 | 46,380 | 0.7 | 0.07 | 56.5 | High school diploma or equivalent; OJT: Short-term on-the-job training | 3.9 |
| Dental assistants | 31-9091 | 387,790 | 11,990 | 48,070 | 48,820 | 7.4 | 0.72 | 53 | Postsecondary nondegree award | 3.3 |
| Correctional officers and jailers | 33-3012 | 380,500 | 8,220 | 58,940 | 64,020 | -7.4 | -0.77 | 28.4 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 4.1 |
| Cleaners of vehicles and equipment | 53-7061 | 380,430 | 10,320 | 35,830 | 33,890 | 3.9 | 0.38 | 51.5 | No formal educational credential; OJT: Short-term on-the-job training | 1.7 |
| Packaging and filling machine operators and tenders | 51-9111 | 379,060 | 10,940 | 43,220 | 41,690 | 4.1 | 0.41 | 41.4 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -1.3 |
| Firefighters | 33-2011 | 345,990 | 6,610 | 59,280 | 54,640 | 3.7 | 0.36 | 26.8 | Postsecondary nondegree award; OJT: Long-term on-the-job training | 4.1 |
| Hairdressers, hairstylists, and cosmetologists | 39-5012 | 305,710 | 8,970 | 35,790 | 34,820 | 7.7 | 0.75 | 73.4 | Postsecondary nondegree award | 3.5 |
| Bus and truck mechanics and diesel engine specialists | 49-3031 | 289,960 | 9,020 | 61,770 | 61,420 | 3.6 | 0.36 | 24.4 | High school diploma or equivalent; OJT: Long-term on-the-job training | 1.0 |
| Machinists | 51-4041 | 287,050 | 20,350 | 58,750 | 52,360 | 1.0 | 0.1 | 26.1 | High school diploma or equivalent; OJT: Long-term on-the-job training | -3.9 |
| Physical therapists | 29-1123 | 267,330 | 8,630 | 102,760 | 100,900 | 11.9 | 1.14 | 13.4 | Doctoral or professional degree | 7.5 |
| Production workers, all other | 51-9199 | 251,700 | 14,690 | 40,110 | 37,950 | 0.8 | 0.08 | 27.3 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -9.2 |
| Shuttle drivers and chauffeurs | 53-3053 | 248,530 | 5,870 | 37,290 | 36,330 | 7.1 | 0.69 | 35.5 | No formal educational credential; OJT: Short-term on-the-job training | 8.2 |
| Electrical, electronic, and electromechanical assemblers, except coil winders, tapers, and finishers | 51-2028 | 246,970 | 7,270 | 45,850 | 44,350 | 5.0 | 0.49 | 25.9 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -5.4 |
| Bakers | 51-3011 | 236,200 | 7,290 | 37,160 | 35,830 | 5.5 | 0.54 | 36.5 | No formal educational credential; OJT: Moderate-term on-the-job training | 1.9 |
| Radiologic technologists and technicians | 29-2034 | 230,490 | 7,220 | 80,110 | 76,420 | 5.0 | 0.49 | 13 | Associate's degree | 3.1 |
| Painters, construction and maintenance | 47-2141 | 225,190 | 4,920 | 49,400 | 50,650 | 3.0 | 0.3 | 24.9 | No formal educational credential; OJT: Moderate-term on-the-job training | 0.5 |
| Dental hygienists | 29-1292 | 222,740 | 8,640 | 98,100 | 83,790 | 8.0 | 0.77 | 15 | Associate's degree | 1.7 |
| Cement masons and concrete finishers | 47-2051 | 206,170 | 6,350 | 57,020 | 59,860 | 1.6 | 0.16 | 13.6 | No formal educational credential; OJT: Moderate-term on-the-job training | 0.5 |
| Chefs and head cooks | 35-1011 | 200,040 | 5,360 | 62,470 | 60,070 | 6.6 | 0.64 | 25.2 | High school diploma or equivalent | 9.7 |
| Laundry and dry-cleaning workers | 51-6011 | 198,040 | 4,970 | 34,890 | 35,100 | 4.3 | 0.42 | 28.2 | No formal educational credential; OJT: Short-term on-the-job training | 1.4 |
| Emergency medical technicians | 29-2042 | 180,510 | 4,230 | 44,470 | 39,870 | 5.8 | 0.57 | 13.8 | Postsecondary nondegree award | 1.4 |
| Mobile heavy equipment mechanics, except engines | 49-3042 | 176,600 | 3,860 | 65,510 | 66,680 | 6.7 | 0.66 | 15 | High school diploma or equivalent; OJT: Long-term on-the-job training | -2.0 |
| Installation, maintenance, and repair workers, all other | 49-9099 | 176,300 | 5,800 | 49,230 | 47,470 | 2.6 | 0.26 | 18.3 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -4.0 |
| Food batchmakers | 51-3092 | 174,520 | 5,130 | 42,290 | 40,160 | 6.5 | 0.63 | 23.1 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 1.7 |
| Cutting, punching, and press machine setters, operators, and tenders, metal and plastic | 51-4031 | 171,200 | 22,060 | 46,330 | 46,120 | -10.5 | -1.1 | 13.2 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -1.9 |
| Computer numerically controlled tool operators | 51-9161 | 169,450 | 7,330 | 50,690 | 47,250 | -9.4 | -0.98 | 12.5 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -4.2 |
| Helpers--production workers | 51-9198 | 165,700 | 3,610 | 39,070 | 41,660 | -8.2 | -0.86 | 20.9 | High school diploma or equivalent; OJT: Short-term on-the-job training | -1.1 |
| Occupational therapists | 29-1122 | 162,450 | 5,120 | 100,330 | 89,910 | 14.8 | 1.39 | 10 | Master's degree | 6.7 |
| Bus drivers, transit and intercity | 53-3052 | 159,240 | 3,620 | 59,050 | 47,660 | 4.1 | 0.41 | 21.1 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 6.9 |
| Coating, painting, and spraying machine setters, operators, and tenders | 51-9124 | 158,740 | 7,050 | 48,250 | 44,670 | 2.5 | 0.25 | 15.3 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -0.5 |
| Highway maintenance workers | 47-4051 | 154,960 | 5,230 | 50,260 | 53,750 | 3.4 | 0.33 | 11.8 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 2.1 |
| Molding, coremaking, and casting machine setters, operators, and tenders, metal and plastic | 51-4072 | 150,470 | 13,550 | 44,350 | 39,490 | -3.4 | -0.35 | 13.8 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -2.8 |
| Automotive body and related repairers | 49-3021 | 149,310 | 5,010 | 54,890 | 56,880 | 3.7 | 0.37 | 12.6 | High school diploma or equivalent; OJT: Long-term on-the-job training | -3.8 |
| Refuse and recyclable material collectors | 53-7081 | 147,240 | 4,020 | 49,690 | 51,030 | 2.1 | 0.2 | 15.5 | No formal educational credential; OJT: Short-term on-the-job training | 5.8 |
| Construction and building inspectors | 47-4011 | 146,720 | 3,090 | 74,690 | 71,040 | 0.0 | 0.0 | 14.8 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 6.9 |
| Meat, poultry, and fish cutters and trimmers | 51-3022 | 145,700 | 920 | 38,300 | 44,430 | 5.7 | 0.55 | 17 | No formal educational credential; OJT: Short-term on-the-job training | 3.3 |
| Printing press operators | 51-5112 | 144,260 | 5,110 | 45,780 | 45,280 | -8.7 | -0.91 | 12.1 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -0.6 |
| Phlebotomists | 31-9097 | 143,540 | 3,540 | 45,230 | 39,860 | 6.8 | 0.66 | 18 | Postsecondary nondegree award | 3.4 |
| Telecommunications equipment installers and repairers, except line installers | 49-2022 | 140,920 | 3,940 | 63,890 | 61,700 | -3.3 | -0.33 | 11.3 | Postsecondary nondegree award; OJT: Moderate-term on-the-job training | -8.4 |
| Respiratory therapists | 29-1126 | 139,790 | 4,520 | 82,280 | 79,850 | 8.5 | 0.83 | 8.6 | Associate's degree | 2.5 |
| Chemical equipment operators and tenders | 51-9011 | 139,630 | 5,210 | 58,040 | 50,060 | 3.6 | 0.35 | 13.9 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 9.6 |
| Aircraft mechanics and service technicians | 49-3011 | 138,090 | 3,380 | 79,870 | 74,900 | 5.4 | 0.53 | 11.4 | Postsecondary nondegree award | 1.2 |
| Parking attendants | 53-6021 | 137,880 | 3,210 | 35,150 | 33,690 | 2.0 | 0.2 | 16.4 | No formal educational credential; OJT: Short-term on-the-job training | 2.4 |
| Butchers and meat cutters | 51-3021 | 136,430 | 4,230 | 40,140 | 39,350 | 2.4 | 0.24 | 15.1 | No formal educational credential; OJT: Moderate-term on-the-job training | -2.6 |
| Roofers | 47-2181 | 135,490 | 3,090 | 55,440 | 59,530 | 5.3 | 0.51 | 12 | No formal educational credential; OJT: Moderate-term on-the-job training | -0.9 |
| Flight attendants | 53-2031 | 131,650 |  | 63,580 | 62,490 | 8.8 | 0.85 | 18.5 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 1.2 |
| Electrical power-line installers and repairers | 49-9051 | 131,070 | 2,800 | 95,320 | 106,890 | 10.3 | 0.99 | 10.9 | High school diploma or equivalent; OJT: Long-term on-the-job training | 6.0 |
| Veterinary technologists and technicians | 29-2056 | 129,140 | 2,550 | 47,380 | 49,710 | 9.4 | 0.91 | 13.4 | Associate's degree | -1.7 |
| Water and wastewater treatment plant and system operators | 51-8031 | 128,490 | 3,400 | 60,020 | 59,270 | -5.7 | -0.59 | 10 | High school diploma or equivalent; OJT: Long-term on-the-job training | 1.4 |
| Multiple machine tool setters, operators, and tenders, metal and plastic | 51-4081 | 124,590 | 9,350 | 47,180 | 45,920 | 0.6 | 0.06 | 11.6 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -4.1 |
| Sheet metal workers | 47-2211 | 119,770 | 4,000 | 61,800 | 64,490 | 2.5 | 0.25 | 9.8 | High school diploma or equivalent; OJT: Apprenticeship | 2.0 |
| Surgical technologists | 29-2055 | 117,460 | 3,840 | 64,650 | 63,320 | 5.0 | 0.49 | 7.1 | Postsecondary nondegree award | 3.1 |
| Physical therapist assistants | 31-2021 | 112,430 | 4,520 | 68,380 | 61,670 | 23.0 | 2.1 | 18.5 | Associate's degree | 4.1 |
| Tire repairers and changers | 49-3093 | 108,410 | 4,470 | 37,710 | 37,130 | 3.4 | 0.33 | 12.9 | High school diploma or equivalent; OJT: Short-term on-the-job training | 1.7 |
| Sewing machine operators | 51-6031 | 104,880 | 3,210 | 36,670 | 37,490 | -15.1 | -1.62 | 9.8 | No formal educational credential; OJT: Short-term on-the-job training | -4.3 |
| Airline pilots, copilots, and flight engineers | 53-2011 | 103,560 |  | 232,140 | 428,570 | 8.3 | 0.8 | 11.2 | Bachelor's degree; OJT: Moderate-term on-the-job training | 4.3 |
| Public safety telecommunicators | 43-5031 | 102,500 | 2,100 | 53,040 | 53,310 | 3.7 | 0.36 | 9 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 1.3 |
| Automotive and watercraft service attendants | 53-6031 | 102,010 | 3,390 | 35,670 | 31,280 | 3.8 | 0.37 | 12.9 | No formal educational credential; OJT: Short-term on-the-job training | 3.8 |
| Paramedics | 29-2043 | 100,610 | 2,750 | 60,600 | 52,080 | 5.7 | 0.55 | 4.3 | Postsecondary nondegree award | 1.1 |
| Massage therapists | 31-9011 | 98,790 | 2,410 | 58,450 | 70,960 | 15.3 | 1.43 | 20.4 | Postsecondary nondegree award | 2.9 |
| Telecommunications line installers and repairers | 49-9052 | 97,720 | 2,780 | 74,330 | 74,360 | -3.4 | -0.34 | 8 | High school diploma or equivalent; OJT: Long-term on-the-job training | -0.7 |
| Paper goods machine setters, operators, and tenders | 51-9196 | 96,130 | 3,000 | 50,270 | 50,540 | -3.6 | -0.37 | 9 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -0.8 |
| Helpers--installation, maintenance, and repair workers | 49-9098 | 95,580 | 2,180 | 39,630 | 43,630 | 5.3 | 0.51 | 13.6 | High school diploma or equivalent; OJT: Short-term on-the-job training | -2.0 |
| Mixing and blending machine setters, operators, and tenders | 51-9023 | 94,920 | 3,040 | 48,990 | 44,310 | -6.1 | -0.62 | 7.9 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -5.9 |
| Diagnostic medical sonographers | 29-2032 | 90,160 | 3,100 | 96,590 | 82,490 | 13.9 | 1.32 | 6 | Associate's degree | 4.3 |
| Security and fire alarm systems installers | 49-2098 | 86,340 | 2,060 | 60,070 | 55,830 | 6.8 | 0.65 | 8.5 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 5.9 |
| Drywall and ceiling tile installers | 47-2081 | 83,080 | 1,050 | 58,930 | 58,440 | 2.5 | 0.24 | 6.6 | No formal educational credential; OJT: Moderate-term on-the-job training | 0.2 |
| Cabinetmakers and bench carpenters | 51-7011 | 77,170 | 1,120 | 46,680 | 48,550 | -2.9 | -0.3 | 6.9 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -3.0 |
| Opticians, dispensing | 29-2081 | 73,530 | 3,080 | 47,260 | 41,180 | 4.2 | 0.41 | 5.6 | High school diploma or equivalent; OJT: Long-term on-the-job training | -7.7 |
| Ophthalmic medical technicians | 29-2057 | 71,010 | 1,800 | 45,570 | 46,750 | 21.4 | 1.96 | 11.8 | Postsecondary nondegree award | -7.2 |
| Slaughterers and meat packers | 51-3023 | 69,950 | 2,920 | 40,130 | 45,850 | 2.0 | 0.19 | 7.7 | No formal educational credential; OJT: Short-term on-the-job training | 3.6 |
| Structural iron and steel workers | 47-2221 | 68,380 | 1,750 | 62,780 | 62,830 | 3.1 | 0.3 | 5.9 | High school diploma or equivalent; OJT: Apprenticeship | 5.7 |
| Grinding, lapping, polishing, and buffing machine tool setters, operators, and tenders, metal and plastic | 51-4033 | 67,000 | 4,180 | 46,550 | 45,460 | -10.8 | -1.14 | 4.5 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -4.4 |
| Medical equipment repairers | 49-9062 | 65,990 | 1,820 | 61,660 | 60,680 | 12.6 | 1.2 | 8.2 | Associate's degree; OJT: Moderate-term on-the-job training | 8.5 |
| Computer, automated teller, and office machine repairers | 49-2011 | 65,600 | 1,660 | 47,810 | 47,570 | -3.0 | -0.31 | 6.1 | Some college, no degree; OJT: Short-term on-the-job training | -10.1 |
| Electrical and electronics repairers, commercial and industrial equipment | 49-2094 | 65,010 | 1,460 | 74,090 | 66,140 | 0.3 | 0.03 | 4.7 | Postsecondary nondegree award; OJT: Long-term on-the-job training | 8.4 |
| Food processing workers, all other | 51-3099 | 65,000 | 430 | 39,680 | 38,750 | 5.5 | 0.54 | 7.4 | No formal educational credential; OJT: Moderate-term on-the-job training | 12.2 |
| Helpers--electricians | 47-3013 | 63,630 | 500 | 42,670 | 44,240 | 0.6 | 0.06 | 6.1 | High school diploma or equivalent; OJT: Short-term on-the-job training | -1.3 |
| Cardiovascular technologists and technicians | 29-2031 | 62,960 | 2,070 | 74,310 | 80,650 | 3.7 | 0.37 | 3.4 | Associate's degree | 2.9 |
| Woodworking machine setters, operators, and tenders, except sawing | 51-7042 | 61,420 | 5,250 | 43,380 | 47,680 | -2.5 | -0.25 | 5.3 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -3.0 |
| Extruding and drawing machine setters, operators, and tenders, metal and plastic | 51-4021 | 60,840 | 1,800 | 47,720 | 45,140 | 0.7 | 0.08 | 5.4 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -7.4 |
| Separating, filtering, clarifying, precipitating, and still machine setters, operators, and tenders | 51-9012 | 60,100 | 2,230 | 51,610 | 49,480 | -5.7 | -0.59 | 5.2 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 10.9 |
| Maintenance workers, machinery | 49-9043 | 60,020 | 1,640 | 60,850 | 59,590 | -1.9 | -0.19 | 4.4 | High school diploma or equivalent; OJT: Long-term on-the-job training | 6.2 |
| Extruding, forming, pressing, and compacting machine setters, operators, and tenders | 51-9041 | 58,770 | 1,970 | 45,760 | 39,790 | 1.5 | 0.15 | 5.2 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 2.5 |
| Glaziers | 47-2121 | 58,480 | 2,040 | 57,080 | 52,770 | 1.9 | 0.18 | 3.9 | High school diploma or equivalent; OJT: Apprenticeship | 2.6 |
| Surveying and mapping technicians | 17-3031 | 58,010 | 690 | 54,240 | 50,340 | 5.8 | 0.56 | 6.9 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 2.3 |
| Tool and die makers | 51-4111 | 56,930 | 9,420 | 64,050 | 65,590 | -9.2 | -0.96 | 4.3 | Postsecondary nondegree award; OJT: Long-term on-the-job training | 3.3 |
| Tree trimmers and pruners | 37-3013 | 55,160 | 1,840 | 50,960 | 57,550 | 4.2 | 0.42 | 7.9 | High school diploma or equivalent; OJT: Short-term on-the-job training | 15.2 |
| Brickmasons and blockmasons | 47-2021 | 52,550 | 2,240 | 62,120 | 63,500 | 1.1 | 0.11 | 4.1 | High school diploma or equivalent; OJT: Apprenticeship | -1.8 |
| Structural metal fabricators and fitters | 51-2041 | 52,360 | 1,270 | 51,330 | 47,950 | -6.2 | -0.65 | 4.8 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -1.9 |
| Hazardous materials removal workers | 47-4041 | 51,710 | 1,610 | 49,450 | 46,380 | 1.5 | 0.15 | 4.3 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 2.3 |
| Occupational therapy assistants | 31-2011 | 51,290 | 1,250 | 72,300 | 63,260 | 21.5 | 1.96 | 8.1 | Associate's degree | 7.1 |
| Surveyors | 17-1022 | 50,830 | 1,050 | 75,440 | 72,080 | 5.8 | 0.56 | 3.1 | Bachelor's degree; OJT: Internship/residency | -4.2 |
| Control and valve installers and repairers, except mechanical door | 49-9012 | 48,240 | 2,240 | 74,340 | 96,890 | 4.3 | 0.43 | 3.6 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 2.8 |
| Commercial pilots | 53-2012 | 47,630 | 1,390 | 123,220 | 126,670 | 5.2 | 0.5 | 5.2 | Postsecondary nondegree award; OJT: Moderate-term on-the-job training | -8.1 |
| Motor vehicle operators, all other | 53-3099 | 46,880 | 2,600 | 37,180 | 33,990 | 2.8 | 0.27 | 6.9 | No formal educational credential; OJT: Short-term on-the-job training | -6.9 |
| Railroad conductors and yardmasters | 53-4031 | 46,440 | 760 | 78,000 | 78,960 | 0.9 | 0.08 | 3 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 8.7 |
| Cutting and slicing machine setters, operators, and tenders | 51-9032 | 44,980 | 730 | 46,570 | 44,620 | -0.9 | -0.09 | 5.4 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -5.4 |
| Roustabouts, oil and gas | 47-5071 | 44,970 | 290 | 46,960 | 51,720 | 3.6 | 0.35 | 4.1 | No formal educational credential; OJT: Moderate-term on-the-job training | -0.8 |
| Insulation workers, floor, ceiling, and wall | 47-2131 | 44,440 | 710 | 49,120 | 46,490 | 2.4 | 0.24 | 3 | No formal educational credential; OJT: Short-term on-the-job training | 15.1 |
| Helpers--pipelayers, plumbers, pipefitters, and steamfitters | 47-3015 | 44,330 | 270 | 42,360 | 42,810 | 2.4 | 0.24 | 4.4 | High school diploma or equivalent; OJT: Short-term on-the-job training | 1.6 |
| Magnetic resonance imaging technologists | 29-2035 | 43,390 | 1,270 | 95,480 | 84,620 | 7.7 | 0.75 | 2.3 | Associate's degree | 4.5 |
| Service unit operators, oil and gas | 47-5013 | 43,140 | 230 | 58,160 | 52,000 | 1.1 | 0.11 | 3.8 | No formal educational credential; OJT: Moderate-term on-the-job training | -2.2 |
| Crane and tower operators | 53-7021 | 42,890 | 1,310 | 68,080 | 59,740 | 3.8 | 0.37 | 3.5 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 2.1 |
| Machine feeders and offbearers | 53-7063 | 42,330 | 740 | 41,220 | 42,320 | -13.1 | -1.4 | 4 | No formal educational credential; OJT: Short-term on-the-job training | -9.3 |
| Paving, surfacing, and tamping equipment operators | 47-2071 | 41,820 | 1,720 | 53,340 | 54,220 | -0.9 | -0.09 | 3.1 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -8.5 |
| Taxi drivers | 53-3054 | 41,050 | 90 | 42,100 | 36,670 | 11.5 | 1.1 | 20.4 | No formal educational credential; OJT: Short-term on-the-job training | 134.4 |
| Sawing machine setters, operators, and tenders, wood | 51-7041 | 40,850 | 1,510 | 42,770 | 40,260 | -1.0 | -0.1 | 4.5 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -5.3 |
| Millwrights | 49-9044 | 40,330 | 2,900 | 65,700 | 89,190 | 0.9 | 0.07 | 3.2 | High school diploma or equivalent; OJT: Apprenticeship | -0.8 |
| Farm equipment mechanics and service technicians | 49-3041 | 37,870 | 980 | 56,550 | 50,870 | 10.7 | 1.03 | 3.7 | High school diploma or equivalent; OJT: Long-term on-the-job training | 2.7 |
| Captains, mates, and pilots of water vessels | 53-5021 | 36,850 | 640 | 92,460 | 53,590 | 4.0 | 0.38 | 3.8 | Postsecondary nondegree award | 4.1 |
| Outdoor power equipment and other small engine mechanics | 49-3053 | 36,060 | 1,860 | 47,880 | 46,730 | 2.3 | 0.23 | 3.8 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 5.3 |
| Tile and stone setters | 47-2044 | 35,850 | 1,010 | 55,690 | 47,950 | 9.8 | 0.93 | 3.3 | No formal educational credential; OJT: Long-term on-the-job training | -7.5 |
| Excavating and loading machine and dragline operators, surface mining | 47-5022 | 34,480 | 880 | 57,430 | 59,040 | 1.0 | 0.09 | 2.4 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 0.8 |
| Dental laboratory technicians | 51-9081 | 34,410 | 1,180 | 49,610 | 49,570 | -5.9 | -0.63 | 3.6 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 1.4 |
| Aircraft structure, surfaces, rigging, and systems assemblers | 51-2011 | 34,020 | 360 | 65,380 | 47,230 | -5.6 | -0.57 | 3.1 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 3.4 |
| Engine and other machine assemblers | 51-2031 | 34,000 | 5,030 | 53,710 | 60,950 | -17.0 | -1.85 | 2.1 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -11.5 |
| Locomotive engineers | 53-4011 | 33,470 |  | 81,410 |  | 0.5 | 0.07 | 2 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 4.6 |
| Molders, shapers, and casters, except metal and plastic | 51-9195 | 33,190 | 1,470 | 46,170 | 45,250 | 5.8 | 0.57 | 5.1 | High school diploma or equivalent; OJT: Long-term on-the-job training | -4.5 |
| Print binding and finishing workers | 51-5113 | 33,180 | 1,320 | 42,290 | 40,460 | -17.5 | -1.92 | 2.3 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -9.0 |
| Petroleum pump system operators, refinery operators, and gaugers | 51-8093 | 33,160 | 180 | 96,710 | 84,030 | -1.9 | -0.18 | 2.7 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -4.9 |
| Pipelayers | 47-2151 | 33,050 | 180 | 49,000 | 61,560 | -3.1 | -0.31 | 2.1 | No formal educational credential; OJT: Short-term on-the-job training | -1.6 |
| Plating machine setters, operators, and tenders, metal and plastic | 51-4193 | 32,410 | 3,330 | 43,960 | 37,600 | -9.7 | -1.01 | 2.5 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 2.9 |
| Home appliance repairers | 49-9031 | 32,150 | 1,050 | 50,990 | 52,160 | 1.9 | 0.2 | 2.8 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 0.7 |
| Sailors and marine oilers | 53-5011 | 31,670 | 250 | 51,520 | 51,310 | 3.2 | 0.33 | 3.6 | No formal educational credential; OJT: Moderate-term on-the-job training | 1.0 |
| Welding, soldering, and brazing machine setters, operators, and tenders | 51-4122 | 31,600 | 3,150 | 47,920 | 42,530 | -8.9 | -0.92 | 2.5 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -12.9 |
| Semiconductor processing technicians | 51-9141 | 31,460 | 270 | 51,430 |  | 8.2 | 0.8 | 3.4 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -2.1 |
| Solar photovoltaic installers | 47-2231 | 31,350 | 310 | 53,140 | 47,080 | 36.5 | 3.15 | 4.2 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 10.9 |
| Aircraft service attendants | 53-6032 | 31,300 | 230 | 40,450 | 41,360 | 5.6 | 0.53 | 4 | High school diploma or equivalent; OJT: Short-term on-the-job training | 14.6 |
| Food cooking machine operators and tenders | 51-3093 | 31,250 | 380 | 41,590 | 47,260 | -0.3 | 0.0 | 3.7 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 13.0 |
| Funeral attendants | 39-4021 | 31,090 | 1,460 | 35,680 | 35,380 | 2.6 | 0.25 | 5.4 | High school diploma or equivalent; OJT: Short-term on-the-job training | 1.7 |
| Septic tank servicers and sewer pipe cleaners | 47-4071 | 30,650 | 1,080 | 49,880 | 50,040 | 7.8 | 0.76 | 2.8 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 5.5 |
| Power plant operators | 51-8013 | 29,320 | 1,220 | 102,040 | 105,820 | -5.1 | -0.52 | 2.3 | High school diploma or equivalent; OJT: Long-term on-the-job training | -4.6 |
| Computer numerically controlled tool programmers | 51-9162 | 28,500 | 2,300 | 68,120 | 64,640 | 5.9 | 0.58 | 2.7 | Postsecondary nondegree award; OJT: Moderate-term on-the-job training | 1.0 |
| Miscellaneous construction and related workers | 47-4090 | 28,380 | 660 | 49,910 | 53,800 | 3.9 | 0.37 | 2.4 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -15.4 |
| Stationary engineers and boiler operators | 51-8021 | 28,250 | 490 | 78,620 | 82,800 | 3.1 | 0.32 | 3.2 | High school diploma or equivalent; OJT: Long-term on-the-job training | -8.2 |
| Mechanical door repairers | 49-9011 | 27,120 | 810 | 55,720 | 52,370 | 6.4 | 0.65 | 2.1 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -3.0 |
| Passenger attendants | 53-6061 | 27,110 | 840 | 37,720 | 40,250 | 6.0 | 0.61 | 4.3 | High school diploma or equivalent; OJT: Short-term on-the-job training | 7.0 |
| Coin, vending, and amusement machine servicers and repairers | 49-9091 | 26,410 | 430 | 47,450 | 46,980 | -3.4 | -0.35 | 3.8 | High school diploma or equivalent; OJT: Short-term on-the-job training | -6.5 |
| Pressers, textile, garment, and related materials | 51-6021 | 26,120 | 300 | 35,060 | 36,290 | -15.7 | -1.68 | 2.2 | No formal educational credential; OJT: Short-term on-the-job training | -2.6 |
| Crushing, grinding, and polishing machine setters, operators, and tenders | 51-9021 | 26,000 | 670 | 48,540 | 46,500 | -1.7 | -0.19 | 2.3 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -8.9 |
| Insulation workers, mechanical | 47-2132 | 25,660 | 650 | 58,340 | 58,860 | 5.1 | 0.51 | 1.8 | High school diploma or equivalent; OJT: Apprenticeship | 0.1 |
| Rolling machine setters, operators, and tenders, metal and plastic | 51-4023 | 25,250 | 1,480 | 50,140 | 44,090 | -8.3 | -0.86 | 1.9 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 13.0 |
| Morticians, undertakers, and funeral arrangers | 39-4031 | 25,100 | 810 | 55,010 | 60,450 | 3.0 | 0.3 | 3 | Associate's degree; OJT: Long-term on-the-job training | -2.3 |
| Helpers, construction trades, all other | 47-3019 | 24,770 | 320 | 42,670 | 39,840 | -1.0 | -0.12 | 2.3 | No formal educational credential; OJT: Short-term on-the-job training | -2.9 |
| Transportation inspectors | 53-6051 | 24,500 | 540 | 92,100 | 35,890 | 2.2 | 0.2 | 2.3 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 5.1 |
| Fence erectors | 47-4031 | 24,480 | 460 | 47,980 | 45,800 | 5.6 | 0.54 | 2.5 | No formal educational credential; OJT: Moderate-term on-the-job training | 8.1 |
| Prepress technicians and workers | 51-5111 | 23,840 | 540 | 48,690 | 46,960 | -15.3 | -1.66 | 2.1 | Postsecondary nondegree award | 3.3 |
| Elevator and escalator installers and repairers | 47-4021 | 23,790 | 560 | 109,910 | 99,140 | 5.7 | 0.55 | 1.9 | High school diploma or equivalent; OJT: Apprenticeship | 1.9 |
| Floor layers, except carpet, wood, and hard tiles | 47-2042 | 23,640 | 670 | 56,460 | 46,800 | 9.0 | 0.84 | 2.2 | No formal educational credential; OJT: Moderate-term on-the-job training | -4.9 |
| Material moving workers, all other | 53-7199 | 23,480 | 130 | 41,800 | 44,090 | 2.7 | 0.28 | 2.8 | No formal educational credential; OJT: Short-term on-the-job training | -6.8 |
| Motorboat mechanics and service technicians | 49-3051 | 23,220 | 1,480 | 57,550 | 47,900 | 4.9 | 0.47 | 2.6 | High school diploma or equivalent; OJT: Long-term on-the-job training | -4.2 |
| Conveyor operators and tenders | 53-7011 | 22,930 | 410 | 42,420 | 39,340 | -2.6 | -0.28 | 2.2 | No formal educational credential; OJT: Short-term on-the-job training | -12.0 |
| Riggers | 49-9096 | 22,530 | 380 | 62,640 | 58,490 | 3.9 | 0.39 | 1.7 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -6.9 |
| Air traffic controllers | 53-2021 | 22,510 | 360 | 148,080 | 118,930 | 1.7 | 0.17 | 2.1 | Associate's degree; OJT: Long-term on-the-job training | 0.5 |
| Jewelers and precious stone and metal workers | 51-9071 | 22,440 | 460 | 52,540 | 56,610 | -3.2 | -0.31 | 3.7 | High school diploma or equivalent; OJT: Long-term on-the-job training | -4.2 |
| Textile winding, twisting, and drawing out machine setters, operators, and tenders | 51-6064 | 22,020 | 130 | 38,670 | 36,540 | -10.3 | -1.12 | 2.4 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 6.9 |
| Helpers--carpenters | 47-3012 | 21,680 | 230 | 43,780 | 44,960 | -1.7 | -0.18 | 2 | No formal educational credential; OJT: Short-term on-the-job training | -11.9 |
| Rail car repairers | 49-3043 | 21,350 | 370 | 67,530 | 64,370 | 2.6 | 0.25 | 1.6 | High school diploma or equivalent; OJT: Long-term on-the-job training | 16.7 |
| Tire builders | 51-9197 | 20,770 | 80 | 57,390 | 44,420 | 0.8 | 0.1 | 1.9 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -1.0 |
| Electrical and electronics repairers, powerhouse, substation, and relay | 49-2095 | 20,720 | 450 | 103,020 | 106,600 | 9.7 | 0.92 | 1.8 | Postsecondary nondegree award; OJT: Moderate-term on-the-job training | -10.1 |
| Food and tobacco roasting, baking, and drying machine operators and tenders | 51-3091 | 20,370 | 700 | 44,810 | 48,240 | 0.4 | 0.05 | 2.5 | No formal educational credential; OJT: Moderate-term on-the-job training | 4.5 |
| Automotive glass installers and repairers | 49-3022 | 20,310 | 580 | 47,630 | 46,860 | 5.7 | 0.56 | 1.3 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 7.2 |
| Upholsterers | 51-6093 | 20,140 | 500 | 46,340 | 44,890 | -2.3 | -0.22 | 1.7 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -4.0 |
| Audiovisual equipment installers and repairers | 49-2097 | 19,780 | 310 | 52,600 | 45,400 | 4.8 | 0.44 | 2.2 | Postsecondary nondegree award; OJT: Short-term on-the-job training | -10.8 |
| Rail-track laying and maintenance equipment operators | 47-4061 | 19,580 | 290 | 70,070 | 75,450 | 1.5 | 0.17 | 1.2 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 18.8 |
| Earth drillers, except oil and gas | 47-5023 | 19,450 | 850 | 60,190 | 62,570 | 3.6 | 0.35 | 1.4 | High school diploma or equivalent; OJT: Long-term on-the-job training | 11.7 |
| Plasterers and stucco masons | 47-2161 | 19,310 | 210 | 57,660 | 72,990 | 2.8 | 0.3 | 1.5 | No formal educational credential; OJT: Long-term on-the-job training | -7.5 |
| Avionics technicians | 49-2091 | 18,830 | 300 | 82,280 | 58,280 | 9.4 | 0.87 | 1.7 | Postsecondary nondegree award | -9.9 |
| Ophthalmic laboratory technicians | 51-9083 | 18,660 | 330 | 39,460 | 45,490 | 2.2 | 0.21 | 2.2 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -0.4 |
| Gas plant operators | 51-8092 | 18,030 | 540 | 87,820 | 100,500 | -6.0 | -0.62 | 1.4 | High school diploma or equivalent; OJT: Long-term on-the-job training | 13.3 |
| Wellhead pumpers | 53-7073 | 17,990 | 210 | 69,960 | 47,630 | -2.0 | -0.22 | 1.7 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 3.7 |
| Recreational vehicle service technicians | 49-3092 | 17,430 | 640 | 52,000 | 41,600 | 9.7 | 0.93 | 2.2 | High school diploma or equivalent; OJT: Long-term on-the-job training | -6.8 |
| Nuclear medicine technologists | 29-2033 | 17,080 | 640 | 101,370 | 95,400 | 4.4 | 0.45 | 0.8 | Associate's degree | 0.7 |
| Radiation therapists | 29-1124 | 17,070 | 450 | 105,310 | 95,890 | 2.8 | 0.28 | 0.7 | Associate's degree | -8.7 |
| Metal-refining furnace operators and tenders | 51-4051 | 16,780 | 680 | 54,430 | 44,900 | -2.9 | -0.3 | 1.4 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -17.5 |
| Lathe and turning machine tool setters, operators, and tenders, metal and plastic | 51-4034 | 16,710 | 1,540 | 50,620 | 46,680 | -11.3 | -1.2 | 1.4 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -11.9 |
| Chemical plant and system operators | 51-8091 | 16,610 | 40 | 78,120 | 72,430 | -5.2 | -0.49 | 1.3 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -6.9 |
| Fiberglass laminators and fabricators | 51-2051 | 16,170 | 520 | 46,880 | 43,980 | 4.6 | 0.42 | 1.7 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -12.7 |
| Metal workers and plastic workers, all other | 51-4199 | 15,900 | 530 | 45,950 | 40,110 | -7.1 | -0.76 | 1.3 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -21.6 |
| Airfield operations specialists | 53-2022 | 15,190 | 440 | 56,850 | 61,780 | 7.8 | 0.76 | 1.5 | High school diploma or equivalent; OJT: Long-term on-the-job training | -8.7 |
| Locksmiths and safe repairers | 49-9094 | 15,040 | 230 | 51,320 | 54,120 | -11.7 | -1.24 | 1.2 | High school diploma or equivalent; OJT: Long-term on-the-job training | -3.3 |
| Barbers | 39-5011 | 15,000 |  | 38,210 | 35,490 | 3.3 | 0.33 | 6.9 | Postsecondary nondegree award | -17.1 |
| Cleaning, washing, and metal pickling equipment operators and tenders | 51-9192 | 14,760 | 820 | 43,530 | 44,400 | 3.4 | 0.36 | 1.7 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 6.3 |
| Furniture finishers | 51-7021 | 14,480 | 570 | 44,540 | 45,260 | -3.5 | -0.38 | 1.5 | High school diploma or equivalent; OJT: Short-term on-the-job training | 1.8 |
| Electric motor, power tool, and related repairers | 49-2092 | 14,450 | 390 | 56,210 | 48,440 | 4.4 | 0.43 | 1.4 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -12.8 |
| Furnace, kiln, oven, drier, and kettle operators and tenders | 51-9051 | 14,280 | 420 | 48,040 | 47,410 | 2.6 | 0.27 | 1.8 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -11.6 |
| Helpers--brickmasons, blockmasons, stonemasons, and tile and marble setters | 47-3011 | 14,170 | 240 | 47,550 | 45,540 | -11.7 | -1.2 | 1.1 | No formal educational credential; OJT: Short-term on-the-job training | -9.5 |
| Plant and system operators, all other | 51-8099 | 14,080 | 250 | 62,470 | 64,690 | 2.3 | 0.21 | 1.2 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -11.7 |
| Continuous mining machine operators | 47-5041 | 14,000 | 180 | 61,810 | 57,760 | 3.2 | 0.28 | 1.4 | No formal educational credential; OJT: Moderate-term on-the-job training | -2.4 |
| Heat treating equipment setters, operators, and tenders, metal and plastic | 51-4191 | 14,000 | 1,190 | 48,750 | 50,560 | -9.5 | -1.02 | 1.1 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -4.0 |
| Tailors, dressmakers, and custom sewers | 51-6052 | 13,920 | 280 | 41,640 | 37,500 | -8.8 | -0.91 | 3.7 | No formal educational credential; OJT: Moderate-term on-the-job training | -14.5 |
| Reinforcing iron and rebar workers | 47-2171 | 13,800 |  | 58,970 | 91,220 | -5.3 | -0.56 | 1 | High school diploma or equivalent; OJT: Apprenticeship | -2.4 |
| Carpet installers | 47-2041 | 13,780 | 470 | 50,340 | 48,790 | -16.4 | -1.81 | 0.7 | No formal educational credential; OJT: Short-term on-the-job training | -8.0 |
| Transportation workers, all other | 53-6099 | 13,550 | 220 | 45,650 | 37,190 | 4.0 | 0.43 | 1.6 | High school diploma or equivalent; OJT: Short-term on-the-job training | 23.6 |
| Textile, apparel, and furnishings workers, all other | 51-6099 | 13,530 | 540 | 37,280 | 31,270 | -13.4 | -1.44 | 0.9 | High school diploma or equivalent; OJT: Short-term on-the-job training | -6.4 |
| Motorcycle mechanics | 49-3052 | 13,510 | 310 | 48,580 | 40,100 | 2.1 | 0.21 | 1.4 | Postsecondary nondegree award; OJT: Short-term on-the-job training | -3.6 |
| Textile knitting and weaving machine setters, operators, and tenders | 51-6063 | 13,030 | 90 | 39,530 | 38,120 | -13.7 | -1.46 | 1.3 | High school diploma or equivalent; OJT: Short-term on-the-job training | -10.3 |
| Extruding and forming machine setters, operators, and tenders, synthetic and glass fibers | 51-6091 | 12,850 | 180 | 46,350 | 49,180 | -3.3 | -0.38 | 1.1 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -13.8 |
| Tapers | 47-2082 | 12,840 | 190 | 68,270 | 63,630 | -1.6 | -0.19 | 0.9 | No formal educational credential; OJT: Moderate-term on-the-job training | 2.7 |
| Coil winders, tapers, and finishers | 51-2021 | 12,840 | 110 | 48,220 | 47,350 | -4.0 | -0.39 | 1.2 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 5.5 |
| Foundry mold and coremakers | 51-4071 | 12,790 | 2,050 | 48,110 | 46,150 | -23.0 | -2.56 | 0.8 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 0.6 |
| Ambulance drivers and attendants, except emergency medical technicians | 53-3011 | 12,630 |  | 35,450 | 31,770 | -1.3 | -0.14 | 1.4 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 4.6 |
| Rotary drill operators, oil and gas | 47-5012 | 12,600 | 70 | 67,890 | 54,020 | 0.8 | 0.16 | 1.1 | No formal educational credential; OJT: Moderate-term on-the-job training | -3.7 |
| Milling and planing machine setters, operators, and tenders, metal and plastic | 51-4035 | 12,460 | 670 | 52,800 | 48,400 | -13.2 | -1.37 | 1 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -9.8 |
| Railroad brake, signal, and switch operators and locomotive firers | 53-4022 | 12,400 | 190 | 68,840 | 66,970 | 0.8 | 0.09 | 0.9 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -0.5 |
| Bicycle repairers | 49-3091 | 12,170 | 580 | 42,780 | 38,910 | -5.7 | -0.59 | 1.2 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -3.3 |
| Adhesive bonding machine operators and tenders | 51-9191 | 11,500 | 210 | 46,460 | 45,470 | 1.3 | 0.08 | 1.3 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -5.5 |
| Medical appliance technicians | 51-9082 | 11,280 | 480 | 48,030 | 49,140 | 3.5 | 0.35 | 1.3 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -1.8 |
| Hearing aid specialists | 29-2092 | 11,270 | 460 | 65,160 | 55,100 | 19.4 | 1.81 | 0.9 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 6.5 |
| Radio, cellular, and tower equipment installers and repairers | 49-2021 | 11,140 | 410 | 63,520 | 64,130 | 1.2 | 0.09 | 1 | Associate's degree; OJT: Moderate-term on-the-job training | -2.3 |
| Tank car, truck, and ship loaders | 53-7121 | 10,700 | 200 | 58,870 | 57,900 | 2.8 | 0.31 | 1.3 | No formal educational credential; OJT: Short-term on-the-job training | -2.0 |
| Derrick operators, oil and gas | 47-5011 | 10,590 | 40 | 58,620 | 45,180 | 1.6 | 0.19 | 0.9 | No formal educational credential; OJT: Short-term on-the-job training | -4.1 |
| Grinding and polishing workers, hand | 51-9022 | 10,510 | 650 | 42,660 | 44,430 | -19.2 | -2.14 | 0.7 | No formal educational credential; OJT: Moderate-term on-the-job training | -11.3 |
| Subway and streetcar operators | 53-4041 | 10,200 | 40 | 86,380 | 41,710 | 3.7 | 0.37 | 0.9 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 10.9 |
| Boilermakers | 47-2011 | 10,190 |  | 76,410 | 98,220 | -1.8 | -0.1 | 0.7 | High school diploma or equivalent; OJT: Apprenticeship | 0.2 |
| Wind turbine service technicians | 49-9081 | 9,980 | 70 | 64,120 | 62,800 | 29.5 | 2.63 | 1.5 | Postsecondary nondegree award; OJT: Long-term on-the-job training | -11.1 |
| Pump operators, except wellhead pumpers | 53-7072 | 9,780 | 40 | 61,770 | 69,540 | 4.3 | 0.4 | 1 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -22.4 |
| Aircraft cargo handling supervisors | 53-1041 | 9,760 | 90 | 58,170 | 47,850 | 9.2 | 0.89 | 0.9 | High school diploma or equivalent | -3.9 |
| Precision instrument and equipment repairers, all other | 49-9069 | 9,400 | 190 | 68,990 | 66,360 | 2.5 | 0.29 | 1 | High school diploma or equivalent; OJT: Long-term on-the-job training | -2.9 |
| Textile cutting machine setters, operators, and tenders | 51-6062 | 9,000 | 100 | 38,760 | 37,280 | -13.6 | -1.36 | 0.9 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 0.4 |
| Forging machine setters, operators, and tenders, metal and plastic | 51-4022 | 8,930 | 620 | 49,030 | 61,620 | -17.2 | -1.83 | 0.6 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 1.9 |
| Signal and track switch repairers | 49-9097 | 8,720 | 120 | 92,460 | 93,060 | 1.8 | 0.23 | 0.8 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 6.2 |
| Electronic equipment installers and repairers, motor vehicles | 49-2096 | 8,550 | 80 | 48,420 | 48,070 | -14.5 | -1.49 | 0.4 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -15.7 |
| Power distributors and dispatchers | 51-8012 | 8,520 | 450 | 106,730 | 116,780 | 1.2 | 0.12 | 0.7 | High school diploma or equivalent; OJT: Long-term on-the-job training | -7.2 |
| Ship engineers | 53-5031 | 8,400 | 100 | 109,530 | 79,170 | 2.7 | 0.22 | 0.9 | Postsecondary nondegree award | -2.1 |
| Painting, coating, and decorating workers | 51-9123 | 7,940 | 140 | 41,600 | 38,500 | 1.3 | 0.12 | 0.7 | No formal educational credential; OJT: Moderate-term on-the-job training | -6.3 |
| Traffic technicians | 53-6041 | 7,860 | 100 | 59,090 | 37,890 | 4.0 | 0.36 | 0.9 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 3.7 |
| Stonemasons | 47-2022 | 7,820 | 130 | 57,390 | 59,160 | -5.4 | -0.55 | 0.5 | High school diploma or equivalent; OJT: Apprenticeship | -10.6 |
| Etchers and engravers | 51-9194 | 7,750 | 390 | 43,310 | 43,180 | -0.7 | -0.11 | 0.8 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -7.6 |
| Helpers--painters, paperhangers, plasterers, and stucco masons | 47-3014 | 7,490 |  | 40,470 | 30,300 | 1.5 | 0.13 | 0.7 | No formal educational credential; OJT: Short-term on-the-job training | 3.7 |
| Shoe and leather workers and repairers | 51-6041 | 7,450 | 150 | 37,800 | 35,940 | -6.5 | -0.7 | 1 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -2.5 |
| Electrical and electronics installers and repairers, transportation equipment | 49-2093 | 6,940 | 130 | 84,890 | 69,510 | 5.4 | 0.45 | 0.5 | Postsecondary nondegree award; OJT: Moderate-term on-the-job training | -5.1 |
| Cooling and freezing equipment operators and tenders | 51-9193 | 6,900 | 290 | 41,330 | 31,700 | 5.9 | 0.51 | 0.8 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 4.7 |
| Helpers--extraction workers | 47-5081 | 6,700 |  | 47,730 |  | 1.7 | 0.14 | 0.7 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -0.3 |
| Cutters and trimmers, hand | 51-9031 | 6,060 | 50 | 38,020 | 46,830 | -18.9 | -2.04 | 0.5 | No formal educational credential; OJT: Short-term on-the-job training | -14.3 |
| Helpers--roofers | 47-3016 | 6,030 |  | 44,160 | 41,750 | -0.1 | 0.0 | 0.6 | No formal educational credential; OJT: Short-term on-the-job training | 16.6 |
| Layout workers, metal and plastic | 51-4192 | 5,970 | 160 | 63,870 | 61,550 | -3.4 | -0.49 | 0.5 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 6.4 |
| Loading and moving machine operators, underground mining | 47-5044 | 5,930 | 80 | 74,500 | 59,310 | -15.8 | -1.64 | 0.4 | No formal educational credential; OJT: Short-term on-the-job training | -3.3 |
| Tool grinders, filers, and sharpeners | 51-4194 | 5,600 | 260 | 50,060 | 43,470 | -6.8 | -0.71 | 0.5 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -2.3 |
| Extraction workers, all other | 47-5099 | 5,540 |  | 57,010 |  | 3.4 | 0.33 | 0.6 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -8.7 |
| Woodworkers, all other | 51-7099 | 5,490 | 120 | 44,530 | 44,450 | -2.3 | -0.2 | 1.7 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -16.7 |
| Musical instrument repairers and tuners | 49-9063 | 5,380 | 210 | 46,420 | 59,570 | 1.9 | 0.17 | 0.6 | High school diploma or equivalent; OJT: Apprenticeship | -6.1 |
| Textile bleaching and dyeing machine operators and tenders | 51-6061 | 5,310 | 60 | 38,180 | 44,720 | -12.5 | -1.3 | 0.6 | High school diploma or equivalent; OJT: Short-term on-the-job training | -8.8 |
| Nuclear power reactor operators | 51-8011 | 5,150 |  | 122,890 |  | -5.9 | -0.59 | 0.4 | High school diploma or equivalent; OJT: Long-term on-the-job training | -10.0 |
| Explosives workers, ordnance handling experts, and blasters | 47-5032 | 5,100 |  | 61,390 |  | 0.0 | 0.0 | 0.4 | High school diploma or equivalent; OJT: Long-term on-the-job training | -10.2 |
| Photographic process workers and processing machine operators | 51-9151 | 4,800 | 150 | 40,610 | 38,610 | -5.6 | -0.58 | 0.6 | High school diploma or equivalent; OJT: Short-term on-the-job training | -13.5 |
| Drilling and boring machine tool setters, operators, and tenders, metal and plastic | 51-4032 | 4,680 | 190 | 49,080 | 60,410 | -9.5 | -1.12 | 0.4 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -11.9 |
| Pourers and casters, metal | 51-4052 | 4,560 | 360 | 51,810 | 60,280 | -5.0 | -0.67 | 0.4 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -21.8 |
| Rail yard engineers, dinkey operators, and hostlers | 53-4013 | 3,920 |  | 60,600 |  | 0.8 | 0.28 | 0.3 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 18.8 |
| Embalmers | 39-4011 | 3,890 |  | 58,780 |  | 0.7 | 0.25 | 0.7 | Associate's degree; OJT: Long-term on-the-job training | 13.7 |
| Floor sanders and finishers | 47-2043 | 3,720 |  | 50,440 | 51,400 | 1.4 | 0.0 | 0.3 | No formal educational credential; OJT: Moderate-term on-the-job training | -10.1 |
| Gas compressor and gas pumping station operators | 53-7071 | 3,510 | 40 | 77,320 | 78,240 | 2.1 | 0.28 | 0.3 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -31.3 |
| Commercial divers | 49-9092 | 3,450 | 80 | 72,990 | 54,620 | 4.8 | 0.49 | 0.4 | Postsecondary nondegree award; OJT: Moderate-term on-the-job training | 0.6 |
| Rock splitters, quarry | 47-5051 | 3,320 |  | 48,740 |  | 5.8 | 0.56 | 0.4 | No formal educational credential; OJT: Short-term on-the-job training | 7.8 |
| Shoe machine operators and tenders | 51-6042 | 3,280 |  | 35,650 |  | -6.9 | -0.91 | 0.4 | High school diploma or equivalent; OJT: Short-term on-the-job training | 0.3 |
| Underground mining machine operators, all other | 47-5049 | 3,180 |  | 70,130 |  | -1.0 | -0.32 | 0.3 | No formal educational credential; OJT: Moderate-term on-the-job training | -8.6 |
| Bridge and lock tenders | 53-6011 | 3,040 | 130 | 57,700 | 50,540 | -2.3 | 0.0 | 0.3 | High school diploma or equivalent; OJT: Short-term on-the-job training | 11.8 |
| Manufactured building and mobile home installers | 49-9095 | 3,020 |  | 45,990 |  | 5.8 | 0.56 | 0.3 | High school diploma or equivalent; OJT: Short-term on-the-job training | 15.7 |
| Fabric and apparel patternmakers | 51-6092 | 2,950 |  | 62,750 |  | -15.0 | -1.42 | 0.2 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 3.1 |
| Model makers, metal and plastic | 51-4061 | 2,610 | 710 | 63,340 | 60,540 | -17.3 | -1.66 | 0.2 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -19.2 |
| Hoist and winch operators | 53-7041 | 2,600 | 50 | 56,450 | 40,070 | 0.2 | 0.0 | 0.3 | No formal educational credential; OJT: Short-term on-the-job training | 4.8 |
| Motorboat operators | 53-5022 | 2,480 |  | 47,520 | 46,760 | 4.9 | 0.35 | 0.3 | Postsecondary nondegree award | 4.2 |
| Pile driver operators | 47-2072 | 2,310 |  | 73,300 |  | -5.7 | -0.44 | 0.2 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -24.0 |
| Sewers, hand | 51-6051 | 2,190 |  | 36,480 |  | -12.0 | -1.41 | 0.6 | No formal educational credential; OJT: Moderate-term on-the-job training | -2.2 |
| Roof bolters, mining | 47-5043 | 2,160 |  | 78,540 |  | -18.9 | -1.99 | 0.1 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -3.1 |
| Camera and photographic equipment repairers | 49-9061 | 1,650 |  | 52,720 |  | -15.5 | -1.81 | 0.1 | High school diploma or equivalent; OJT: Long-term on-the-job training | -17.9 |
| Paperhangers | 47-2142 | 1,570 |  | 52,140 |  | 4.3 | 0.43 | 0.2 | No formal educational credential; OJT: Long-term on-the-job training | 3.3 |
| Patternmakers, metal and plastic | 51-4062 | 1,470 | 250 | 58,000 | 53,780 | -22.8 | -3.05 | 0.1 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -6.4 |
| Watch and clock repairers | 49-9064 | 1,310 |  | 67,230 |  | -0.3 | 0.0 | 0.1 | High school diploma or equivalent; OJT: Long-term on-the-job training | 0.8 |
| Terrazzo workers and finishers | 47-2053 | 1,180 |  | 76,170 | 72,450 | -13.0 | -1.81 | 0.1 | High school diploma or equivalent; OJT: Apprenticeship | -18.6 |
| Rail transportation workers, all other | 53-4099 | 1,120 |  | 56,360 |  | 4.4 | 0.87 | 0.1 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -26.3 |
| Refractory materials repairers, except brickmasons | 49-9045 | 1,080 |  | 61,290 |  | -13.7 | -1.99 | 0.1 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -1.8 |
| Dredge operators | 53-7031 | 1,040 |  | 49,640 |  | 0.7 | 0.0 | 0.1 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 1.0 |
| Model makers, wood | 51-7031 | 280 |  | 56,550 |  | -3.3 | 0.0 | 0.1 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | -22.2 |
| Timing device assemblers and adjusters | 51-2061 | 250 |  | 62,620 |  | -6.1 | 0.0 | 0 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 8.7 |
| Patternmakers, wood | 51-7032 | 220 |  | 49,630 |  | -2.0 | 0.0 | 0.1 | High school diploma or equivalent; OJT: Moderate-term on-the-job training | 22.2 |
