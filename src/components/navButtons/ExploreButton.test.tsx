import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from 'src/testSupport/render';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { fireEvent } from '@testing-library/react';
import App from 'src/App';

describe('explore button', () => {
  beforeEach(() => {
    window.resizeTo(1680, 1024);
  });

  it('pushes openstax explore page to history', async () => {
    const history = createMemoryHistory({ initialEntries: ['/'] });

    const fakeBoclipsClient = new FakeBoclipsClient();
    fakeBoclipsClient.users.setCurrentUserFeatures({
      BO_WEB_APP_OPENSTAX: true,
    });

    const wrapper = render(
      <BoclipsClientProvider client={fakeBoclipsClient}>
        <Router history={history}>
          <App
            boclipsSecurity={stubBoclipsSecurity}
            apiClient={fakeBoclipsClient}
          />
        </Router>
      </BoclipsClientProvider>,
    );

    fireEvent.click(await wrapper.findByRole('button', { name: 'Explore' }));

    expect(history.location.pathname).toEqual('/explore/openstax');
  });
});
