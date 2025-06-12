import { useQuery } from "@tanstack/react-query";
import DeclarativeTable from "../DeclarativeTable/DeclarativeTable";
import fetchData from "../MockBackend/MockBackend";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const ExpandableTable = () => {
    const defaultParams = {
        limit: 10,
        offset: 0
    };

    const [params, setParams] = useState(defaultParams);

    const queryClient = useQueryClient();

    const apply = (newState) => {
        console.log("Applying new state:", newState);
        setParams(newState);
        queryClient.invalidateQueries(['test']);
    };

    const { data: queryData, isFetching } = useQuery({
        queryKey: ['test', params],
        queryFn: () => fetchData(params),
        initialData: { data: [], meta: defaultParams }
    });

    const { data, meta } = queryData || { data: [], meta: defaultParams};

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
            row.scientific_genus,
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
