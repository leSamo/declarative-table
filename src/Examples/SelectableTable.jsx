import { useState } from "react";
import DeclarativeTable from "../DeclarativeTable/DeclarativeTable";
import { useQuery } from "@tanstack/react-query";
import fetchData from "../MockBackend/MockBackend";

const SelectableTable = () => {
    const [params, setParams] = useState({
        limit: 10,
        offset: 0,
    });

    const apply = (newParams, replaceState) => {
        setParams(prevParams => ({
            offset: 0,
            ...replaceState ? { limit: prevParams.limit } : prevParams,
            ...newParams
        }));
    }

    const { data: { data, meta }, isFetching } = useQuery({
        queryKey: ['FilteringTable', params],
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
        key: row.common_name
    });

    const TABLE_BULK_ACTIONS = [{
        label: 'View details',
        onClick: (e, selectedItems) => {
            console.log("View details of", selectedItems.join(', '));
        },
        props: (selectedItems) => ({ isDisabled: selectedItems.length === 0  })
    }];

    const TABLE_ROW_ACTIONS = [{
        title: 'View details',
        onClick: (e, rowIndex, rowData) => {
            console.log("View details of", rowData.cells[0]);
        }
    }];

    return (
        <DeclarativeTable
            isSelectable
            isLoading={isFetching}
            rows={data.map(row => TABLE_DATA_MAPPER(row))}
            columns={TABLE_COLUMNS}
            meta={{
                offset: meta.offset,
                limit: meta.limit,
                total_items: meta.total_items,
            }}
            apply={apply}
            actions={TABLE_BULK_ACTIONS}
            rowActions={TABLE_ROW_ACTIONS}
        />
    )
}

export default SelectableTable;
