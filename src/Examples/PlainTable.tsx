import DeclarativeTable from "../DeclarativeTable/DeclarativeTable";

type Tree = {
    common_name: string,
    scientific_name: string,
    primary_type: string,
}

const PlainTable = () => {
    const TABLE_DATA = [
        {
            common_name: "Oak",
            scientific_name: "Quercus",
            primary_type: "Deciduous",
        },
        {
            common_name: "Maple",
            scientific_name: "Acer",
            primary_type: "Deciduous",
        },
        {
            common_name: "Pine",
            scientific_name: "Pinus",
            primary_type: "Coniferous",
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

    const TABLE_DATA_MAPPER = (row: Tree) => ({
        cells: [
            row.common_name,
            row.scientific_name,
            row.primary_type
        ],
        key: row.common_name
    });

    return (
        <DeclarativeTable
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

export default PlainTable;
