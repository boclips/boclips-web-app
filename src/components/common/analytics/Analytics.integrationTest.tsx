import React from 'react';
import { trackPageRendered } from '@components/common/analytics/Analytics';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from '@src/testSupport/StubBoclipsSecurity';
import { PageRenderedRequest } from 'boclips-api-client/dist/sub-clients/events/model/PageRenderedRequest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '@src/App';

describe('track page render event', () => {
  it('trackPageRendered calls ApiClient with url', () => {
    const fakeClient = new FakeBoclipsClient();

    trackPageRendered(
      {
        pathname: '/test',
        search: '?id=123',
      },
      fakeClient,
    );

    expect(fakeClient.events.getEvents().length).toEqual(1);

    expect(
      (fakeClient.events.getEvents()[0] as PageRenderedRequest).url,
    ).toContain('/test?id=123');
  });
  it('sends a trackPage event with path and query', () => {
    const fakeClient = new FakeBoclipsClient();

    render(
      <MemoryRouter initialEntries={['/videos?q=cat']}>
        <App apiClient={fakeClient} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    expect(fakeClient.events.getEvents().length).toEqual(1);
    expect(
      (fakeClient.events.getEvents()[0] as PageRenderedRequest).url,
    ).toEqual('http://localhost/videos?q=cat');
  });
});
