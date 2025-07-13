import React, { useState } from 'react';
import qs from 'query-string';
import { downloadFile } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import { ColumnManagementModal } from '@patternfly/react-component-groups';
import { isEqual } from 'lodash';

export const useLocalStorage = (key) => {
  const [sessionValue, setSessionValue] = useState(localStorage.getItem(key));

  const setValue = (newValue) => {
    setSessionValue(newValue);
    localStorage.setItem(key, newValue);
  };

  return [sessionValue, setValue];
};

export function filterParams(urlParams, allowedParams) {
  const paramsCopy = { ...urlParams };

  Object.entries(paramsCopy)
    .filter(([key, value]) => !allowedParams.includes(key) || value === '')
    .forEach(([key]) => delete paramsCopy[key]);

  return paramsCopy;
}

const transformUrlParamsBeforeFetching = (urlParams) => {
  let newParams = { ...urlParams, total_items: undefined };

  [].forEach((transformer) => {
    newParams = transformer(newParams);
  });

  return newParams;
};

const NUMERICAL_URL_PARAMS = ['limit', 'offset'];

export const useUrlParams = (allowedParams) => {
  const getUrlParams = () => {
    const url = new URL(window.location);
    return filterParams(qs.parse(url.search), allowedParams);
  };

  const setUrlParams = (newParams) => {
    const url = new URL(window.location);
    const queryParams = qs.stringify(newParams);

    window.history.replaceState(
      null,
      null,
      `${url.origin}${url.pathname}?${queryParams}`
    );
  };

  return [getUrlParams, setUrlParams];
};

export const useExport = ({
  filenamePrefix,
  fetchAction,
  fetchActionParam,
  allowedParams,
}) => {
  // const dispatch = useDispatch();

  const DEFAULT_PARAMS = {
    report: true,
  };

  const onExport = async (format, params) => {
    /*
    dispatch(
      addNotification({
        variant: 'info',
        title:
          'Preparing export. Once complete, your download will start automatically.',
      })
    );
    */

    const formattedDate =
      new Date().toISOString().replace(/[T:]/g, '-').split('.')[0] + '-utc';

    const filteredParams = filterParams(params, allowedParams);

    const payload = await fetchAction(
      {
        ...transformUrlParamsBeforeFetching(filteredParams),
        ...DEFAULT_PARAMS,
        data_format: format,
      },
      fetchActionParam
    );

    let data =
      format === 'json' ? JSON.stringify(payload.data.data) : payload.data.data;

    downloadFile(data, filenamePrefix + formattedDate, format);

    /*
    dispatch(clearNotifications());

    dispatch(
      addNotification({
        variant: 'success',
        title: 'Downloading export',
      })
    );
    */
  };

  return onExport;
};

export const useColumnManagement = (columns, onApply) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return [
    <ColumnManagementModal
      appliedColumns={columns}
      applyColumns={(newColumns) => onApply(newColumns)}
      isOpen={isModalOpen}
      onClose={() => setModalOpen(false)}
      key="column-mgmt-modal"
    />,
    setModalOpen,
  ];
};

export const areAnyFiltersApplied = ({
  currentParams,
  defaultParams,
  filterParams,
}) => {
  // filter out params which have nothing to do with filtering, like page, sort, etc.
  const reducedParams = filterParams.reduce(
    (acc, param) => ({
      ...acc,
      ...(currentParams[param] && { [param]: currentParams[param] }),
    }),
    {}
  );

  return !isEqual(reducedParams, defaultParams);
};

export const setupFilters = (filters, meta, defaultFilters, apply) => {
  if (filters.length === 0) {
    return [undefined, undefined];
  }

  const filterKeys = filters.map((item) => item.filterConfig.key);

  const showDeleteButton = areAnyFiltersApplied({
    currentParams: meta,
    defaultParams: defaultFilters,
    filterParams: filterKeys,
  });

  let filterConfig = { items: [] };
  let activeFiltersConfig = {
    filters: [],
    onDelete: (_, categories, isReset) =>
      isReset
        ? apply({ ...defaultFilters, offset: 0, limit: meta.limit }, true)
        : categories.forEach((category) => category.onDelete(category.chips)),
    deleteTitle: 'Reset filter',
    showDeleteButton,
  };

  filters.forEach((filter) => {
    filterConfig.items.push(filter.filterConfig);

    filter.activeFiltersConfig?.isShown &&
      activeFiltersConfig.filters.push(filter.activeFiltersConfig);
  });

  return [filterConfig, activeFiltersConfig, showDeleteButton];
};

export const decodeRangeFilter = (range) => {
  if (!range?.includes(',')) {
    range = ',';
  }

  const [urlMin, urlMax] = range.split(',');

  const min = +urlMin || 0;
  const max = +urlMax || 10;

  return [min, max];
};
