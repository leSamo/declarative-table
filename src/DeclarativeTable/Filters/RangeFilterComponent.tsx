import React, { useState } from 'react';
import { Split, SplitItem, TextInput } from '@patternfly/react-core';
import { Select, SelectVariant } from '@patternfly/react-core/deprecated';

interface RangeFilterComponentProps {
  setValues: (values: { min: number; max: number }) => void;
  range: { min: number; max: number };
  minMaxLabels: { min: React.ReactNode; max: React.ReactNode };
  selectProps?: Record<string, any>;
  inputValue?: { min?: string; max?: string };
  setInputValue: (value: { min?: string; max?: string } | undefined) => void;
}

const RangeFilterComponent = ({
  setValues,
  range,
  minMaxLabels,
  selectProps,
  inputValue,
  setInputValue,
}: RangeFilterComponentProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const areValuesValid = (currentValues : { min?: string, max?: string } = {}, inputName: 'min' | 'max') => {
    const numberValue = {
      min: Number(currentValues.min),
      max: Number(currentValues.max),
    };

    return (
      currentValues[inputName] != '' &&
      numberValue[inputName] <= range.max &&
      numberValue[inputName] >= range.min &&
      numberValue.min <= numberValue.max
    );
  };

  const handleInputChange = (newValue: string, inputName: string) => {
    const newRange = { ...inputValue, [inputName]: newValue };

    if (areValuesValid(newRange, 'min') && areValuesValid(newRange, 'max')) {
      setValues({
        min: Number(newRange.min),
        max: Number(newRange.max),
      });
    }

    setInputValue(newRange);
  };

  const filterContent = (
    <Split style={{ margin: 16 }}>
      <SplitItem>
        <span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
          {minMaxLabels.min}
        </span>
        <br />
        <TextInput
          type="number"
          onChange={(_event, value) => handleInputChange(value, 'min')}
          validated={areValuesValid(inputValue, 'min') ? 'default' : 'error'}
          className="range-filter-input"
          id="range-filter-input-min"
          value={inputValue?.min}
        />
      </SplitItem>
      <SplitItem>
        <br />
        <span style={{ margin: 8 }}>-</span>
      </SplitItem>
      <SplitItem>
        <span style={{ fontSize: 'var(--pf-v5-global--FontSize--sm)' }}>
          {minMaxLabels.max}
        </span>
        <br />
        <TextInput
          type="number"
          onChange={(_event, value) => handleInputChange(value, 'max')}
          validated={areValuesValid(inputValue, 'max') ? 'default' : 'error'}
          className="range-filter-input"
          id="range-filter-input-max"
          value={inputValue?.max}
        />
      </SplitItem>
    </Split>
  );

  return (
    <Select
      variant={SelectVariant.single}
      aria-label="Select Input"
      customContent={filterContent}
      onToggle={() => setOpen(!isOpen)}
      isOpen={isOpen}
      width="auto"
      {...selectProps}
    />
  );
};

export default RangeFilterComponent;
