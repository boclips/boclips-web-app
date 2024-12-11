import ViewButtons, {
  VIEW_TYPE_ITEM,
} from '@components/searchResults/ViewButtons';

import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { lastEvent } from '@src/testSupport/lastEvent';

describe('Layout buttons', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('can load chosen view from local storage', () => {
    const onChange = vi.fn();
    localStorage.setItem(VIEW_TYPE_ITEM, 'GRID');

    render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <ViewButtons onChange={onChange} />
      </BoclipsClientProvider>,
    );
    expect(onChange).toBeCalled();
    expect(onChange).toBeCalledWith('GRID');
  });

  it('defaults to list when there is rubbish in local storage', () => {
    const onChange = vi.fn();
    localStorage.setItem(VIEW_TYPE_ITEM, 'nanana');

    render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <ViewButtons onChange={onChange} />
      </BoclipsClientProvider>,
    );
    expect(onChange).toBeCalled();
    expect(onChange).toBeCalledWith('LIST');
  });

  it('defaults to list when there is no value in local storage', () => {
    const onChange = vi.fn();

    render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <ViewButtons onChange={onChange} />
      </BoclipsClientProvider>,
    );
    expect(onChange).toBeCalled();
    expect(onChange).toBeCalledWith('LIST');
  });

  it('updates value when choosing different layout', () => {
    const onChange = vi.fn();
    localStorage.setItem(VIEW_TYPE_ITEM, 'GRID');

    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <ViewButtons onChange={onChange} />
      </BoclipsClientProvider>,
    );

    await userEvent.click(wrapper.getByTestId('list-view-button'));

    expect(onChange).toBeCalledTimes(2);

    // mock.calls[nth-call][nth-argument]
    expect(onChange.mock.calls[0][0]).toEqual('GRID');
    expect(onChange.mock.calls[1][0]).toEqual('LIST');
    expect(localStorage.getItem(VIEW_TYPE_ITEM)).toEqual('LIST');
  });

  it('non-chosen layout button is outlined', () => {
    const onChange = vi.fn();

    const wrapper = render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <ViewButtons onChange={onChange} />
      </BoclipsClientProvider>,
    );

    expect(
      wrapper.getByTestId('grid-view-button').className.includes('outline'),
    ).toBeTruthy();
    expect(
      wrapper.getByTestId('list-view-button').className.includes('outline'),
    ).toBeFalsy();

    await userEvent.click(wrapper.getByTestId('grid-view-button'));

    expect(
      wrapper.getByTestId('grid-view-button').className.includes('outline'),
    ).toBeFalsy();
    expect(
      wrapper.getByTestId('list-view-button').className.includes('outline'),
    ).toBeTruthy();
  });

  describe('events', () => {
    const client = new FakeBoclipsClient();
    beforeEach(() => {
      client.clear();
    });

    it('emits events when clicking a button changes view type', () => {
      const wrapper = render(
        <BoclipsClientProvider client={client}>
          <ViewButtons onChange={vi.fn()} />
        </BoclipsClientProvider>,
      );

      await userEvent.click(wrapper.getByTestId('grid-view-button'));

      expect(lastEvent(client)).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'SEARCH_VIEW_CHANGED_TO_GRID',
        anonymous: false,
      });

      await userEvent.click(wrapper.getByTestId('list-view-button'));

      expect(lastEvent(client)).toEqual({
        type: 'PLATFORM_INTERACTED_WITH',
        subtype: 'SEARCH_VIEW_CHANGED_TO_LIST',
        anonymous: false,
      });
    });

    it('clicking on a view that is already in use wont trigger event', () => {
      localStorage.setItem(VIEW_TYPE_ITEM, 'GRID');

      const wrapper = render(
        <BoclipsClientProvider client={client}>
          <ViewButtons onChange={vi.fn()} />
        </BoclipsClientProvider>,
      );

      await userEvent.click(wrapper.getByTestId('grid-view-button'));

      expect(client.events.getEvents()).toHaveLength(0);
    });

    it('value from storage is not emitted as event every time', () => {
      render(
        <BoclipsClientProvider client={client}>
          <ViewButtons onChange={vi.fn()} />
        </BoclipsClientProvider>,
      );

      expect(client.events.getEvents()).toHaveLength(0);
    });
  });
});
