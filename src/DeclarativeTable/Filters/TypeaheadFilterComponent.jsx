import React, { useEffect, useState } from "react";
import { Button, MenuToggle, Select, SelectList, SelectOption, TextInputGroup, TextInputGroupMain, TextInputGroupUtilities } from "@patternfly/react-core";
import { TimesIcon } from "@patternfly/react-icons";

const TypeaheadFilterComponent = ({ inputValue, setInputValue, items, setItems, fetchItems, onValuesChanged, value, placeholder }) => {
    const [isOpen, setOpen] = useState(false);
    const selected = value?.split(",") ?? [];

    useEffect(() => {
        fetchItems(inputValue).then((items) => {
            if (!items.length) {
                setItems([
                    {
                        isDisabled: true,
                        label: `No results found for "${inputValue}"`,
                        value: 'no results'
                    }
                ]);
            }

            if (!isOpen) {
                setOpen(true);
            }

            setItems(items.map(item => ({ label: item, value: item })));
        });
    }, [inputValue]);

const onInputClick = () => {
    if (!isOpen) {
        setOpen(true);
    } else if (!inputValue) {
        setOpen(false);
    }
};

const onClearButtonClick = () => {
    onValuesChanged([]);
    setInputValue('');
};

const onSelect = (value) => {
    if (value && value !== 'no results') {
        onValuesChanged(
            selected.includes(value) ? selected.filter((selection) => selection !== value) : [...selected, value]
        );
    }
};

const toggle = (toggleRef) => (
    <MenuToggle
        variant="typeahead"
        aria-label="Multi typeahead checkbox menu toggle"
        onClick={() => setOpen(!isOpen)}
        innerRef={toggleRef}
        isExpanded={isOpen}
        isFullWidth
    >
        <TextInputGroup isPlain>
            <TextInputGroupMain
                value={inputValue}
                onClick={onInputClick}
                onChange={(e, value) => setInputValue(value)}
                id="multi-typeahead-select-checkbox-input"
                autoComplete="off"
                placeholder={placeholder}
                role="combobox"
                isExpanded={isOpen}
                aria-controls="select-multi-typeahead-checkbox-listbox"
            />
            <TextInputGroupUtilities {...(selected.length === 0 ? { style: { display: 'none' } } : {})}>
                <Button variant="plain" onClick={onClearButtonClick} aria-label="Clear input value">
                    <TimesIcon aria-hidden />
                </Button>
            </TextInputGroupUtilities>
        </TextInputGroup>
    </MenuToggle>
);

return (
    <Select
        role="menu"
        id="multi-typeahead-checkbox-select"
        isOpen={isOpen}
        selected={selected}
        onSelect={(_event, selection) => onSelect(selection)}
        onOpenChange={(isOpen) => {
            !isOpen && setOpen(false);
        }}
        toggle={toggle}
        shouldFocusFirstItemOnOpen={false}
    >
        <SelectList id="select-multi-typeahead-checkbox-listbox" style={{ maxHeight: 400, overflow: "scroll" }}>
            {items.map((option) => (
                <SelectOption
                    hasCheckbox={!option.isDisabled}
                    isSelected={selected.includes(option.value)}
                    key={option.value}
                    className={option.className}
                    id={option.value}
                    value={option.value}
                >
                    {option.label}
                </SelectOption>
            ))}
        </SelectList>
    </Select>
);
}

export default TypeaheadFilterComponent;
