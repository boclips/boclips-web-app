import React from 'react';
import { render, screen } from '@testing-library/react';
import DateSelect from './ReleaseDateFilter';

describe('date-select', () => {
  it('renders date select', () => {
    render(<DateSelect label="date-select" onChange={vi.fn()} />);
    expect(screen.getByText('date-select')).toBeInTheDocument();
  });

  it('adds onChange event listener', () => {
    const spy = vi.fn();

    render(<DateSelect label="date-select" id="date" onChange={spy} />);

    const duetChangeEvent = new Event('duetChange');

    screen
      .getByText('date-select')
      .lastElementChild.dispatchEvent(duetChangeEvent);

    expect(spy).toHaveBeenCalled();
  });
});
