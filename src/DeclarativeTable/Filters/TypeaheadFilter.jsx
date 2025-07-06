import { useState } from 'react';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import TypeaheadFilterComponent from './TypeaheadFilterComponent';

const useTypeaheadFilter =
  ({ urlParam, label, value, placeholder, chipLabel, noItemsLabel = "No items", apply, fetchItems }) => {
    const [items, setItems] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const onValuesChanged = (values) => {
      apply({
        [urlParam]: values.length === 0 ? undefined : values.join(','),
        offset: 0,
      });
    };

    const filterConfig = {
      label,
      type: conditionalFilterType.custom,
      urlParam,
      key: urlParam,
      filterValues: {
        children:
          <TypeaheadFilterComponent
            inputValue={inputValue}
            setInputValue={setInputValue}
            items={items}
            setItems={setItems}
            fetchItems={fetchItems}
            onValuesChanged={onValuesChanged}
            value={value}
            placeholder={placeholder}
            noItemsLabel={noItemsLabel}
          />
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
      chips: items // TODO: Entered text filters out chips
        .filter((item) => value?.split(',').includes(item.value))
        .map((item) => ({ name: item.label, value: item.value })),
    };

    return { filterConfig, activeFiltersConfig };
  };

export default useTypeaheadFilter;
