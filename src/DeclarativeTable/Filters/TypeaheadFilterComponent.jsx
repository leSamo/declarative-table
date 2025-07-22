import React, { useEffect, useState } from "react";
import { Button, MenuToggle, Select, SelectList, SelectOption, TextInputGroup, TextInputGroupMain, TextInputGroupUtilities } from "@patternfly/react-core";
import { TimesIcon } from "@patternfly/react-icons";
import debounce from 'lodash/debounce';

const TypeaheadFilterComponent = ({ inputValue, setInputValue, items, setItems, fetchItems, onValuesChanged, value, placeholder, noItemsLabel }) => {
    const [isOpen, setOpen] = useState(false);
    const selected = value?.split(",") ?? [];

    const [debouncedFetchItems] = useState(() =>
        debounce((query) => {
            fetchItems(query).then((items) => {
                if (!items.length) {
                    setItems([
                        {
                            isDisabled: true,
                            label: `No results found for "${query}"`,
                            value: 'no results'
                        }
                    ]);
                }

                if (!isOpen) {
                    setOpen(true);
                }

                setItems(items.map(item => ({ label: item, value: item })));
            });
        }, 400)
    );

    useEffect(() => {
        debouncedFetchItems(inputValue);
    }, [inputValue]);

    const onInputClick = () => {
        if (!isOpen) {
            setOpen(true);
        } else if (!inputValue) {
            setOpen(false);
        }
    };

    const onClearButtonClick = () => {
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
            aria-label="Typeahead filter"
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
                    id="typeahead-filter"
                    autoComplete="off"
                    placeholder={placeholder}
                    role="combobox"
                    isExpanded={isOpen}
                    aria-controls="typeahead-filter"
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
            id="typeahead-filter-select"
            isOpen={isOpen}
            selected={selected}
            onSelect={(_event, selection) => onSelect(selection)}
            onOpenChange={(isOpen) => {
                !isOpen && setOpen(false);
            }}
            toggle={toggle}
            shouldFocusFirstItemOnOpen={false}
        >
            <SelectList id="typeahead-filter" style={{ maxHeight: 400, overflow: "scroll" }}>
                {items.length === 0
                    ? <span style={{ color: 'var(--pf-v5-global--Color--200)', marginLeft: 8 }}>{noItemsLabel}</span>
                    : items.map((option) => (
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
                    ))
                }
            </SelectList>
        </Select>
    );
}

export default TypeaheadFilterComponent;
