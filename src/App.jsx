import '@patternfly/react-core/dist/styles/base.css';
import { Bullseye, Stack, StackItem, TextContent, Text, Split, SplitItem, Card, GridItem, Grid } from '@patternfly/react-core'
import { CodeEditor } from '@patternfly/react-code-editor';
import { Table, Td, Th, Tr } from '@patternfly/react-table';

import PlainTable from './Examples/PlainTable';
import PlainTableRaw from './Examples/PlainTable.jsx?raw';

import LoadingTable from './Examples/LoadingTable';
import LoadingTableRaw from './Examples/LoadingTable.jsx?raw';

import ManageableColumnsTable from './Examples/ManageableColumnsTable';
import ManageableColumnsTableRaw from './Examples/ManageableColumnsTable.jsx?raw';

import ExpandableTable from './Examples/ExpandableTable';
import ExpandableTableRaw from './Examples/ExpandableTable.jsx?raw';

import SelectableTable from './Examples/SelectableTable';
import SelectableTableRaw from './Examples/SelectableTable.jsx?raw';

import FilteringTable from './Examples/FilteringTable';
import FilteringTableRaw from './Examples/FilteringTable.jsx?raw';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const PROP_INFO = [
  {
    name: 'isLoading',
    type: 'boolean',
    defaultValue: 'false',
    description: 'If true substitutes the table with skeleton table; columns and meta.limit props are important since they influence the look of the skeleton table.'
  },
  {
    name: 'isExpandable',
    type: 'boolean',
    defaultValue: 'false',
    description: 'If true adds a expand toggle to each row of the table and a bulk expand toggle to the header. The content of the expandable section is controlled by <code>expandableContent</code> prop in the row mapper.'
  },
  {
    name: 'isSelectable',
    type: 'boolean',
    defaultValue: 'false',
    description: 'If true adds a select checkbox to each row of the table and a bulk select page and bulk select none action to the toolbar. Does not add bulk select all action.'
  },
  {
    name: 'areColumnsManageable',
    type: 'boolean',
    defaultValue: 'false',
    description: 'If true adds a "Manage columns" button to the toolbar, the modal allows user to selectively hide and show columns; Requires setting up of <code>columns.isShown</code> and <code>columns.isShownByDefault</code>; optionally <code>columns.isUntoggleable</code> can be used.'
  },
  {
    name: 'emptyState',
    type: 'React.ReactNode',
    defaultValue: 'undefined',
    description: 'Component to be shown instead of rows when the length of rows array is 0'
  },
  {
    name: 'filterConfig',
    type: 'array',
    defaultValue: '[]',
    description: 'Used to define filters displayed in the toolbar. Needs to be used with conjunction with setupFilters hook.'
  },
  {
    name: 'activeFiltersConfig',
    type: 'array',
    defaultValue: '[]',
    description: 'Used to display filter chips in the toolbar. Needs to be used with conjunction with setupFilters hook.'
  }
]

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Split hasGutter>
        <SplitItem>
          <Card style={{ height: 'calc(100vh - 32px)', position: 'fixed', padding: 16, margin: 16 }}>
            <TextContent>
              <Text component="h2">
                Table of contents
              </Text>
              <div>
                <a href="#plain-table">
                  Plain table
                </a>
              </div>
              <div>
                <a href="#loading-table">
                  Loading table
                </a>
              </div>
              <div>
                <a href="#manageable-columns">
                  Manageable columns
                </a>
              </div>
              <div>
                <a href="#expandable-table">
                  Expandable table
                </a>
              </div>
              <div>
                <a href="#selectable-table">
                  Selectable table
                </a>
              </div>
              <div>
                <a href="#filtering-table">
                  Filtering table
                </a>
              </div>
            </TextContent>
          </Card>
        </SplitItem>
        <SplitItem>
          <Card style={{ height: '100%', width: 'calc(100vw - 232px)', padding: 16, marginTop: 16, marginRight: 16, marginBottom: 16, marginLeft: 200 }}>
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
                    <Text component="h2">
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
                          <Tr>
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
                              <span dangerouslySetInnerHTML={{ __html: prop.description }} />
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
                        <li>Either none or all rows are expandable. You cannot selectively make only some columns expandable.</li>
                        <li>Either none or all rows are selectable. You cannot selectively make only some rows selectable by hiding or disabling the row select checkbox.</li>
                        <li>Either none or all rows have actions. You cannot selectively make only some rows have visible actions by hiding or disabling the row action kebab.</li>
                        <li>Rows can only have actions within the kebab menu on the right side. There can be no buttons outside of the kebab menu.</li>
                        <li>TODO: Hierarchical filter (OS filter)</li>
                        <li>TODO: Localstorage saving of column management</li>
                      </ol>
                    </Text>
                  </TextContent>
                </StackItem>
                <StackItem>
                  <TextContent>
                    <Text component="h2" id="plain-table">
                      Plain table
                    </Text>
                    <Text>
                      To get the most basic table, only three props are required to be supplied:
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
                  </TextContent>
                </StackItem>
                <StackItem>
                  <Grid hasGutter span={12}>
                    <GridItem xl={6} lg={12}>
                      <div style={{ border: "solid 2px gray" }}>
                        <PlainTable />
                      </div>
                    </GridItem>
                    <GridItem xl={6} lg={12}>
                      <CodeEditor
                        code={PlainTableRaw}
                        language={'javascript'}
                        height="620px"
                      />
                    </GridItem>
                  </Grid>
                </StackItem>
                <StackItem>
                  <TextContent>
                    <Text component="h2" id="loading-table">
                      Loading table
                    </Text>
                  </TextContent>
                </StackItem>
                <StackItem>
                  <Grid hasGutter span={12}>
                    <GridItem xl={6} lg={12}>
                      <div style={{ border: "solid 2px gray" }}>
                        <LoadingTable />
                      </div>
                    </GridItem>
                    <GridItem xl={6} lg={12}>
                      <CodeEditor
                        code={LoadingTableRaw}
                        language={'javascript'}
                        height="620px"
                        width="800px"
                      />
                    </GridItem>
                  </Grid>
                </StackItem>
                <StackItem>
                  <TextContent>
                    <Text component="h2" id="manageable-columns">
                      Manageable columns
                    </Text>
                  </TextContent>
                </StackItem>
                <StackItem>
                  <Grid hasGutter span={12}>
                    <GridItem xl={6} lg={12}>
                      <div style={{ border: "solid 2px gray" }}>
                        <ManageableColumnsTable />
                      </div>
                    </GridItem>
                    <GridItem xl={6} lg={12}>
                      <CodeEditor
                        code={ManageableColumnsTableRaw}
                        language={'javascript'}
                        height="620px"
                        width="800px"
                      />
                    </GridItem>
                  </Grid>
                </StackItem>
                <StackItem>
                  <TextContent>
                    <Text component="h2" id="expandable-table">
                      Expandable table
                    </Text>
                    <Text>
                      Make sure your row mapper adds unique key to each row.
                    </Text>
                  </TextContent>
                </StackItem>
                <StackItem>
                  <Grid hasGutter span={12}>
                    <GridItem xl={6} lg={12}>
                      <div style={{ border: "solid 2px gray" }}>
                        <ExpandableTable />
                      </div>
                    </GridItem>
                    <GridItem xl={6} lg={12}>
                      <CodeEditor
                        code={ExpandableTableRaw}
                        language={'javascript'}
                        height="620px"
                        width="800px"
                      />
                    </GridItem>
                  </Grid>
                </StackItem>
                <StackItem>
                  <TextContent>
                    <Text component="h2" id="selectable-table">
                      Selectable table
                    </Text>
                  </TextContent>
                </StackItem>
                <StackItem>
                  <Grid hasGutter span={12}>
                    <GridItem xl={6} lg={12}>
                      <div style={{ border: "solid 2px gray" }}>
                        <SelectableTable />
                      </div>
                    </GridItem>
                    <GridItem xl={6} lg={12}>
                      <CodeEditor
                        code={SelectableTableRaw}
                        language={'javascript'}
                        height="620px"
                        width="800px"
                      />
                    </GridItem>
                  </Grid>
                </StackItem>
                <StackItem>
                  <TextContent>
                    <Text component="h2" id="filtering-table">
                      Filtering table
                    </Text>
                  </TextContent>
                </StackItem>
                <StackItem>
                  <Grid hasGutter span={12}>
                    <GridItem xl={6} lg={12}>
                      <div style={{ border: "solid 2px gray" }}>
                        <FilteringTable />
                      </div>
                    </GridItem>
                    <GridItem xl={6} lg={12}>
                      <CodeEditor
                        code={FilteringTableRaw}
                        language={'javascript'}
                        height="620px"
                        width="800px"
                      />
                    </GridItem>
                  </Grid>
                </StackItem>
              </Stack>
            </Bullseye>
          </Card>
        </SplitItem>
      </Split>
    </QueryClientProvider>
  )
}

export default App
