import React, { ReactNode } from 'react';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { Skeleton } from '@patternfly/react-core';
import uniq from 'lodash/uniq';
import { ConditionalFilterProps } from '@redhat-cloud-services/frontend-components';

export type DeclarativeTableRow = {
  key: string,
  cells: ReactNode,
  expandableContent?: ReactNode
}

export type DeclarativeTableMeta = {
  offset: number,
  limit: number,
  total_items: number,
  sort?: string
}

export type DeclarativeTableAction = {
  label: React.ReactNode,
  onClick: (event: MouseEvent | React.MouseEvent | React.KeyboardEvent, selectedRows: string[]) => void,
  props: object | ((selectedRows: string[]) => void),
}

// TODO: Unify page, perPage and itemCount with meta
interface DeclarativeTableToolbarProps {
  isLoading?: boolean,
  isSelectable?: boolean,
  rows: DeclarativeTableRow[],
  page: number,
  perPage: number,
  itemCount: number,
  apply?: (params: { limit?: number, offset?: number }) => void,
  filterConfig: ConditionalFilterProps,
  activeFiltersConfig: { filters: [] },
  meta: DeclarativeTableMeta,
  onExport: (format: string) => void,
  selectedRows: string[],
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>,
  fetchBulk?: () => Promise<string[]>,
  dedicatedAction?: ReactNode,
  actions?: DeclarativeTableAction[]
};

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
}: DeclarativeTableToolbarProps) => {
  const selectAll = () =>
    fetchBulk?.().then((keys: string[]) =>
      setSelectedRows((selectedRows: string[]) => uniq<string>([...selectedRows, ...keys]))
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
        isSelectable ? {
          count: selectedRows.length,
          items: [
            {
              title: 'Select none (0 items)',
              onClick: () => setSelectedRows([]),
            },
            {
              title: `Select page (${rows.length} ${rows.length === 1 ? 'item' : 'items'
                })`,
              onClick: () =>
                setSelectedRows((selectedRows: string[]) =>
                  uniq([...selectedRows, ...rows.map((row: DeclarativeTableRow) => row.key)])
                ),
            },
            ...(fetchBulk !== undefined
              ? [
                {
                  title: `Select all (${meta.total_items} ${meta.total_items === 1 ? 'item' : 'items'
                    })`,
                  onClick: selectAll,
                },
              ]
              : []),
          ],
          isDisabled: meta.total_items === 0 && selectedRows.length === 0,
          checked: selectedRows.length > 0,
          onSelect: () =>
            selectedRows.length === 0 ? selectAll() : setSelectedRows([]),
        } : undefined
      }
      actionsConfig={{
        actions: [
          '',
          ...actions.map((action: DeclarativeTableAction) => ({
            ...action,
            props: typeof (action.props) === 'function' ? action.props(selectedRows) : action.props,
            onClick: (e: MouseEvent | React.MouseEvent | React.KeyboardEvent) => action.onClick(e, selectedRows),
          })),
        ],
      }}
    />
  );
};

export default DeclarativeTableToolbar;
