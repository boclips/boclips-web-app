import React from 'react';
import { render } from '@testing-library/react';
import YesNo from 'src/components/common/yesNo/YesNo';
import userEvent from '@testing-library/user-event';

describe('YesNo', () => {
  it('displays the provided label', () => {
    const wrapper = render(
      <form>
        <YesNo
          id="the-question"
          label="Should I eat a donut?"
          onValueChange={jest.fn()}
        />
      </form>,
    );

    expect(wrapper.getByText('Should I eat a donut?')).toBeVisible();
  });

  it('yields value changes', async () => {
    const valueChangeHandler = jest.fn();
    const wrapper = render(
      <form>
        <YesNo
          id="the-question"
          label="Should I eat a donut?"
          onValueChange={valueChangeHandler}
        />
      </form>,
    );

    await userEvent.click(wrapper.getByLabelText('Yes'));
    expect(valueChangeHandler).toHaveBeenCalledWith(true);
    await userEvent.click(wrapper.getByLabelText('No'));
    expect(valueChangeHandler).toHaveBeenLastCalledWith(false);
  });

  it('uses default value if provided', () => {
    const wrapper = render(
      <form>
        <YesNo
          id="the-question"
          label="Should I eat a donut?"
          onValueChange={jest.fn()}
          defaultValue
        />
      </form>,
    );

    expect(wrapper.getByLabelText('Yes')).toBeChecked();
    expect(wrapper.getByLabelText('No')).not.toBeChecked();
  });
});
