import { Industries, Resources } from "../Constants";
import FactoryPattern from "../FactoryPattern";

export const STATIC_DATA_RAW_CITY = `
anonymous_1	industry
anonymous_2	industry
belper	industry
berby	industry
birmingham	industry
burton_upon_trent	industry
cannock	industry
coalbrookdale	industry
coventry	industry
dudley	industry
gloucester	merchant
kidderminster	industry
leek	industry
nottingham	merchant
nuneaton	industry
oxford	merchant
redditch	industry
shrewsbury	merchant
stafford	industry
stoke_on_trent	industry
stone	industry
tamworth	industry
uttoxeter	industry
walsall	industry
warrington	merchant
wolverhampton	industry
worcester	industry
`;

export const STATIC_DATA_RAW_LINKS = `
1	anonymous_1	cannock	1439	1704	canal,rail
2	belper	derby	2994	602	canal,rail
3	belper	leek	2515	251	rail
4	birmingham	coventry	2816	2868	canal,rail
5	birmingham	dudley	2012	2681	canal,rail
6	birmingham	nuneaton	2792	2556	rail
7	birmingham	oxford	2808	3054	canal,rail
8	birmingham	redditch	2396	3046	rail
9	birmingham	tamworth	2718	2331	canal,rail
10	birmingham	walsall	2154	2511	canal,rail
11	birmingham	worcester	1884	3113	canal,rail
12	burton_on_trent	cannock	2267	1533	rail
13	burton_on_trent	derby	2974	1281	canal,rail
14	burton_on_trent	stone	1940	1149	canal,rail
15	burton_on_trent	tamworth	2735	1757	canal,rail
16	burton_on_trent	walsall	2297	1859	canal
17	cannock	stafford	1838	1533	canal,rail
18	cannock	walsall	2102	1994	canal,rail
19	cannock	wolverhampton	1520	1902	canal,rail
20	coalbrookdale	kidderminster	942	2742	canal,rail
21	coalbrookdale	shrewsbury	600	2129	canal,rail
22	coalbrookdale	wolverhampton	1097	2129	canal,rail
23	coventry	nuneaton	3388	2589	rail
24	derby	nottingham	3211	801	canal,rail
25	derby	uttoxeter	2591	984	rail
26	dudley	kidderminster	1347	2819	canal,rail
27	dudley	wolverhampton	1428	2421	canal,rail
28	gloucester	redditch	1956	3417	canal,rail
29	gloucester	worcester	1700	3679	canal,rail
30	kidderminster	worcester	1300	3330	canal,rail
31	leek	stoke_on_trent	1825	299	canal,rail
32	nuneaton	tamworth	3065	2082	canal,rail
33	oxford	redditch	2592	3309	canal,rail
34	stafford	stone	1187	1296	canal,rail
35	stoke_on_trent	stone	1399	814	canal,rail
36	stoke_on_trent	warrington	1351	364	canal,rail
37	stone	uttoxeter	1681	933	rail
38	tamworth	walsall	2453	2178	rail
39	walsall	wolverhampton	1748	2157	canal,rail
`;

export const STATIC_DATA_RAW_CITY_SLOT = `
1	berby	industry	0	2867	942
2	berby	industry	1	3054	942
3	berby	industry	2	2960	754
4	birmingham	industry	0	2338	2717
5	birmingham	industry	1	2524	2717
6	birmingham	industry	2	2338	2529
7	birmingham	industry	3	2524	2529
8	stone	industry	0	1053	918
9	stone	industry	1	1238	918
10	walsall	industry	0	1947	2163
11	walsall	industry	1	2132	2163
12	burton_upon_trent	industry	0	2556	1410
13	burton_upon_trent	industry	1	2742	1410
14	wolverhampton	industry	0	1302	2071
15	wolverhampton	industry	1	1486	2071
16	stafford	industry	0	1425	1293
17	stafford	industry	1	1613	1293
18	cannock	industry	0	1722	1703
19	cannock	industry	1	1906	1703
20	tamworth	industry	0	2616	1911
21	tamworth	industry	1	2797	1911
22	stoke_on_trent	industry	0	1470	495
23	stoke_on_trent	industry	1	1658	495
24	stoke_on_trent	industry	2	1564	309
25	coventry	industry	0	3067	2843
26	coventry	industry	1	3254	2843
27	coventry	industry	2	3160	2655
28	dudley	industry	0	1487	2562
29	dudley	industry	1	1672	2562
30	uttoxeter	industry	0	2083	849
31	uttoxeter	industry	1	2272	849
32	coalbrookdale	industry	0	750	2247
33	coalbrookdale	industry	1	936	2247
34	coalbrookdale	industry	2	843	2059
35	kidderminster	industry	0	1208	2975
36	kidderminster	industry	1	1394	2975
37	worcester	industry	0	1260	3494
38	worcester	industry	1	1448	3494
39	leek	industry	0	2034	205
40	leek	industry	1	2221	205
41	belper	industry	0	2739	264
42	belper	industry	1	2926	264
43	belper	industry	2	3112	264
44	redditch	industry	0	2150	3189
45	redditch	industry	1	2339	3189
46	nuneaton	industry	0	2976	2315
47	nuneaton	industry	1	3164	2315
48	anonymous_1	industry	0	1108	1653
49	anonymous_2	industry	0	952	3275
50	warrington	merchant	0	933	426
51	warrington	merchant	1	1122	426
52	nottingham	merchant	0	3437	680
53	nottingham	merchant	1	3625	680
54	oxford	merchant	0	3127	3328
55	oxford	merchant	1	3314	3328
56	gloucester	merchant	0	2238	3632
57	gloucester	merchant	1	2422	3632
58	shrewsbury	merchant	0	269	2268
`;

const { IRON, COAL, COIN, FACTORY_GOAL, INCOME_POINT, NETWORK_GOAL } = Resources;

export const FACTORY_PATTERNS: Array<FactoryPattern> = [
    //#region coal mine
    new FactoryPattern(1, Industries.COAL_MINE, 1, 
        [
            [COIN, 5],
        ], [
            [FACTORY_GOAL, 1], 
            [INCOME_POINT, 4], 
            [NETWORK_GOAL, 2],
        ],
    ),
    new FactoryPattern(2, Industries.COAL_MINE, 2, 
        [
            [COIN, 7],
        ], [
            [FACTORY_GOAL, 2], 
            [INCOME_POINT, 7], 
            [NETWORK_GOAL, 1],
        ],
    ),
    new FactoryPattern(3, Industries.COAL_MINE, 3, 
        [
            [COIN, 8],
            [IRON, 1],
        ], [
            [FACTORY_GOAL, 3], 
            [INCOME_POINT, 6], 
            [NETWORK_GOAL, 1],
        ],
    ),
    new FactoryPattern(4, Industries.COAL_MINE, 4, 
        [
            [COIN, 10],
            [IRON, 1],
        ], [
            [FACTORY_GOAL, 4], 
            [INCOME_POINT, 5], 
            [NETWORK_GOAL, 1],
        ],
    ),
    //#endregion
    //#region iron works
    new FactoryPattern(5, Industries.IRON_WORKS, 1, 
        [
            [COIN, 5],
            [COAL, 1],
        ], [
            [FACTORY_GOAL, 3], 
            [INCOME_POINT, 3], 
            [NETWORK_GOAL, 1],
        ],
    ),
    new FactoryPattern(6, Industries.IRON_WORKS, 2, 
        [
            [COIN, 7],
            [COAL, 1],
        ], [
            [FACTORY_GOAL, 5], 
            [INCOME_POINT, 3], 
            [NETWORK_GOAL, 1],
        ],
    ),
    new FactoryPattern(7, Industries.IRON_WORKS, 3, 
        [
            [COIN, 9],
            [COAL, 1],
        ], [
            [FACTORY_GOAL, 7], 
            [INCOME_POINT, 2], 
            [NETWORK_GOAL, 1],
        ],
    ),
    new FactoryPattern(8, Industries.IRON_WORKS, 4, 
        [
            [COIN, 12],
            [COAL, 1],
        ], [
            [FACTORY_GOAL, 9], 
            [INCOME_POINT, 1], 
            [NETWORK_GOAL, 1],
        ],
    ),
    //#endregion
    //#region cottom mill
    new FactoryPattern(9, Industries.COTTON_MILL, 1, 
        [
            [COIN, 5],
        ], [
            [FACTORY_GOAL, 5], 
            [INCOME_POINT, 5], 
            [NETWORK_GOAL, 1],
        ],
    ),
    new FactoryPattern(10, Industries.COTTON_MILL, 2, 
        [
            [COIN, 7],
            [COAL, 1],
        ], [
            [FACTORY_GOAL, 5], 
            [INCOME_POINT, 4], 
            [NETWORK_GOAL, 2],
        ],
    ),
    new FactoryPattern(11, Industries.COTTON_MILL, 3, 
        [
            [COIN, 9],
            [COAL, 1],
            [IRON, 1],
        ], [
            [FACTORY_GOAL, 9], 
            [INCOME_POINT, 3], 
            [NETWORK_GOAL, 1],
        ],
    ),
    new FactoryPattern(12, Industries.COTTON_MILL, 4, 
        [
            [COIN, 12],
            [COAL, 1],
            [IRON, 1],
        ], [
            [FACTORY_GOAL, 12], 
            [INCOME_POINT, 2], 
            [NETWORK_GOAL, 1],
        ],
    ),
    //#endregion
    //#region pottery
    new FactoryPattern(13, Industries.POTTERY, 1, 
        [
            [COIN, 17],
            [IRON, 1],
        ], [
            [FACTORY_GOAL, 10], 
            [INCOME_POINT, 5], 
            [NETWORK_GOAL, 1],
        ],
    ),
    new FactoryPattern(14, Industries.POTTERY, 2, 
        [
            [COIN, 0],
            [COAL, 1],
        ], [
            [FACTORY_GOAL, 1], 
            [INCOME_POINT, 1], 
            [NETWORK_GOAL, 1],
        ],
    ),
    new FactoryPattern(15, Industries.POTTERY, 3, 
        [
            [COIN, 22],
            [COAL, 2],
        ], [
            [FACTORY_GOAL, 11], 
            [INCOME_POINT, 5], 
            [NETWORK_GOAL, 1],
        ],
    ),
    new FactoryPattern(16, Industries.POTTERY, 4, 
        [
            [COIN, 0],
            [COAL, 1],
        ], [
            [FACTORY_GOAL, 1], 
            [INCOME_POINT, 1], 
            [NETWORK_GOAL, 1],
        ],
    ),
    new FactoryPattern(17, Industries.POTTERY, 5, 
        [
            [COIN, 24],
            [COAL, 2],
        ], [
            [FACTORY_GOAL, 20], 
            [INCOME_POINT, 5], 
            [NETWORK_GOAL, 1],
        ],
    ),
    //#endregion
    //#region brewery
    new FactoryPattern(18, Industries.BREWERY, 1, 
        [
            [COIN, 5],
            [IRON, 1],
        ], [
            [FACTORY_GOAL, 4], 
            [INCOME_POINT, 4], 
            [NETWORK_GOAL, 2],
        ],
    ),
    new FactoryPattern(19, Industries.BREWERY, 2, 
        [
            [COIN, 7],
            [IRON, 1],
        ], [
            [FACTORY_GOAL, 5], 
            [INCOME_POINT, 5], 
            [NETWORK_GOAL, 2],
        ],
    ),
    new FactoryPattern(20, Industries.BREWERY, 3, 
        [
            [COIN, 9],
            [IRON, 1],
        ], [
            [FACTORY_GOAL, 7], 
            [INCOME_POINT, 5], 
            [NETWORK_GOAL, 2],
        ],
    ),
    new FactoryPattern(21, Industries.BREWERY, 4, 
        [
            [COIN, 9],
            [IRON, 1],
        ], [
            [FACTORY_GOAL, 10], 
            [INCOME_POINT, 5], 
            [NETWORK_GOAL, 2],
        ],
    ),
    //#endregion
    //#region manufacturer
    new FactoryPattern(22, Industries.MANUFACTURER, 1, 
        [
            [COIN, 8],
            [COAL, 1],
        ], [
            [FACTORY_GOAL, 3], 
            [INCOME_POINT, 5], 
            [NETWORK_GOAL, 2],
        ],
    ),
    new FactoryPattern(23, Industries.MANUFACTURER, 2, 
        [
            [COIN, 10],
            [IRON, 1],
        ], [
            [FACTORY_GOAL, 5], 
            [INCOME_POINT, 1], 
            [NETWORK_GOAL, 1],
        ],
    ),
    new FactoryPattern(24, Industries.MANUFACTURER, 3, 
        [
            [COIN, 12],
            [COAL, 2],
        ], [
            [FACTORY_GOAL, 4], 
            [INCOME_POINT, 4], 
        ],
    ),
    new FactoryPattern(25, Industries.MANUFACTURER, 4, 
        [
            [COIN, 8],
            [IRON, 1],
        ], [
            [FACTORY_GOAL, 3], 
            [INCOME_POINT, 6], 
            [NETWORK_GOAL, 1],
        ],
    ),
    new FactoryPattern(26, Industries.MANUFACTURER, 5, 
        [
            [COIN, 16],
            [COAL, 1],
        ], [
            [FACTORY_GOAL, 8], 
            [INCOME_POINT, 2], 
            [NETWORK_GOAL, 2],
        ],
    ),
    new FactoryPattern(27, Industries.MANUFACTURER, 6, 
        [
            [COIN, 20],
        ], [
            [FACTORY_GOAL, 7], 
            [INCOME_POINT, 6], 
            [NETWORK_GOAL, 1],
        ],
    ),
    new FactoryPattern(28, Industries.MANUFACTURER, 7, 
        [
            [COIN, 16],
            [COAL, 1],
            [IRON, 1],
        ], [
            [FACTORY_GOAL, 9], 
            [INCOME_POINT, 4], 
        ],
    ),
    new FactoryPattern(29, Industries.MANUFACTURER, 8, 
        [
            [COIN, 20],
            [IRON, 2],
        ], [
            [FACTORY_GOAL, 11], 
            [INCOME_POINT, 1], 
            [NETWORK_GOAL, 1],
        ],
    ),
    //#endregion
];