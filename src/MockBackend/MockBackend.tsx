import importedData from './mockData.json';

export type ResponseDataRow = {
    common_name: string,
    scientific_name: string,
    primary_type: string,
    count: number,
    most_prevalent_country: string,
    most_prevalent_continent: string,
    average_lifespan_years: number
};

export type ResponseMeta = Request & {
    total_items: number
};

export type ResponseError = {
    status: number,
    message: string
};

export type Response = {
    data: ResponseDataRow[],
    meta: ResponseMeta,
    error?: ResponseError,
};

interface Request {
    limit: number,
    offset: number,
    sort?: string,
    common_name?: string,
    scientific_name?: string,
    primary_type?: string,
    most_prevalent_country?: string,
    count?: string,
    average_lifespan?: string,
};

const validSortFields = ["common_name", "scientific_name", "primary_type", "count", "most_prevalent_country", "most_prevalent_continent", "average_lifespan_years"] as const;
type ValidSortField = typeof validSortFields[number];

const data: ResponseDataRow[] = importedData;

const fetchData = ({ limit, offset, sort, common_name, scientific_name, primary_type, most_prevalent_country, count, average_lifespan }: Request): Promise<Response> => {
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
                            meta: {
                                limit,
                                offset,
                                total_items: 0
                            }
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

                if (validSortFields.includes(field as ValidSortField)) {
                    filteredData.sort((a, b) => {
                        if (a[field as ValidSortField] < b[field as ValidSortField]) return -1 * direction;
                        if (a[field as ValidSortField] > b[field as ValidSortField]) return 1 * direction;
                        return 0;
                    });
                }
                else {
                    resolve({
                        error: { status: 400, message: `Invalid sort field: ${field}` },
                        data: [],
                        meta: {
                            limit,
                            offset,
                            total_items: 0
                        }
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

export type TreeNode = {
  id: string;
  value: string;
  name: string;
  type: 'treeView';
  groupSelectable?: boolean;
  children?: TreeNode[];
};

export const fetchMostPrevalent = () => {
    const grouped: Record<string, TreeNode> = {};

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

        if (!continentGroup.children?.some(child => child.id === countryId)) {
            continentGroup.children?.push({
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
