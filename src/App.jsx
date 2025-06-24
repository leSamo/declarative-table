import '@patternfly/react-core/dist/styles/base.css';
import './style.css';

import { Fragment } from 'react';
import { Bullseye, Stack, StackItem, TextContent, Text, Split, SplitItem, Card, GridItem, Grid } from '@patternfly/react-core'
import { CodeEditor } from '@patternfly/react-code-editor';
import { Table, Td, Th, Tr } from '@patternfly/react-table';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import PlainTable from './Examples/PlainTable';
import PlainTableRaw from './Examples/PlainTable.jsx?raw';

import EmptyTable from './Examples/EmptyTable';
import EmptyTableRaw from './Examples/EmptyTable.jsx?raw';

import PaginatedTable from './Examples/PaginatedTable';
import PaginatedTableRaw from './Examples/PaginatedTable.jsx?raw';

import ManageableColumnsTable from './Examples/ManageableColumnsTable';
import ManageableColumnsTableRaw from './Examples/ManageableColumnsTable.jsx?raw';

import ExpandableTable from './Examples/ExpandableTable';
import ExpandableTableRaw from './Examples/ExpandableTable.jsx?raw';

import SelectableTable from './Examples/SelectableTable';
import SelectableTableRaw from './Examples/SelectableTable.jsx?raw';

import SortingTable from './Examples/SortingTable';
import SortingTableRaw from './Examples/SortingTable.jsx?raw';

import FilteringTable from './Examples/FilteringTable';
import FilteringTableRaw from './Examples/FilteringTable.jsx?raw';

import ErrorTable from './Examples/ErrorTable';
import ErrorTableRaw from './Examples/ErrorTable.jsx?raw';

const PROP_INFO = [
  {
    name: 'isLoading',
    type: 'boolean',
    defaultValue: 'false',
    description: <p>If true substitutes the table with skeleton table; <code>columns</code> and <code>meta.limit</code> props are important since they influence the look of the skeleton table.</p>
  },
  {
    name: 'isExpandable',
    type: 'boolean',
    defaultValue: 'false',
    description: <p>If true adds a expand toggle to each row of the table and a bulk expand toggle to the header. The content of the expandable section is controlled by <code>expandableContent</code> property in the row mapper. If <code>expandableContent</code> is not present for a row then that correspoding table row won't be expandable.</p>
  },
  {
    name: 'isSelectable',
    type: 'boolean',
    defaultValue: 'false',
    description: <p>If true adds a select checkbox to each row of the table and a bulk select page and bulk select none action to the toolbar. Does not add bulk select all action unless <code>fetchBulk</code> prop is also defined.</p>
  },
  {
    name: 'areColumnsManageable',
    type: 'boolean',
    defaultValue: 'false',
    description: <p>If true adds a "Manage columns" button to the toolbar, the modal allows user to selectively hide and show columns; Requires setting up of <code>columns.isShown</code> and <code>columns.isShownByDefault</code>; optionally <code>columns.isUntoggleable</code> can be used.</p>
  },
  {
    name: 'filterConfig',
    type: 'array',
    defaultValue: '{}',
    description: <p>Used to define filters displayed in the toolbar. Needs to be used with conjunction with <code>setupFilters</code> hook.</p>
  },
  {
    name: 'activeFiltersConfig',
    type: 'array',
    defaultValue: '{}',
    description: <p>Used to display filter chips in the toolbar. Needs to be used with conjunction with <code>setupFilters</code> hook.</p>
  },
  {
    name: 'emptyState',
    type: 'React.ReactNode',
    defaultValue: 'undefined',
    description: <p>Element to be shown instead of table body when table has no rows.</p>
  },
  {
    name: 'actions',
    type: 'array',
    defaultValue: '[]',
    description: <p>Bulk actions to be shown within a kebab menu in the toolbar. Each array item should have <code>label</code> and <code>onClick</code> properties; and optionally <code>props</code> prop which can be used to disable the action under certain conditions.</p>
  },
  {
    name: 'rowActions',
    type: 'array',
    defaultValue: '[]',
    description: <p>Actions to be shown on the right side of each table row. Each array item should have <code>title</code> and <code>onClick</code> properties.</p>
  },
  {
    name: 'rows',
    type: 'array',
    defaultValue: '[]',
    description: <p>Rows to be displayed within the table. Each row should have <code>cells</code> and <code>key</code> property. Property <code>cells</code> is an array where each element corresponds to one table cell. Rows have optional <code>expandableContent</code> property that defines what to show when the row is expanded. Expandable content can only be visible when table has <code>isExpandable</code> prop set to <code>true</code>.</p>
  },
  {
    name: 'columns',
    type: 'array',
    defaultValue: '[]',
    description: <p>Array of column information, each column is an object with following mandatory properties <code>title</code>, <code>key</code>. Properties <code>sortParam</code> and <code>sortDefaultDirection</code> configure sorting and properties <code>isShown</code>, <code>isShownByDefault</code> and <code>isUntoggleable</code> configure column management.</p>
  },
  {
    name: 'meta',
    type: 'object',
    defaultValue: 'undefined',
    description: <p>Object with pagination and sorting information. Has to contain properties <code>offset</code>, <code>limit</code>, <code>total_items</code> and optionally <code>sort</code>.</p>
  },
  {
    name: 'apply',
    type: 'function',
    defaultValue: 'undefined',
    description: <p>This function should have a first parameter of type object. The values of properties of this object should replace values of current parameters. Second argument is a boolean which determined whether the new state should completely replace the old one. Table calls this functions upon user interaction with the table.</p>
  },
  {
    name: 'errorStatus',
    type: 'number | string',
    defaultValue: 'undefined',
    description: <p>If value of this prop is nullish then table is displayed as normal. When the value is a number or a string then there is an error state displayed corresponding to the HTTP status code.</p>
  },
  {
    name: 'applyColumns',
    type: 'function',
    defaultValue: 'undefined',
    description: <p>Callback called when user changes columns using column management modal. This function should mutate the value passed into <code>columns</code> prop.</p>
  },
  {
    name: 'onExport',
    type: 'function',
    defaultValue: 'undefined',
    description: <p>Used to add CSV/JSON export button to the table. The return value of <code>useExport</code> hook should be passed here.</p>
  },
  {
    name: 'fetchBulk',
    type: 'function',
    defaultValue: 'undefined',
    description: <p>Callback when user clicks select all items in the bulk select dropdown. If this function is not defined, then the option to select all is not present.</p>
  },
]

const EXAMPLES = [
  {
    name: 'Plain Table',
    description: (
      <Text>
        To get the most basic table with static items and no pagination, only three props are required to be supplied:
        <ol>
          <li>
            rows
          </li>
          <li>
            columns
          </li>
          <li>
            meta -- pagination properties consisting of properties offset, limit and total_items; some backends use page and page_size and in that case limit = page_size and offset = (page - 1) * page_size
          </li>
        </ol>
      </Text>
    ),
    component: PlainTable,
    code: PlainTableRaw,
  },
  {
    name: 'Empty Table',
    description: (
      <Text>
        Use <code>emptyState</code> prop to display a custom empty state when the table has no rows.
      </Text>
    ),
    component: EmptyTable,
    code: EmptyTableRaw,
  },
  {
    name: 'Paginated Table',
    description: (
      <Text>
        Shows a skeleton table while data is loading by reading <code>isLoading</code> prop. Prop <code>apply</code> needs to be provided through which the table sets page and per page parameters.
      </Text>
    ),
    component: PaginatedTable,
    code: PaginatedTableRaw,
  },
  {
    name: 'Manageable Columns Table',
    description: (
      <Text>
        Allows users to show or hide columns using the "Manage columns" button. Requires <code>areColumnsManageable</code> and column visibility props (<code>isShown</code>, <code>isShownByDefault</code>, <code>isUntoggleable</code>).
      </Text>
    ),
    component: ManageableColumnsTable,
    code: ManageableColumnsTableRaw,
  },
  {
    name: 'Expandable Table',
    description: (
      <Text>
        Adds expand toggles to each row. Ensure your row mapper adds a unique key to each row and provides <code>expandableContent</code>.
      </Text>
    ),
    component: ExpandableTable,
    code: ExpandableTableRaw,
  },
  {
    name: 'Selectable Table With Actions',
    description: (
      <Text>
        Adds checkboxes for row selection and bulk select actions. Enable with <code>isSelectable</code>. Bulk actions can be configured using <code>actions</code> prop, and row actions using <code>rowActions</code> prop. Row actions are displayed in a kebab menu on the right side of each row.
      </Text>
    ),
    component: SelectableTable,
    code: SelectableTableRaw,
  },
  {
    name: 'Sorting Table',
    description: (
      <Text>
        Adds sorting indicators to the table header. Sorting is defined using <code>sortParam</code> and <code>sortDefaultDirection</code> properties of each <code>columns</code> prop item.
      </Text>
    ),
    component: SortingTable,
    code: SortingTableRaw,
  },
  {
    name: 'Filtering Table',
    description: (
      <Text>
        Adds filter controls to the toolbar. Use <code>filterConfig</code> and <code>activeFiltersConfig</code> with <code>setupFilters</code> hook. There are four types of filters available: text filter, checkbox filter, radio filter, and range filter.
      </Text>
    ),
    component: FilteringTable,
    code: FilteringTableRaw,
  },
  {
    name: 'Error Table',
    description: (
      <Text>
        Error returned when fetching data can be passed using the <code>errorStatus</code> prop. Table will display an error state with the corresponding HTTP status code. If the value of <code>errorStatus</code> is nullish then the table is displayed as normal.
      </Text>
    ),
    component: ErrorTable,
    code: ErrorTableRaw,
  },
];

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 0
      }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Split hasGutter>
        <SplitItem>
          <Card style={{ height: 'calc(100vh - 32px)', position: 'fixed', padding: 16, margin: 16 }}>
            <TextContent>
              <Text component="h2">
                Table of contents
              </Text>
              <div key="available-props">
                <a href="#available-props">
                  Available Props
                </a>
              </div>
              <hr />
              {EXAMPLES.map(example => (
                <div key={example.name}>
                  <a href={`#${example.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    {example.name}
                  </a>
                </div>
              ))}
            </TextContent>
          </Card>
        </SplitItem>
        <SplitItem>
          <Card style={{ height: '100%', width: 'calc(100vw - 232px)', padding: 16, marginTop: 16, marginRight: 16, marginBottom: 16, marginLeft: 252 }}>
            <Bullseye>
              <Stack hasGutter style={{ maxWidth: 1800 }}>
                <StackItem>
                  <TextContent>
                    <Text component="h1">
                      Declarative Table Examples
                    </Text>
                  </TextContent>
                </StackItem>
                <StackItem>
                  <TextContent>
                    <Text component="h2" id="available-props">
                      Available Props
                    </Text>
                    <Text>
                      <Table variant="compact">
                        <Tr>
                          <Th>
                            <b>Name</b>
                          </Th>
                          <Th>
                            <b>Type</b>
                          </Th>
                          <Th>
                            <b>Default value</b>
                          </Th>
                          <Th>
                            <b>Description</b>
                          </Th>
                        </Tr>
                        {PROP_INFO.map(prop => (
                          <Tr key={prop.name}>
                            <Td>
                              <b><code>{prop.name}</code></b>
                            </Td>
                            <Td>
                              <code>{prop.type}</code>
                            </Td>
                            <Td>
                              <code>{prop.defaultValue}</code>
                            </Td>
                            <Td>
                              {prop.description}
                            </Td>
                          </Tr>
                        ))}
                      </Table>
                    </Text>
                  </TextContent>
                </StackItem>
                <StackItem>
                  <TextContent>
                    <Text component="h2">
                      Table Usage Assumptions
                    </Text>
                    <Text>
                      The following points highlight the design decisions made to simplify the interface of the table:
                      <ol>
                        <li>Either none or all rows are selectable. You cannot selectively make only some rows selectable by hiding or disabling the row select checkbox.</li>
                        <li>Either none or all rows have actions. You cannot selectively make only some rows have visible actions by hiding or disabling the row action kebab.</li>
                        <li>Rows can only have actions within the kebab menu on the right side. There can be no buttons outside of the kebab menu.</li>
                        <li>TODO: Hierarchical filter (OS filter)</li>
                        <li>TODO: Localstorage saving of column management</li>
                        <li>TODO: Sticky headers</li>
                      </ol>
                    </Text>
                  </TextContent>
                </StackItem>
                {EXAMPLES.map(example => (
                  <Fragment key={example.name}>
                    <StackItem>
                      <TextContent>
                        <Text
                          component="h2"
                          id={example.name.toLowerCase().replace(/\s+/g, '-')}
                        >
                          {example.name}
                        </Text>
                        {example.description}
                      </TextContent>
                    </StackItem>
                    <StackItem>
                      <Grid hasGutter span={12}>
                        <GridItem xl={6} lg={12}>
                          <div style={{ border: "solid 2px gray" }}>
                            <example.component />
                          </div>
                        </GridItem>
                        <GridItem xl={6} lg={12}>
                          <CodeEditor
                            code={example.code}
                            language={'javascript'}
                            height="620px"

                          />
                        </GridItem>
                      </Grid>
                    </StackItem>
                  </Fragment>
                ))}
              </Stack>
            </Bullseye>
          </Card>
        </SplitItem>
      </Split>
    </QueryClientProvider>
  )
}

export default App
