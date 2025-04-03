import {
  Combobox as HeadlessCombobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Field,
  Label,
} from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import ChevronDownIcon from 'src/resources/icons/chevron-down.svg';
import ErrorIcon from 'src/resources/icons/error-icon.svg';
import s from './style.module.less';

export interface ComboboxItem {
  label: string;
  value: string;
  dropdownLabel?: string | React.JSX.Element;
}

interface MultiComboboxProps {
  onChange: (value: ComboboxItem[]) => void;
  label?: string;
  placeholder?: string;
  isError?: boolean;
  errorMessage?: string;
  dataQa?: string;
  items: ComboboxItem[];
}

export const MultiCombobox = ({
  onChange,
  items = [],
  label,
  placeholder,
  isError,
  errorMessage,
  dataQa,
}: MultiComboboxProps) => {
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<ComboboxItem[]>(items);
  const [selectedItems, setSelectedItems] = useState<ComboboxItem[]>([]);

  useEffect(() => {
    setFilteredItems(
      query === ''
        ? items
        : items.filter((item) => {
            return item.label.toLowerCase().includes(query.toLowerCase());
          }),
    );
  }, [query]);

  return (
    <Field className="flex flex-col w-full space-y-2" data-qa={dataQa}>
      {label && <Label>{label}</Label>}
      <HeadlessCombobox
        multiple
        value={selectedItems}
        onChange={(newValue) => {
          setSelectedItems(newValue);
          onChange(selectedItems);
        }}
        onClose={() => setQuery('')}
      >
        //TODO: remove later after debugging
        {selectedItems.length > 0 && (
          <ul>
            {selectedItems.map((item) => (
              <li key={item.value}>{item.label}</li>
            ))}
          </ul>
        )}
        <div className="relative">
          <ComboboxInput
            aria-label={label}
            className={`${s.combobox} ${isError ? s.error : ''}`}
            displayValue={(item: ComboboxItem) => item?.label ?? ''}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            data-qa="select"
          />
          <ComboboxButton className={s.chevron}>
            <ChevronDownIcon />
          </ComboboxButton>
        </div>
        <ComboboxOptions
          anchor="bottom"
          className={s.comboboxDropdownOptions}
          data-qa={`${dataQa}-options`}
        >
          {filteredItems.map((item) => (
            <ComboboxOption
              key={item.value}
              value={item}
              className={s.comboboxOption}
            >
              {item.dropdownLabel ?? item.label}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </HeadlessCombobox>
      {isError && errorMessage && (
        <div className={s.errorAlert} role="alert">
          <span>
            <ErrorIcon />
          </span>
          <span>{errorMessage}</span>
        </div>
      )}
    </Field>
  );
};
