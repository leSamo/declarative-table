import React from 'react';
import propTypes from 'prop-types';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { Skeleton } from '@patternfly/react-core';
import { uniq } from 'lodash';

const DeclarativeTableToolbar = ({
  isLoading,
  isSelectable,
  rows,
  page,
  perPage,
  itemCount,
  apply,
  filterConfig,
  activeFiltersConfig,
  meta,
  onExport,
  selectedRows,
  setSelectedRows,
  fetchBulk,
  dedicatedAction,
  actions = [],
}) => {
  const selectAll = () =>
    fetchBulk().then((keys) =>
      setSelectedRows((selectedRows) => uniq([...selectedRows, keys]))
    );

  return (
    <PrimaryToolbar
      pagination={
        isLoading ? (
          <Skeleton fontSize="xl" width="200px" />
        ) : (
          {
            isDisabled: apply === undefined || itemCount === 0,
            itemCount,
            page,
            perPage,
            ouiaId: 'pagination-top',
            onSetPage: (event, page, limit, offset) => apply?.({ limit, offset }),
            onPerPageSelect: (event, limit) => apply?.({ limit, offset: 0 }),
          }
        )
      }
      filterConfig={filterConfig?.items?.length > 0 ? filterConfig : undefined}
      activeFiltersConfig={activeFiltersConfig}
      exportConfig={
        onExport && {
          isDisabled: itemCount === 0,
          onSelect: (e, format) => onExport(format),
        }
      }
      dedicatedAction={dedicatedAction}
      bulkSelect={
        isSelectable && {
          count: selectedRows.length,
          items: [
            {
              title: 'Select none (0 items)',
              onClick: () => setSelectedRows([]),
            },
            {
              title: `Select page (${rows.length} ${
                rows.length === 1 ? 'item' : 'items'
              })`,
              onClick: () =>
                setSelectedRows((selectedRows) =>
                  uniq([...selectedRows, ...rows.map((row) => row.key)])
                ),
            },
            ...(fetchBulk
              ? [
                  {
                    title: `Select all (${meta.total_items} ${
                      meta.total_items === 1 ? 'item' : 'items'
                    })`,
                    onClick: selectAll,
                  },
                ]
              : []),
          ],
          isDisabled: meta.total_items === 0 && selectedRows.length === 0,
          checked: selectedRows.length > 0,
          ouiaId: 'bulk-select',
          onSelect: () =>
            selectedRows.length === 0 ? selectAll() : setSelectedRows([]),
        }
      }
      actionsConfig={{
        actions: [
          '',
          ...(actions).map((action) => ({
            ...action,
            props: typeof(action.props) === 'function' ? action.props(selectedRows) : action.props,
            onClick: (e) => action.onClick(e, selectedRows),
          })),
        ],
      }}
    />
  );
};

DeclarativeTableToolbar.propTypes = {
  isLoading: propTypes.bool,
  isSelectable: propTypes.bool,
  rows: propTypes.arrayOf(
    propTypes.shape({
      key: propTypes.string.isRequired,
      cells: propTypes.arrayOf(propTypes.node).isRequired,
      expandableContent: propTypes.node,
    })
  ).isRequired,
  page: propTypes.number,
  perPage: propTypes.number,
  itemCount: propTypes.number,
  apply: propTypes.func,
  filterConfig: propTypes.shape({
    items: propTypes.array,
  }),
  activeFiltersConfig: propTypes.shape({
    filters: propTypes.array,
  }),
  meta: propTypes.shape({
    offset: propTypes.number,
    limit: propTypes.number,
    total_items: propTypes.number,
    sort: propTypes.string,
  }),
  onExport: propTypes.func,
  actionsConfig: propTypes.object,
  selectedRows: propTypes.array,
  setSelectedRows: propTypes.func,
  fetchBulk: propTypes.func,
  dedicatedAction: propTypes.node,
  actions: propTypes.arrayOf(
    propTypes.shape({
      label: propTypes.string,
      onClick: propTypes.func,
      props: propTypes.oneOfType([propTypes.object, propTypes.func]),
    })
  ),
};

export default DeclarativeTableToolbar;
