import BaseTable from "../DeclarativeTable/BaseTable";

const ExpandableTable = () => {

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

    const TABLE_DATA_MAPPER = (row) => ({
        cells: [
            row["Common Name"],
            row["Scientific Name (Genus)"],
            row["Primary Type"]
        ],
        key: row["Common Name"]
    });

    return (
        <BaseTable
            isExpandable
            rows={TABLE_DATA.map(row => TABLE_DATA_MAPPER(row))}
            columns={TABLE_COLUMNS}
            meta={{
                offset: 0,
                limit: TABLE_DATA.length,
                total_items: TABLE_DATA.length
            }}
        />
    )
}

export default ExpandableTable;
