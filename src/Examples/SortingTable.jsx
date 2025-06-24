import { useState } from "react";
import DeclarativeTable from "../DeclarativeTable/DeclarativeTable";
import { useQuery } from '@tanstack/react-query';
import fetchData from "../MockBackend/MockBackend";

const SortingTable = () => {
    const [params, setParams] = useState({
        limit: 10,
        offset: 0,
        sort: '-count'
    });

    const apply = (newParams, replaceState) => {
        setParams(prevParams => ({
            offset: 0,
            ...replaceState ? { limit: prevParams.limit } : prevParams,
            ...newParams
        }));
    }

    const { data: { data, meta }, isFetching } = useQuery({
        queryKey: ['SortingTable', params],
        queryFn: () => fetchData(params),
        initialData: { data: [], meta: params }
    });

    const TABLE_COLUMNS = [
        {
            title: 'Common Name',
            sortParam: 'common_name',
            sortDefaultDirection: 'asc',
            key: 'common_name',
        },
        {
            title: 'Scientific Name (Genus)',
            sortParam: 'scientific_name',
            sortDefaultDirection: 'asc',
            key: 'scientific_name',
        },
        {
            title: 'Primary Type',
            sortParam: 'primary_type',
            sortDefaultDirection: 'asc',
            key: 'primary_type',
        },
        {
            title: 'Count',
            sortParam: 'count',
            key: 'count'
        }
    ];

    const TABLE_DATA_MAPPER = (row) => ({
        cells: [
            row.common_name,
            row.scientific_name,
            row.primary_type,
            row.count,
        ],
        key: row.common_name
    });


    return (
        <DeclarativeTable
            isLoading={isFetching}
            rows={data.map(row => TABLE_DATA_MAPPER(row))}
            columns={TABLE_COLUMNS}
            meta={{
                offset: meta.offset,
                limit: meta.limit,
                total_items: meta.total_items,
                sort: meta.sort,
            }}
            apply={apply}
        />
    )
}

export default SortingTable;
