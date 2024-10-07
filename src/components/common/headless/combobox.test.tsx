import React from 'react';
import {
  Combobox,
  ComboboxItem,
  ComboboxMode,
} from 'src/components/common/headless/combobox';
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

const mockFetchFunction = (query: string): Promise<ComboboxItem[]> =>
  Promise.resolve(fakeItems.filter((item) => item.label.includes(query)));

describe('Combobox', () => {
  const fakeCallback = jest.fn();

  it('Should render the Combobox in implicit FILTER mode and filter the items properly', async () => {
    const combobox = render(
      <Combobox onChange={fakeCallback} items={fakeItems} />,
    );

    const textInput = combobox.container.querySelector('input');
    await userEvent.type(textInput, 'label');
    // await userEvent.change(textInput, { target: { value: 'label' } });

    expect(combobox.queryByText('dropdownLabel1')).toBeInTheDocument();

    expect(combobox.queryByText('dropdownLabel2')).not.toBeInTheDocument();
    expect(combobox.queryByText('label2')).toBeInTheDocument();

    expect(combobox.queryByText('something_else')).not.toBeInTheDocument();
  });

  it('Should allow creation of custom items', async () => {
    const combobox = render(
      <Combobox onChange={fakeCallback} items={fakeItems} allowCustom />,
    );

    const textInput = combobox.container.querySelector('input');
    await userEvent.type(textInput, 'newItem');

    const newItem = combobox.queryByText('"newItem"');

    expect(newItem).toBeInTheDocument();

    await userEvent.click(newItem);

    expect(fakeCallback).toHaveBeenCalledWith('newItem');
  });

  it('Should fetch items in the FETCH mode', async () => {
    const combobox = render(
      <Combobox
        onChange={fakeCallback}
        mode={ComboboxMode.FETCH}
        fetchFunction={mockFetchFunction}
      />,
    );

    const textInput = combobox.container.querySelector('input');
    await userEvent.type(textInput, 'something_else');

    const newItem = await combobox.findByText('something_else');

    expect(newItem).toBeInTheDocument();
  });
});
