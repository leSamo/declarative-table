import { useState } from "react";
import DeclarativeTable from "../DeclarativeTable/DeclarativeTable";
import { useQuery } from '@tanstack/react-query';
import fetchData from "../MockBackend/MockBackend";
import { setupFilters } from "../DeclarativeTable/hooks";
import useTextFilter from "../DeclarativeTable/Filters/TextFilter";
import radioFilter from "../DeclarativeTable/Filters/RadioFilter";

const COUNT_FILTER_OPTIONS = [
    {
        value: 'all',
        label: 'All',
    },
    {
        value: 'zero',
        label: 'Zero',
    },
    {
        value: 'non-zero',
        label: 'Non-zero',
    }
];

const FilteringTable = () => {
    const DEFAULT_FILTERS = {
        count: 'non-zero',
    };

    const [params, setParams] = useState({
        limit: 10,
        offset: 0,
        ...DEFAULT_FILTERS
    });

    const apply = (newParams) => {
        setParams(prevParams => ({
            offset: 0,
            ...prevParams,
            ...newParams
        }));
    }

    const { data: { data, meta }, isFetching } = useQuery({
        queryKey: ['ExpandableTable', params],
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
        key: row.common_name,
        expandableContent: row.description
    });

    const filters = [
        useTextFilter({
            urlParam: 'commonName',
            label: 'Common name',
            placeholder: 'Search common name',
            value: params.commonName,
            chipLabel: 'Common name',
            apply
        }),
        radioFilter({
            urlParam: 'count',
            label: 'Count',
            value: params.count,
            items: COUNT_FILTER_OPTIONS,
            placeholder: 'Count',
            chipLabel: 'Count',
            apply
        })
    ];

    const [filterConfig, activeFiltersConfig] = setupFilters(
        filters,
        meta,
        DEFAULT_FILTERS,
        apply
    );

    console.log(">>>", meta);

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
            filterConfig={filterConfig}
            activeFiltersConfig={activeFiltersConfig}
        />
    )
}

export default FilteringTable;
