import { useEffect, useState } from "react";
import DeclarativeTable from "../DeclarativeTable/DeclarativeTable";
import { useQuery } from '@tanstack/react-query';
import fetchData, { fetchMostPrevalent, fetchScientificNames } from "../MockBackend/MockBackend";
import { decodeRangeFilter, setupFilters } from "../DeclarativeTable/helpers";
import useTextFilter from "../DeclarativeTable/Filters/TextFilter";
import checkboxFilter from "../DeclarativeTable/Filters/CheckboxFilter";
import radioFilter from "../DeclarativeTable/Filters/RadioFilter";
import typeaheadFilter from "../DeclarativeTable/Filters/TypeaheadFilter";
import rangeFilter from "../DeclarativeTable/Filters/RangeFilter";
import hierarchyFilter from "../DeclarativeTable/Filters/HierarchyFilter";
import { StarIcon } from "@patternfly/react-icons";

const AVERAGE_LIFESPAN_RANGE = { min: 0, max: 1000};

const FilteringTable = () => {
    const DEFAULT_FILTERS = {
        count: 'non-zero',
    };

    const [params, setParams] = useState({
        limit: 10,
        offset: 0,
        ...DEFAULT_FILTERS
    });

    const [mostPrevalentFilterGroups, setHierarchyFilterGroups] = useState([]);

    useEffect(() => {
        fetchMostPrevalent().then(result => setHierarchyFilterGroups(result));
    }, []);

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
            key: 'common_name',
        },
        {
            title: 'Scientific Name (Genus)',
            key: 'scientific_name',
        },
        {
            title: 'Primary Type',
            key: 'primary_type',
        },
        {
            title: 'Most prevalent country',
            key: 'most_prevalent_country',
        },
        {
            title: 'Count',
            key: 'count',
        },
        {
            title: 'Average lifespan',
            key: 'average_lifespan_years',
        }
    ];

    const TABLE_DATA_MAPPER = (row) => ({
        cells: [
            row.common_name,
            row.scientific_name,
            row.primary_type,
            row.most_prevalent_country,
            row.count,
            `${row.average_lifespan_years} years`,
        ],
        key: row.common_name
    });

    const COUNT_FILTER_OPTIONS = [
        {
            value: 'all',
            label: 'All',
            icon: <StarIcon />
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

    const PRIMARY_TYPE_FILTER_OPTIONS = [
        {
            value: 'coniferous',
            label: 'Coniferous',
            icon: <StarIcon />
        },
        {
            value: 'deciduous',
            label: 'Deciduous',
        }
    ];

    const [average_lifespan_min, average_lifespan_max] = decodeRangeFilter(params.average_lifespan, AVERAGE_LIFESPAN_RANGE);

    const filters = [
        useTextFilter({
            urlParam: 'common_name',
            label: 'Common name',
            placeholder: 'Search common name',
            value: params.common_name,
            chipLabel: 'Common name',
            apply
        }),
        typeaheadFilter({
            urlParam: 'scientific_name',
            label: 'Scientific name',
            value: params.scientific_name,
            placeholder: 'Filter by scientific name',
            chipLabel: 'Scientific name',
            fetchItems: fetchScientificNames,
            apply
        }),
        checkboxFilter({
            urlParam: 'primary_type',
            label: 'Primary type',
            value: params.primary_type,
            items: PRIMARY_TYPE_FILTER_OPTIONS,
            placeholder: 'Filter by primary type',
            chipLabel: 'Primary type',
            apply
        }),
        hierarchyFilter({
            urlParam: 'most_prevalent_country',
            label: 'Most prevalent',
            value: params.most_prevalent_country,
            placeholder: 'Filter by most prevalent',
            groups: mostPrevalentFilterGroups,
            chipLabel: 'Most prevalent',
            apply
        }),
        radioFilter({
            urlParam: 'count',
            label: 'Count',
            value: params.count,
            items: COUNT_FILTER_OPTIONS,
            placeholder: 'Filter by count',
            chipLabel: 'Count',
            apply
        }),
        rangeFilter({
            urlParam: 'average_lifespan',
            label: 'Average lifespan',
            range: AVERAGE_LIFESPAN_RANGE,
            value: { min: average_lifespan_min, max: average_lifespan_max },
            placeholder: 'Filter by average lifespan',
            chipLabel: 'Average lifespan',
            chipDecimalPlaces: 0,
            apply,
        })
    ];

    const [filterConfig, activeFiltersConfig] = setupFilters(
        filters,
        meta,
        DEFAULT_FILTERS,
        apply
    );

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
