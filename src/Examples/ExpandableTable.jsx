import { useQuery } from "@tanstack/react-query";
import DeclarativeTable from "../DeclarativeTable/DeclarativeTable";
import fetchData from "../MockBackend/MockBackend";
import { useState } from "react";

const ExpandableTable = () => {
    const [params, apply] = useState({
        limit: 10,
        offset: 0
    });

    const { data: { data, meta }, isFetching } = useQuery({
        queryKey: ['ExpandableTable', params],
        queryFn: () => fetchData(params),
        initialData: { data: [], meta: params }
    });

    const TABLE_COLUMNS = [
        {
            title: 'Common Name',
            key: 'common_name'
        },
        {
            title: 'Scientific Name (Genus)',
            key: 'scientific_name'
        },
        {
            title: 'Primary Type',
            key: 'primary_type'
        }
    ];

    const TABLE_DATA_MAPPER = (row) => ({
        cells: [
            row.common_name,
            row.scientific_name,
            row.primary_type
        ],
        key: row.common_name,
        expandableContent: row.description
    });

    return (
        <DeclarativeTable
            isLoading={isFetching}
            isExpandable
            rows={data.map(row => TABLE_DATA_MAPPER(row))}
            columns={TABLE_COLUMNS}
            meta={{
                offset: meta.offset,
                limit: meta.limit,
                total_items: meta.total_items
            }}
            apply={apply}
        />
    )
}

export default ExpandableTable;
