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
import ChevronDownIcon from '@src/resources/icons/chevron-down.svg';
import ErrorIcon from '@src/resources/icons/error-icon.svg';
import PlusIcon from '@src/resources/icons/plus-sign.svg';
import s from './style.module.less';

export enum ComboboxMode {
  FILTER = 'FILTER',
  FETCH = 'FETCH',
}

const MINIMUM_SEARCH_LENGTH = 3;

export interface ComboboxItem {
  label: string;
  value: string;
  dropdownLabel?: string | React.JSX.Element;
}

interface BaseComboboxProps {
  allowCustom?: boolean;
  onChange: (value: ComboboxItem) => void;
  label?: string;
  placeholder?: string;
  isError?: boolean;
  errorMessage?: string;
  dataQa?: string;
}

interface FilterComboboxProps extends BaseComboboxProps {
  mode?: ComboboxMode.FILTER;
  items: ComboboxItem[];
  fetchFunction?: never;
}

interface FetchComboboxProps extends BaseComboboxProps {
  mode: ComboboxMode.FETCH;
  items?: never;
  fetchFunction: (query: string) => Promise<ComboboxItem[]>;
}

type ComboboxProps = FetchComboboxProps | FilterComboboxProps;

export const Combobox = ({
  allowCustom = false,
  onChange,
  items = [],
  label,
  placeholder,
  isError,
  errorMessage,
  mode = ComboboxMode.FILTER,
  fetchFunction,
  dataQa,
}: ComboboxProps) => {
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<ComboboxItem[]>(items);
  const [selectedItem, setSelectedItem] = useState<ComboboxItem>({
    label: '',
    value: '',
  });

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (mode === ComboboxMode.FETCH) {
      setTimeout(async () => {
        if (fetchFunction && query.length >= MINIMUM_SEARCH_LENGTH) {
          const newFilteredItems = await fetchFunction(query);
          setFilteredItems(newFilteredItems);
        }
      }, 300);
    }

    setFilteredItems(
      query === ''
        ? items
        : items.filter((item) => {
            return item.label.toLowerCase().includes(query.toLowerCase());
          }),
    );
  }, [query, fetchFunction, mode]);

  return (
    <Field className="flex flex-col w-full space-y-2" data-qa={dataQa}>
      {label && <Label>{label}</Label>}
      <HeadlessCombobox
        value={selectedItem}
        onChange={(newValue) => {
          setSelectedItem(newValue);
          onChange(newValue);
        }}
        onClose={() => setQuery('')}
      >
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
          {allowCustom && query.length > 0 && (
            <ComboboxOption
              value={{ label: query }}
              className={s.comboboxOption}
              data-qa={`${dataQa}-custom-option`}
            >
              <div className="bg-blue-700 rounded p-1">
                <PlusIcon className="w-3 h-3" />
              </div>
              <span>
                <span className="font-bold">{` "${query}"`}</span>
              </span>
            </ComboboxOption>
          )}
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
