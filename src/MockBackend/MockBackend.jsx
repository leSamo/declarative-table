import data from './mockData.json';

const fetchData = ({ limit, offset, sort, filter }) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const start = offset || 0;
            const end = limit ? start + limit : undefined;

            let filteredData = [...data];

            if (filter) {
                filteredData = filteredData.filter(item =>
                    item.common_name &&
                    item.common_name.toLowerCase().includes(filter.toLowerCase())
                );
            }

            if (sort) {
                let direction = 1;
                let field = sort;

                if (sort.startsWith('-')) {
                    direction = -1;
                    field = sort.slice(1);
                }

                const validFields = ["common_name", "scientific_genus", "primary_type"];
                if (validFields.includes(field)) {
                    filteredData.sort((a, b) => {
                        if (a[field] < b[field]) return -1 * direction;
                        if (a[field] > b[field]) return 1 * direction;
                        return 0;
                    });
                }
            }

            resolve({
                data: filteredData.slice(start, end),
                meta: {
                    limit,
                    offset,
                    sort,
                    filter,
                    total_items: filteredData.length
                }
            });
        }, 200);
    });
};

export default fetchData;
