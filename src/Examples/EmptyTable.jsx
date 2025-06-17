import { EmptyState, EmptyStateBody, EmptyStateHeader, EmptyStateIcon } from "@patternfly/react-core";
import DeclarativeTable from "../DeclarativeTable/DeclarativeTable";
import { CubesIcon } from "@patternfly/react-icons";

const EmptyTable = () => {
    const TABLE_COLUMNS = [
        {
            title: 'Common Name',
            key: 'common_name'
        },
        {
            title: 'Scientific Name (Genus)',
            key: 'scientific_name'
        },
        {
            title: 'Primary Type',
            key: 'primary_type'
        }
    ];

    return (
        <DeclarativeTable
            rows={[]}
            columns={TABLE_COLUMNS}
            meta={{
                offset: 0,
                limit: 10,
                total_items: 0
            }}
            emptyState={
                <EmptyState variant="lg">
                    <EmptyStateHeader
                        titleText="No items found"
                        headingLevel="h5"
                        icon={<EmptyStateIcon icon={CubesIcon} />}
                    />
                    <EmptyStateBody>
                        Try again later
                    </EmptyStateBody>
                </EmptyState>
            }
        />
    )
}

export default EmptyTable;
