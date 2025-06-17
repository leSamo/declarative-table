import data from './mockData.json';

const fetchData = ({ limit, offset, sort, commonName, count }) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const start = offset || 0;
            const end = limit ? start + limit : undefined;

            let filteredData = [...data];

            if (commonName) {
                filteredData = filteredData.filter(item =>
                    item.common_name &&
                    item.common_name.toLowerCase().includes(commonName.trim().toLowerCase())
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
                    else {
                        return true;
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
            }

            resolve({
                data: filteredData.slice(start, end),
                meta: {
                    limit,
                    offset,
                    sort,
                    commonName,
                    count,
                    total_items: filteredData.length
                }
            });
        }, 200);
    });
};

export default fetchData;
