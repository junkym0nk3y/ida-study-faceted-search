import filterProjects from '../../components/filter/FilterProjects';

export default ({ $axios }) => {
    const MockAdapter = require('axios-mock-adapter');
    const mock = new MockAdapter($axios);

    const projects = [
        {
            id: 0,
            name: 'ЖК Ипотечная',
            slug: 'ZHK Ipotechnaya',
            address: 'Санкт-Петербург, Улица Ипотечная',
            complete_date: 'Сдан',
            min_price: 1000000,
            property: [
                { price: 1000000, type: 'storage', complete: true, zone: 'spb' },
                { price: 1000000, type: 'parking', complete: true, zone: 'spb' },
                { price: 1000000, type: 'flat', complete: true, zone: 'spb' },
                { price: 1000000, type: 'flat', complete: true, zone: 'spb' },
                { price: 1200000, type: 'flat', complete: true, zone: 'spb' },
                { price: 7400000, type: 'flat', complete: true, zone: 'spb' },
                { price: 18000000, type: 'flat', complete: true, zone: 'spb' },
                { price: 34000000, type: 'flat', complete: true, zone: 'spb' },
                { price: 43000000, type: 'flat', complete: true, zone: 'spb' },
            ],
        },

        {
            id: 1,
            name: 'ЖК Престиж',
            slug: 'ZHK Prestige',
            address: 'г. Москва, Крассная Площадь',
            complete_date: '3 кв. 2023',
            min_price: 990000,
            property: [
                { price: 990000, type: 'flat', complete: false, zone: 'moscow' },
                { price: 1000000, type: 'flat', complete: false, zone: 'moscow' },
                { price: 1200000, type: 'flat', complete: false, zone: 'moscow' },
                { price: 7400000, type: 'flat', complete: false, zone: 'moscow' },
                { price: 8200000, type: 'flat', complete: false, zone: 'moscow' },
                { price: 9300000, type: 'flat', complete: false, zone: 'moscow' },
                { price: 13000000, type: 'flat', complete: false, zone: 'moscow' },
            ],
        },
    ];

    const handleSpecs = (array) => {
        const prices = [];
        const types = [];
        const complete = [];
        const zones = [];

        const zoneTypes = {
            'moscow': 'Москва',
            'spb': 'Санкт-Петербург',
            'krasnodar': 'Краснодар',
        };
        const propertyTypes = {
            'flat': 'Квартиру',
            'parking': 'Паркинг',
            'storage': 'Кладовую',
        };
        const completeTypes = {
            true: 'Сдан',
            false: 'Не сдан',
        };

        array.forEach(i => {
            const projectPrices = i.property.map(i => i.price);
            prices.push(Math.max(...projectPrices));
            prices.push(Math.min(...projectPrices));

            const projectTypes = i.property.map(i => i.type);
            types.push(...new Set(projectTypes));

            const projectCompleted = i.property.map(i => i.complete);
            complete.push(...new Set(projectCompleted));

            const projectZones = i.property.map(i => i.zone);
            zones.push(...new Set(projectZones));
        });

        const typeChoices = [...new Set(types)].map(elem => {
            return {
                label: propertyTypes[elem],
                value: elem,
            };
        });

        const zoneChoices = [...new Set(zones)].map(elem => {
            return {
                label: zoneTypes[elem],
                value: elem,
            };
        });

        const completeChoices = [...new Set(complete)].map(elem => {
            return {
                label: completeTypes[elem],
                value: elem,
            };
        });

        return [
            {
                name: 'zone',
                choices: zoneChoices,
            },
            {
                name: 'propertyType',
                choices: typeChoices,
            },
            {
                name: 'complete',
                choices: completeChoices,
            },
            {
                name: 'price',
                range: {
                    min: Math.min(...prices),
                    max: Math.max(...prices),
                },
            },
        ];
    };

    const handleFilters = (array, params) => {
        const filterProjects = [];

        array.forEach(i => {
            const filteredProperty = i.property.filter(p => {
                const checks = [];

                for (const [key, value] of Object.entries(params)) {
                    switch (key) {
                        case 'price_min':
                            checks.push(p[key] <= value);
                            break;
                        case 'price_max':
                            checks.push(p[key] >= value);
                            break;
                        default:
                            checks.push(p[key] !== value);
                    }
                }

                return !checks.includes(false);
            });

            if (filteredProperty.length) {
                filterProjects.push({
                        ...i,
                        ...{ property: filteredProperty },
                    },
                );
            }
        });

        return filterProjects;
    };

    mock.onGet('/api/projects/')
        .reply(function(config) {
            return [202, config?.params ? handleFilters(projects, config.params) : projects];
        });

    mock.onGet('/api/projects/facets/')
        .reply(function(config) {
            const filtered = config?.params ? handleFilters(projects, config.params) : projects;
            return [202, handleSpecs(filtered)];
        });

    mock.onGet('/api/projects/specs/')
        .reply(function(config) {
            const filtered = config?.params ? handleFilters(projects, config.params) : projects;
            return [202, handleSpecs(filtered)];
        });
};
