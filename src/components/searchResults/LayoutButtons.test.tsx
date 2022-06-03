import ViewButtons, {
  VIEW_TYPE_ITEM,
} from 'src/components/searchResults/ViewButtons';

import { fireEvent, render } from '@testing-library/react';
import React from 'react';

describe('Layout buttons', () => {
  it('can load chosen view from local storage', () => {
    const onChange = jest.fn();
    localStorage.setItem(VIEW_TYPE_ITEM, 'GRID');

    render(<ViewButtons onChange={onChange} />);
    expect(onChange).toBeCalled();
    expect(onChange).toBeCalledWith('GRID');
  });

  it('defaults to list when there is rubbish in local storage', () => {
    const onChange = jest.fn();
    localStorage.setItem(VIEW_TYPE_ITEM, 'nanana');

    render(<ViewButtons onChange={onChange} />);
    expect(onChange).toBeCalled();
    expect(onChange).toBeCalledWith('LIST');
  });

  it('defaults to list when there is no value in local storage', () => {
    const onChange = jest.fn();

    render(<ViewButtons onChange={onChange} />);
    expect(onChange).toBeCalled();
    expect(onChange).toBeCalledWith('LIST');
  });

  it('updates value when choosing different layout', () => {
    const onChange = jest.fn();
    localStorage.setItem(VIEW_TYPE_ITEM, 'GRID');

    const wrapper = render(<ViewButtons onChange={onChange} />);

    fireEvent.click(wrapper.getByTestId('list-view-button'));

    expect(onChange).toBeCalledTimes(2);

    // mock.calls[nth-call][nth-argument]
    expect(onChange.mock.calls[0][0]).toEqual('GRID');
    expect(onChange.mock.calls[1][0]).toEqual('LIST');
    expect(localStorage.getItem(VIEW_TYPE_ITEM)).toEqual('LIST');
  });

  it('non-chosen layout button is outlined', () => {
    const onChange = jest.fn();

    const wrapper = render(<ViewButtons onChange={onChange} />);

    expect(
      wrapper.getByTestId('grid-view-button').className.includes('outline'),
    ).toBeTruthy();
    expect(
      wrapper.getByTestId('list-view-button').className.includes('outline'),
    ).toBeFalsy();

    fireEvent.click(wrapper.getByTestId('grid-view-button'));

    expect(
      wrapper.getByTestId('grid-view-button').className.includes('outline'),
    ).toBeFalsy();
    expect(
      wrapper.getByTestId('list-view-button').className.includes('outline'),
    ).toBeTruthy();
  });
});
