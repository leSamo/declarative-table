import data from './mockData.json';

const fetchData = ({ limit, offset, sort, common_name, scientific_name, primary_type, most_prevalent_country, count, average_lifespan }) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const start = offset || 0;
            const end = limit ? start + limit : undefined;

            let filteredData = [...data];

            if (common_name) {
                filteredData = filteredData.filter(item =>
                    item.common_name.toLowerCase().includes(common_name.trim().toLowerCase())
                );
            }

            if (scientific_name) {
                const selected = scientific_name.split(',').map(item => item.toLowerCase());

                filteredData = filteredData.filter(item =>
                    selected.includes(item.scientific_name.toLowerCase())
                );
            }

            if (primary_type) {
                const selected = primary_type.split(',');

                filteredData = filteredData.filter(item =>
                    selected.includes(item.primary_type.toLowerCase())
                );
            }

            if (most_prevalent_country) {
                const selected = most_prevalent_country.split(',');

                filteredData = filteredData.filter(item =>
                    selected.includes(item.most_prevalent_country.toLowerCase().replace(' ', '_'))
                );
            }

            if (count) {
                filteredData = filteredData.filter(item => {
                    if (count === 'zero') {
                        return item.count === 0;
                    }
                    else if (count === 'non-zero') {
                        return item.count > 0;
                    }
                    else if (count === 'all') {
                        return true;
                    }
                    else {
                        resolve({
                            error: { status: 400, message: `Invalid count filter: ${count}` },
                            data: [],
                            meta: {}
                        });
                    }
                });
            }

            if (average_lifespan) {
                const [min, max] = average_lifespan.split(',').map(Number);

                filteredData = filteredData.filter(item => item.average_lifespan_years >= min && item.average_lifespan_years <= max);
            }

            if (sort) {
                let direction = 1;
                let field = sort;

                if (sort.startsWith('-')) {
                    direction = -1;
                    field = sort.slice(1);
                }

                const validFields = ["common_name", "scientific_name", "primary_type", "most_prevalent_county", "count", "average_lifespan_years"];

                if (validFields.includes(field)) {
                    filteredData.sort((a, b) => {
                        if (a[field] < b[field]) return -1 * direction;
                        if (a[field] > b[field]) return 1 * direction;
                        return 0;
                    });
                }
                else {
                    resolve({
                        error: { status: 400, message: `Invalid sort field: ${field}` },
                        data: [],
                        meta: {}
                    });
                }
            }

            resolve({
                data: filteredData.slice(start, end),
                meta: {
                    limit,
                    offset,
                    sort,
                    common_name,
                    scientific_name,
                    primary_type,
                    most_prevalent_country,
                    count,
                    average_lifespan,
                    total_items: filteredData.length
                }
            });
        }, 200);
    });
};

export const fetchScientificNames = (filter = "") => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(
                data
                    .map(item => item.scientific_name)
                    .filter(name => name.toLowerCase().includes(filter.trim().toLowerCase()))
            )
        }, 200);
    });
};

export const fetchMostPrevalent = () => {
    const grouped = {};

    data.forEach(item => {
        const continent = item.most_prevalent_continent;
        const country = item.most_prevalent_country;

        const continentId = continent.toLowerCase().replace(' ', '_');
        const countryId = country.toLowerCase().replace(' ', '_');

        if (!grouped[continentId]) {
            grouped[continentId] = {
                id: continentId,
                value: continentId,
                name: continent,
                type: 'treeView',
                groupSelectable: true,
                children: []
            };
        }

        const continentGroup = grouped[continentId];

        if (!continentGroup.children.some(child => child.id === countryId)) {
            continentGroup.children.push({
                id: countryId,
                value: countryId,
                name: country,
                type: 'treeView'
            });
        }
    });

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(
                Object.values(grouped)
            )
        }, 200);
    });
};

export default fetchData;
