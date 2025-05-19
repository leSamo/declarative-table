import DeclarativeTable from "../DeclarativeTable/DeclarativeTable";

const ExpandableTable = () => {

    const TABLE_DATA = [
        {
            "Common Name": "Oak",
            "Scientific Name (Genus)": "Quercus",
            "Primary Type": "Deciduous",
            "Key Characteristics / Examples": "Produces acorns, strong hardwood, many species (Red Oak, White Oak)"
        },
        {
            "Common Name": "Maple",
            "Scientific Name (Genus)": "Acer",
            "Primary Type": "Deciduous",
            "Key Characteristics / Examples": "Often have vibrant fall colors, winged seeds (samaras), some produce sap for syrup (Sugar Maple)"
        },
        {
            "Common Name": "Pine",
            "Scientific Name (Genus)": "Pinus",
            "Primary Type": "Coniferous",
            "Key Characteristics / Examples": "Evergreen, cone-bearing, important for timber (Scots Pine, White Pine)"
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
        key: row["Common Name"],
        expandableContent: row["Key Characteristics / Examples"]
    });

    return (
        <DeclarativeTable
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
