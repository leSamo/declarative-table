import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';

const checkboxFilter =
  ({ urlParam, label, value, placeholder, items, chipLabel, apply }) => {
    const onValuesChanged = (values) => {
      apply({
        [urlParam]: values.length === 0 ? undefined : values.join(','),
        offset: 0,
      });
    };

    const itemsWithFixedIcon = items.map(item => ({
      ...item,
      label: item.icon ? <span>{item.icon} {item.label}</span> : item.label,
      icon: undefined
    }));

    const filterConfig = {
      label,
      type: conditionalFilterType.checkbox,
      urlParam,
      key: urlParam,
      filterValues: {
        onChange: (event, value) => {
          onValuesChanged(value);
        },
        items: itemsWithFixedIcon,
        value: value ? value.split(',') : [],
        placeholder,
      },
    };

    const activeFiltersConfig = {
      isShown: !!value,
      onDelete: (chips) => {
        const itemsToRemove = chips.map((chip) => chip.value);

        const newValue = value
          .split(',')
          .filter((value) => !itemsToRemove.includes(value));

        onValuesChanged(newValue);
      },
      key: urlParam,
      category: chipLabel,
      chips: items
        .filter((item) => value?.split(',').includes(item.value))
        .map((item) => ({ name: item.label, value: item.value })),
    };

    return { filterConfig, activeFiltersConfig };
  };

export default checkboxFilter;
