import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

const hierarchyFilter = ({ label, value, urlParam, placeholder, chipLabel, groups, apply }) => {
    const minorItems = groups.map(group => group.children).flat();

    const toString = (filterValuesObject) => {
        if (filterValuesObject === undefined) {
            return "";
        }
        else {
            return Object.values(filterValuesObject).map(minorObject => Object.keys(minorObject).filter(key => minorObject[key] === true)).flat().join(',');
        }
    }

    const toObject = (string) => {
        if (typeof (string) !== 'string') return;

        const minorObjects = string.split(',');
        let majorObjects;

        try {
            majorObjects = minorObjects.map(minorObject => groups.find(group => group.children.map(ch => ch.id).includes(minorObject)).id);
        }
        catch {
            return;
        }

        const filterValuesString = {};

        minorObjects.forEach((minorObject, index) => {
            const majorObject = majorObjects[index];

            if (filterValuesString[majorObject] === undefined) {
                filterValuesString[majorObject] = {};
            }

            filterValuesString[majorObject][minorObject] = true;
        })

        return filterValuesString;
    }

    const onValuesChanged = (values) => {
        apply({
            [urlParam]: toString(values) || undefined,
            offset: 0,
        });
    };

    const filterConfig = {
        label,
        type: conditionalFilterType.group,
        urlParam,
        key: urlParam,
        filterValues: {
            onChange: (_event, value) => {
                onValuesChanged(value);
            },
            placeholder,
            groups,
            selected: toObject(value)
        }
    };

    const activeFiltersConfig = {
        isShown: !!value,
        key: urlParam,
        category: chipLabel,
        onDelete: (chips) => {
            const itemsToRemove = chips.map((chip) => chip.value);

            const newValue = value
                .split(',')
                .filter((value) => !itemsToRemove.includes(value));

            onValuesChanged(toObject(newValue.join(',')));
        },
        chips: minorItems
            .filter((item) => value?.split(',').includes(item.value))
            .map((item) => ({ name: item.name, value: item.value })),
    };

    return { filterConfig, activeFiltersConfig };
};

export default hierarchyFilter;
