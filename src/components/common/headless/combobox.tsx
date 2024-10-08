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
import PlusIcon from 'src/resources/icons/plus-sign.svg';
import c from 'classnames';
import s from './style.module.less';

export enum Placement {
  TOP = 'UP',
  BOTTOM = 'DOWN',
}

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
  errorMessagePlacement?: Placement;
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
  errorMessagePlacement = Placement.BOTTOM,
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

  useEffect(() => {
    // eslint-disable-next-line consistent-return
    function handleSearch() {
      if (mode === ComboboxMode.FETCH) {
        const timer = setTimeout(async () => {
          if (fetchFunction && query.length >= MINIMUM_SEARCH_LENGTH) {
            const newFilteredItems = await fetchFunction(query);
            setFilteredItems(newFilteredItems);
          }
        }, 300);
        return () => clearTimeout(timer);
      }

      const newFilteredItems =
        query === ''
          ? items
          : items.filter((item) => {
              return item.label.toLowerCase().includes(query.toLowerCase());
            });
      setFilteredItems(newFilteredItems);
    }

    handleSearch();
  }, [query, fetchFunction, mode]);

  return (
    <Field className="flex flex-col w-full space-y-2" data-qa={dataQa}>
      {isError && errorMessage && errorMessagePlacement === Placement.TOP && (
        <div className="flex text-[#DF0000] space-x-1 text-sm" role="alert">
          <span>
            <ErrorIcon />
          </span>
          <span>{errorMessage}</span>
        </div>
      )}
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
            className={c(
              isError && 'border-[#DF0000] border-[3px]',
              'rounded padding-2 h-12 w-full border-gray-600 border-2 focus-visible:border-4 focus-visible:border-blue-700',
            )}
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
              value={{ label: query, value: query }}
              className="data-[focus]:bg-blue-100 flex items-center p-2 space-x-1"
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
              className="data-[focus]:bg-blue-100 flex p-2"
            >
              {item.dropdownLabel ?? item.label}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </HeadlessCombobox>
      {isError &&
        errorMessage &&
        errorMessagePlacement === Placement.BOTTOM && (
          <div className="flex text-[#DF0000] space-x-1 text-sm" role="alert">
            <span>
              <ErrorIcon />
            </span>
            <span>{errorMessage}</span>
          </div>
        )}
    </Field>
  );
};
