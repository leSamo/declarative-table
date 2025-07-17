import React, { useState } from 'react';
import propTypes from 'prop-types';
import DeclarativeTableBody from './DeclarativeTableBody';
import DeclarativeTableToolbar from './DeclarativeTableToolbar';
import DeclarativeTableFooter from './DeclarativeTableFooter';
import ErrorHandler from './ErrorHandler';
import { useColumnManagement } from './helpers';
import { Button, ButtonVariant } from '@patternfly/react-core';
import { ColumnsIcon } from '@patternfly/react-icons';

const DeclarativeTable = ({
  isLoading,
  isExpandable,
  isSelectable,
  areColumnsManageable,
  rows,
  columns,
  filterConfig = {},
  activeFiltersConfig = {},
  meta,
  errorStatus,
  emptyState,
  apply,
  onExport,
  applyColumns,
  fetchBulk,
  actions,
  rowActions,
}) => {
  const { offset, limit, total_items, sort } = meta;

  const [selectedRows, setSelectedRows] = useState([]);

  const [ColumnManagementModal, setColumnModalOpen] = useColumnManagement(
    columns,
    (columns) => applyColumns(columns)
  );

  return (
    <ErrorHandler errorStatus={errorStatus}>
      {ColumnManagementModal}
      <DeclarativeTableToolbar
        isLoading={isLoading}
        isSelectable={isSelectable}
        rows={rows}
        page={offset / limit + 1}
        perPage={limit}
        itemCount={total_items}
        apply={apply}
        filterConfig={filterConfig}
        activeFiltersConfig={activeFiltersConfig}
        meta={meta}
        onExport={onExport}
        dedicatedAction={[...areColumnsManageable ? [
          <Button
            onClick={() => setColumnModalOpen(true)}
            variant={ButtonVariant.secondary}
            icon={<ColumnsIcon />}
            key="column-mgmt"
            ouiaId="column-management-modal-open-button"
          >
            Manage columns
          </Button>
          ] : []
        ]}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        fetchBulk={fetchBulk}
        actions={actions}
      />
      <DeclarativeTableBody
        isLoading={isLoading}
        columns={columns.filter((column) => !areColumnsManageable || column.isShown === undefined || column.isShown)}
        rows={rows.map((row) => ({
          ...row,
          cells: row.cells.filter((_, i) => !areColumnsManageable || columns[i].isShown === undefined || columns[i].isShown),
        }))}
        isExpandable={isExpandable}
        isSelectable={isSelectable}
        emptyState={emptyState}
        sortParam={sort}
        perPage={limit}
        apply={apply}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        rowActions={rowActions}
      />
      <DeclarativeTableFooter
        isLoading={isLoading}
        page={offset / limit + 1}
        perPage={limit}
        itemCount={total_items}
        apply={apply}
      />
    </ErrorHandler>
  );
};

DeclarativeTable.propTypes = {
  isLoading: propTypes.bool,
  columns: propTypes.arrayOf(
    propTypes.shape({
      title: propTypes.node.isRequired,
      sortParam: propTypes.string,
      isShown: propTypes.bool,
      isShownByDefault: propTypes.bool,
      isUntoggleable: propTypes.bool,
    })
  ).isRequired,
  rows: propTypes.arrayOf(
    propTypes.shape({
      key: propTypes.string.isRequired,
      cells: propTypes.arrayOf(propTypes.node).isRequired,
      expandableContent: propTypes.node,
    })
  ).isRequired,
  isExpandable: propTypes.bool,
  isSelectable: propTypes.bool,
  areColumnsManageable: propTypes.bool,
  emptyState: propTypes.node,
  filterConfig: propTypes.object,
  activeFiltersConfig: propTypes.object,
  meta: propTypes.shape({
    offset: propTypes.number,
    limit: propTypes.number,
    total_items: propTypes.number,
    sort: propTypes.string,
  }),
  errorStatus: propTypes.oneOfType([propTypes.number, propTypes.string]),
  apply: propTypes.func,
  onExport: propTypes.func,
  applyColumns: propTypes.func,
  fetchBulk: propTypes.func,
  actions: propTypes.arrayOf(
    propTypes.shape({
      label: propTypes.string,
      onClick: propTypes.func,
      props: propTypes.oneOfType([propTypes.object, propTypes.func]),
    })
  ),
  rowActions: propTypes.arrayOf(
    propTypes.shape({
      label: propTypes.string,
      onClick: propTypes.func,
      props: propTypes.object,
    })
  ),
};

export default DeclarativeTable;
