import data from './mockData.json';

const fetchData = ({ limit, offset, sort, common_name, scientific_name, primary_type, count }) => {
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

            if (sort) {
                let direction = 1;
                let field = sort;

                if (sort.startsWith('-')) {
                    direction = -1;
                    field = sort.slice(1);
                }

                const validFields = ["common_name", "scientific_name", "primary_type", "count"];

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
                    count,
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

export default fetchData;
