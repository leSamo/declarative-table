import { useEffect, useState } from "react";
import DeclarativeTable from "../DeclarativeTable/DeclarativeTable";
import { Fragment } from "react";
import { Switch } from "@patternfly/react-core";

const ManageableColumnsTable = () => {
    const TABLE_COLUMNS = [
        {
            title: 'Common Name',
            key: 'common_name',
            isShown: true,
            isUntoggleable: true,
            isShownByDefault: true
        },
        {
            title: 'Scientific Name (Genus)',
            key: 'scientific_name',
            isShown: true,
            isShownByDefault: true
        },
        {
            title: 'Primary Type',
            key: 'primary_type',
            isShown: true,
            isShownByDefault: true
        }
    ];

    const [columnMgmtColumns, setColumnMgmtColumns] = useState(TABLE_COLUMNS);
    const [showGenusColumn, setShowGenusColumn] = useState(true);

    useEffect(() => {
        setColumnMgmtColumns(prevColumns => {
            const newColumns = [...prevColumns];
            const index = newColumns.findIndex(col => col.key === 'scientific_name');
            newColumns[index].isRemoved = !showGenusColumn;
            return newColumns;
        });
    }, [showGenusColumn]);

    const TABLE_DATA = [
        {
            "Common Name": "Oak",
            "Scientific Name (Genus)": "Quercus",
            "Primary Type": "Deciduous",
        },
        {
            "Common Name": "Maple",
            "Scientific Name (Genus)": "Acer",
            "Primary Type": "Deciduous",
        },
        {
            "Common Name": "Pine",
            "Scientific Name (Genus)": "Pinus",
            "Primary Type": "Coniferous",
        },
    ];

    const TABLE_DATA_MAPPER = (row) => ({
        cells: [
            row["Common Name"],
            row["Scientific Name (Genus)"],
            row["Primary Type"]
        ],
        key: row["Common Name"]
    });

    return (
        <Fragment>
            <div style={{ margin: 16 }}>
            <Switch
                label="Show 'Scientific Name (Genus)' column feature flag"
                isChecked={showGenusColumn}
                onChange={(e, on) => setShowGenusColumn(on)}
                />
            </div>
            <DeclarativeTable
                areColumnsManageable
                rows={TABLE_DATA.map(row => TABLE_DATA_MAPPER(row))}
                columns={columnMgmtColumns}
                applyColumns={setColumnMgmtColumns}
                meta={{
                    offset: 0,
                    limit: TABLE_DATA.length,
                    total_items: TABLE_DATA.length
                }}
            />
        </Fragment>
    )
}

export default ManageableColumnsTable;
