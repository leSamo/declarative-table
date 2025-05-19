import { Bullseye, Stack, StackItem, TextContent, Text, Split, SplitItem, Card } from '@patternfly/react-core'
import '@patternfly/react-core/dist/styles/base.css';
import { CodeEditor } from '@patternfly/react-code-editor';

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

function App() {
  return (
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
          </TextContent>
        </Card>
      </SplitItem>
      <SplitItem>
        <Card style={{ height: '100%', padding: 16, marginTop: 16, marginRight: 16, marginBottom: 16, marginLeft: 200 }}>
          <Bullseye>
            <Stack hasGutter>
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
                    <ul>
                      <li><code><b>isLoading</b> : boolean</code> -- if true substitutes the table with skeleton table; columns and meta.limit props are important since they influence the look of the skeleton table</li>
                      <li><code><b>isExpandable</b> : boolean</code> -- if true adds a expand toggle to each row of the table and a bulk expand toggle to the header. The content of the expandable section is controlled by <code>expandableContent</code> prop in the row mapper.</li>
                      <li><code><b>isSelectable</b> : boolean</code> -- if true adds a select checkbox to each row of the table and a bulk select page and bulk select none action to the toolbar. Does not add bulk select all action.</li>
                    </ul>
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
                <Split hasGutter>
                  <SplitItem>
                    <div style={{ width: 800, border: "solid 2px gray" }}>
                      <PlainTable />
                    </div>
                  </SplitItem>
                  <SplitItem>
                    <CodeEditor
                      code={PlainTableRaw}
                      language={'javascript'}
                      height="620px"
                      width="800px"
                    />
                  </SplitItem>
                </Split>
              </StackItem>
              <StackItem>
                <TextContent>
                  <Text component="h2" id="loading-table">
                    Loading table
                  </Text>
                </TextContent>
              </StackItem>
              <StackItem>
                <Split hasGutter>
                  <SplitItem>
                    <div style={{ width: 800, border: "solid 2px gray" }}>
                      <LoadingTable />
                    </div>
                  </SplitItem>
                  <SplitItem>
                    <CodeEditor
                      code={LoadingTableRaw}
                      language={'javascript'}
                      height="620px"
                      width="800px"
                    />
                  </SplitItem>
                </Split>
              </StackItem>
              <StackItem>
                <TextContent>
                  <Text component="h2" id="manageable-columns">
                    Manageable columns
                  </Text>
                </TextContent>
              </StackItem>
              <StackItem>
                <Split hasGutter>
                  <SplitItem>
                    <div style={{ width: 800, border: "solid 2px gray" }}>
                      <ManageableColumnsTable />
                    </div>
                  </SplitItem>
                  <SplitItem>
                    <CodeEditor
                      code={ManageableColumnsTableRaw}
                      language={'javascript'}
                      height="620px"
                      width="800px"
                    />
                  </SplitItem>
                </Split>
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
                <Split hasGutter>
                  <SplitItem>
                    <div style={{ width: 800, border: "solid 2px gray" }}>
                      <ExpandableTable />
                    </div>
                  </SplitItem>
                  <SplitItem>
                    <CodeEditor
                      code={ExpandableTableRaw}
                      language={'javascript'}
                      height="620px"
                      width="800px"
                    />
                  </SplitItem>
                </Split>
              </StackItem>
              <StackItem>
                <TextContent>
                  <Text component="h2" id="selectable-table">
                    Selectable table
                  </Text>
                </TextContent>
              </StackItem>
              <StackItem>
                <Split hasGutter>
                  <SplitItem>
                    <div style={{ width: 800, border: "solid 2px gray" }}>
                      <SelectableTable />
                    </div>
                  </SplitItem>
                  <SplitItem>
                    <CodeEditor
                      code={SelectableTableRaw}
                      language={'javascript'}
                      height="620px"
                      width="800px"
                    />
                  </SplitItem>
                </Split>
              </StackItem>
            </Stack>
          </Bullseye>
        </Card>
      </SplitItem>
    </Split >
  )
}

export default App
