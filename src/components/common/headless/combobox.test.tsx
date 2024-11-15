import React from 'react';
import {
  Combobox,
  ComboboxItem,
  ComboboxMode,
} from '@src/components/common/headless/combobox';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const fakeItems: ComboboxItem[] = [
  { value: 'value1', label: 'label1', dropdownLabel: 'dropdownLabel1' },
  { value: 'value2', label: 'label2' },
  { value: 'value3', label: 'label3', dropdownLabel: 'dropdownLabel3' },
  {
    value: 'some_value',
    label: 'something_else',
    dropdownLabel: 'something_else',
  },
];

describe('Combobox', () => {
  const fakeCallback = jest.fn();

  it('should render the Combobox in implicit FILTER mode and filter the items properly', async () => {
    const combobox = render(
      <Combobox onChange={fakeCallback} items={fakeItems} />,
    );

    const textInput = combobox.container.querySelector('input');
    await userEvent.type(textInput, 'label');

    expect(combobox.queryByText('dropdownLabel1')).toBeInTheDocument();

    expect(combobox.queryByText('dropdownLabel2')).not.toBeInTheDocument();
    expect(combobox.queryByText('label2')).toBeInTheDocument();

    expect(combobox.queryByText('something_else')).not.toBeInTheDocument();
  });

  it('should allow creation of custom items', async () => {
    const combobox = render(
      <Combobox onChange={fakeCallback} items={fakeItems} allowCustom />,
    );

    const textInput = combobox.container.querySelector('input');
    await userEvent.type(textInput, 'newItem');

    const newItem = combobox.queryByText('"newItem"');

    expect(newItem).toBeInTheDocument();

    await userEvent.click(newItem);

    expect(fakeCallback).toHaveBeenCalledWith({
      label: 'newItem',
    });
  });

  it('should fetch items in the FETCH mode', async () => {
    const mockFetchFunction = jest.fn((_: string) =>
      Promise.resolve([{ label: 'my-queried-item', value: 'item-1' }]),
    );
    const combobox = render(
      <Combobox
        onChange={fakeCallback}
        mode={ComboboxMode.FETCH}
        fetchFunction={mockFetchFunction}
      />,
    );

    await userEvent.type(combobox.container.querySelector('input'), 'que');

    expect(await combobox.findByText('my-queried-item')).toBeInTheDocument();
    expect(mockFetchFunction).toHaveBeenCalledWith('que');
  });
});
