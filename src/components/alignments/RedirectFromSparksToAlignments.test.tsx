import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { createBrowserHistory } from 'history';
import { render } from '@testing-library/react';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import { Router } from 'react-router-dom';
import React from 'react';
import { RedirectFromSparksToAlignments } from '@components/alignments/RedirectFromSparksToAlignments';

describe('RedirectFromSparksToAlignments', () => {
  it.each([
    ['/something/nice', '/something/nice'],
    ['/sparks', '/alignments'],
    ['/sparks/ngss', '/alignments/ngss'],
    ['/sparks/openstax/theme-id', '/alignments/openstax/theme-id'],
    ['/sparks/sparks', '/alignments/sparks'],
  ])('%s to %s', (redirectFrom: string, redirectTo: string) => {
    const history = createBrowserHistory();
    history.push(redirectFrom);

    render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <Router location={history.location} navigator={history}>
          <RedirectFromSparksToAlignments />
        </Router>
      </BoclipsClientProvider>,
    );

    expect(history.location.pathname).toEqual(redirectTo);
  });
});
