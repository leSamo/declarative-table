import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  ExpandableRowContent,
  SortByDirection,
  ActionsColumn,
} from '@patternfly/react-table';
import { TableVariant } from '@patternfly/react-table';
import { DEFAULT_LIMIT } from './constants';
import { SkeletonTable } from '@patternfly/react-component-groups';

const DeclarativeTableBody = ({
  isLoading,
  columns,
  rows,
  isExpandable = false,
  isSelectable = false,
  emptyState,
  sortParam,
  perPage,
  apply,
  selectedRows,
  setSelectedRows,
  rowActions,
}) => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [areAllRowsExpanded, setAreAllRowsExpanded] = useState(false);
  const [inertiaRowCount, setInertiaRowCount] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setInertiaRowCount(rows.length);
    }
  }, [rows, isLoading]);

  useEffect(() => {
    setAreAllRowsExpanded(
      rows.length > 0 && rows.filter(row => row.expandableContent).length === expandedRows.length
    );
  }, [expandedRows]);

  useEffect(() => {
    areAllRowsExpanded && setExpandedRows(rows.filter(row => row.expandableContent).map((row) => row.key));
  }, [rows]);

  const onExpandRow = (row, isExpanding) =>
    setExpandedRows((prevExpanded) => {
      const otherExpandedRows = prevExpanded.filter((r) => r !== row);
      return isExpanding ? [...otherExpandedRows, row] : otherExpandedRows;
    });

  const onToggleSelectRow = (row, isTogglingOn) =>
    setSelectedRows((prevExpanded) => {
      const otherSelectedRows = prevExpanded.filter((r) => r !== row);
      return isTogglingOn ? [...otherSelectedRows, row] : otherSelectedRows;
    });

  const isRowExpanded = (row) => expandedRows.includes(row);
  const isRowSelected = (row) => selectedRows.includes(row);

  const createSortBy = (columns, sortParam, columnIndex) => {
    if (inertiaRowCount === 0 || !sortParam) {
      return {};
    }

    const direction =
      sortParam[0] === '-' ? SortByDirection.desc : SortByDirection.asc;

    sortParam = sortParam.replace(/^(-|\+)/, '').split(',')[0];

    const selectedColumnIndex = columns.findIndex(
      (item) => item.sortParam === sortParam
    );

    return {
      index: selectedColumnIndex,
      direction,
      defaultDirection:
        columns[columnIndex]?.sortDefaultDirection ?? SortByDirection.desc,
    };
  };

  const getSortParams = (columnIndex) => ({
    sortBy: createSortBy(columns, sortParam, columnIndex),
    onSort: (event, index, direction) => {
      let columnName = columns[columnIndex].sortParam;

      if (direction === SortByDirection.desc) {
        columnName = '-' + columnName;
      }

      rows.length > 0 && apply({ sort: columnName });
    },
    columnIndex,
  });

  const columnHeaders = columns.map((column, index) => (
    <Th
      key={column.title}
      sort={column.sortParam && getSortParams(index)}
      width={column.width}
    >
      {column.title}
    </Th>
  ));

  return isLoading ? (
    <SkeletonTable
      variant={TableVariant.compact}
      rowsCount={perPage || DEFAULT_LIMIT}
      columns={columnHeaders}
      isExpandable={isExpandable}
      isSelectable={isSelectable}
    />
  ) : (
    <Table variant={TableVariant.compact}>
      <Thead>
        <Tr>
          {isExpandable && (
            <Th
              // makes sure the headers do not move on empty state
              style={{ width: 72, minWidth: 72 }}
              expand={
                rows.length > 0 && {
                  onToggle: () =>
                    setExpandedRows(
                      areAllRowsExpanded ? [] : rows.filter(row => row.expandableContent).map((row) => row.key)
                    ),
                  // looks like Patternfly has this condition reversed
                  areAllExpanded: !areAllRowsExpanded,
                }
              }
              aria-label="Expand or collapse all button"
            />
          )}
          {isSelectable && <Th style={{ width: 29, minWidth: 29 }} screenReaderText="Column with row select checkboxes"  />}
          {columnHeaders}
          {rowActions && <Th screenReaderText="Column with row actions" />}
        </Tr>
      </Thead>
      {rows.length === 0 ? (
        <Tbody>
          <Tr>
            <Td colSpan={100}>{emptyState}</Td>
          </Tr>
        </Tbody>
      ) : (
        rows.map((row, rowIndex) => (
          <Tbody key={rowIndex} isExpanded={isRowExpanded(row.key)}>
            <Tr>
              {isExpandable && (row.expandableContent ? (
                <Td
                  expand={{
                    rowIndex,
                    isExpanded: isRowExpanded(row.key),
                    onToggle: () =>
                      onExpandRow(row.key, !isRowExpanded(row.key)),
                  }}
                />
              ) : <Td />)}
              {isSelectable && (
                <Td
                  select={{
                    rowIndex,
                    isSelected: isRowSelected(row.key),
                    onSelect: (_event, isSelecting) =>
                      onToggleSelectRow(row.key, isSelecting),
                    isDisabled: row.isUnselectable,
                  }}
                />
              )}
              {row.cells.map((cell, cellIndex) => (
                <Td key={cellIndex} dataLabel={columns[cellIndex].dataLabel ?? columns[cellIndex].title}>
                  {cell}
                </Td>
              ))}
              {rowActions && (
                <Td isActionCell>
                  <ActionsColumn rowData={row} items={rowActions} isDisabled={false} />
                </Td>
              )}
            </Tr>
            {isExpandable && row.expandableContent && (
              <Tr isExpanded={isRowExpanded(row.key)}>
                <Td colSpan={100}>
                  <ExpandableRowContent>
                    {row.expandableContent}
                  </ExpandableRowContent>
                </Td>
              </Tr>
            )}
          </Tbody>
        ))
      )}
    </Table>
  );
};

DeclarativeTableBody.propTypes = {
  isLoading: propTypes.bool,
  columns: propTypes.arrayOf(
    propTypes.shape({
      title: propTypes.node.isRequired,
      sortParam: propTypes.string,
      sortDefaultDirection: propTypes.oneOf([undefined, 'asc', 'desc']),
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
  emptyState: propTypes.node,
  sortParam: propTypes.string,
  perPage: propTypes.number,
  apply: propTypes.func,
  selectedRows: propTypes.array,
  setSelectedRows: propTypes.func,
  rowActions: propTypes.arrayOf(
    propTypes.shape({
      label: propTypes.string,
      onClick: propTypes.func,
      props: propTypes.object,
    })
  ),
};

export default DeclarativeTableBody;
