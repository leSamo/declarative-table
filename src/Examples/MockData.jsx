export const MOCK_TABLE_DATA = [
    {
        "Common Name": "Oak",
        "Scientific Name (Genus)": "Quercus",
        "Primary Type": "Deciduous",
        "Leaf Type": "Broadleaf",
        "Key Characteristics / Examples": "Produces acorns, strong hardwood, many species (Red Oak, White Oak)"
    },
    {
        "Common Name": "Maple",
        "Scientific Name (Genus)": "Acer",
        "Primary Type": "Deciduous",
        "Leaf Type": "Broadleaf (palmate)",
        "Key Characteristics / Examples": "Often have vibrant fall colors, winged seeds (samaras), some produce sap for syrup (Sugar Maple)"
    },
    {
        "Common Name": "Pine",
        "Scientific Name (Genus)": "Pinus",
        "Primary Type": "Coniferous",
        "Leaf Type": "Needles (in clusters)",
        "Key Characteristics / Examples": "Evergreen, cone-bearing, important for timber (Scots Pine, White Pine)"
    },
    {
        "Common Name": "Spruce",
        "Scientific Name (Genus)": "Picea",
        "Primary Type": "Coniferous",
        "Leaf Type": "Needles (single)",
        "Key Characteristics / Examples": "Evergreen, cone-bearing, sharp needles, often pyramidal shape (Norway Spruce, Blue Spruce)"
    },
    {
        "Common Name": "Birch",
        "Scientific Name (Genus)": "Betula",
        "Primary Type": "Deciduous",
        "Leaf Type": "Broadleaf",
        "Key Characteristics / Examples": "Often has distinctive white, silver, or yellow peeling bark (Paper Birch, Silver Birch)"
    },
    {
        "Common Name": "Fir",
        "Scientific Name (Genus)": "Abies",
        "Primary Type": "Coniferous",
        "Leaf Type": "Needles (flat, soft)",
        "Key Characteristics / Examples": "Evergreen, cones typically stand upright on branches, often used as Christmas trees (Balsam Fir, Douglas Fir - though Pseudotsuga is a distinct genus)"
    },
    {
        "Common Name": "Willow",
        "Scientific Name (Genus)": "Salix",
        "Primary Type": "Deciduous",
        "Leaf Type": "Broadleaf (often narrow)",
        "Key Characteristics / Examples": "Typically grows near water, flexible branches (Weeping Willow, Pussy Willow)"
    },
    {
        "Common Name": "Apple",
        "Scientific Name (Genus)": "Malus",
        "Primary Type": "Deciduous",
        "Leaf Type": "Broadleaf",
        "Key Characteristics / Examples": "Cultivated for its fruit, spring blossoms (various apple cultivars)"
    },
    {
        "Common Name": "Cherry",
        "Scientific Name (Genus)": "Prunus",
        "Primary Type": "Deciduous",
        "Leaf Type": "Broadleaf",
        "Key Characteristics / Examples": "Known for spring blossoms and fruit (cherries, plums, peaches in this genus)"
    },
    {
        "Common Name": "Cedar",
        "Scientific Name (Genus)": "Cedrus (True Cedars)",
        "Primary Type": "Coniferous",
        "Leaf Type": "Needles",
        "Key Characteristics / Examples": "Evergreen, aromatic wood, barrel-shaped cones (Cedar of Lebanon, Atlas Cedar). Note: Many trees called \"cedar\" (e.g., Western Red Cedar) are in other genera."
    },
    {
        "Common Name": "Poplar",
        "Scientific Name (Genus)": "Populus",
        "Primary Type": "Deciduous",
        "Leaf Type": "Broadleaf",
        "Key Characteristics / Examples": "Fast-growing, includes cottonwoods and aspens (Lombardy Poplar, Quaking Aspen)"
    },
    {
        "Common Name": "Ash",
        "Scientific Name (Genus)": "Fraxinus",
        "Primary Type": "Deciduous",
        "Leaf Type": "Broadleaf (compound)",
        "Key Characteristics / Examples": "Strong, elastic wood, seeds are single samaras (White Ash, European Ash)"
    }
]

export const MOCK_TABLE_COLUMNS = [
    {
        title: 'Common Name',
        isShown: true,
    },
    {
        title: 'Scientific Name (Genus)',
        isShown: true,
    },
    {
        title: 'Primary Type',
        isShown: true,
    },
    {
        title: 'Leaf Type',
        isShown: true,
    },
]

export const MOCK_TABLE_COLUMNS_COLUMN_MGMT = [
    {
        title: 'Common Name',
        isShown: true,
        isUntoggleable: true,
        isShownByDefault: true
    },
    {
        title: 'Scientific Name (Genus)',
        isShown: true,
        isShownByDefault: true
    },
    {
        title: 'Primary Type',
        isShown: true,
        isShownByDefault: true
    },
    {
        title: 'Leaf Type',
        isShown: false,
        isShownByDefault: false
    },
]

export const MOCK_TABLE_DATA_MAPPER = (row) => ({
    cells: [
        row["Common Name"],
        row["Scientific Name (Genus)"],
        row["Primary Type"],
        row["Leaf Type"]
    ]
});