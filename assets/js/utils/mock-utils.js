export const handleSpecs = (array, specs = false) => {
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

    let typeChoices = [];
    let zoneChoices = [];
    let completeChoices = [];

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

    if (specs) {
        typeChoices = [...new Set(types)].map(elem => {
            return {
                label: propertyTypes[elem],
                value: elem,
            };
        });

        zoneChoices = [...new Set(zones)].map(elem => {
            return {
                label: zoneTypes[elem],
                value: elem,
            };
        });

        completeChoices = [...new Set(complete)].map(elem => {
            return {
                label: completeTypes[elem],
                value: elem,
            };
        });
    } else {
        typeChoices = [...new Set(types)];
        zoneChoices = [...new Set(zones)];
        completeChoices = [...new Set(complete)];
    }

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

export const handleFilters = (array, params) => {
    const filterProjects = [];

    array.forEach(i => {
        const filteredProperty = i.property.filter(p => {
            const checks = [];

            for (const [key, value] of Object.entries(params)) {
                if (!value) {
                    continue;
                }

                switch (key) {
                    case 'price_min':
                        checks.push(Number(p.price) <= Number(value));
                        break;
                    case 'price_max':
                        checks.push(Number(p.price) >= Number(value));
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
