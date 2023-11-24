import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { createBrowserHistory } from 'history';
import { render } from '@testing-library/react';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import { Router } from 'react-router-dom';
import React from 'react';
import { RedirectFromExploreToAlignments } from 'src/components/alignments/RedirectFromExploreToAlignments';

describe('RedirectFromExploreToAlignments', () => {
  it(`doesn't redirect for non-explore paths`, () => {
    const history = createBrowserHistory();
    history.push('/something/nice');

    render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <Router location={history.location} navigator={history}>
          <RedirectFromExploreToAlignments />
        </Router>
      </BoclipsClientProvider>,
    );

    expect(history.location.pathname).toEqual('/something/nice');
  });

  it(`redirects from /explore to /sparks`, () => {
    const history = createBrowserHistory();
    history.push('/explore');

    render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <Router location={history.location} navigator={history}>
          <RedirectFromExploreToAlignments />
        </Router>
      </BoclipsClientProvider>,
    );

    expect(history.location.pathname).toEqual('/sparks');
  });

  it(`redirects from /explore/ngss to /sparks/ngss`, () => {
    const history = createBrowserHistory();
    history.push('/explore/ngss');

    render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <Router location={history.location} navigator={history}>
          <RedirectFromExploreToAlignments />
        </Router>
      </BoclipsClientProvider>,
    );

    expect(history.location.pathname).toEqual('/sparks/ngss');
  });

  it(`redirects from /explore/openstax/6334620ec2250a8569f696c3 to /sparks/openstax/6334620ec2250a8569f696c3`, () => {
    const history = createBrowserHistory();
    history.push('/explore/openstax/6334620ec2250a8569f696c3');

    render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <Router location={history.location} navigator={history}>
          <RedirectFromExploreToAlignments />
        </Router>
      </BoclipsClientProvider>,
    );

    expect(history.location.pathname).toEqual(
      '/sparks/openstax/6334620ec2250a8569f696c3',
    );
  });

  it(`redirects from /explore/openstax/6334620ec2250a8569f696c3#topic-0-target-2 to /sparks/openstax/6334620ec2250a8569f696c3#topic-0-target-2`, () => {
    const history = createBrowserHistory();
    history.push('/explore/openstax/6334620ec2250a8569f696c3#topic-0-target-2');

    render(
      <BoclipsClientProvider client={new FakeBoclipsClient()}>
        <Router location={history.location} navigator={history}>
          <RedirectFromExploreToAlignments />
        </Router>
      </BoclipsClientProvider>,
    );

    expect(history.location.pathname).toEqual(
      '/sparks/openstax/6334620ec2250a8569f696c3',
    );
    expect(history.location.hash).toEqual('#topic-0-target-2');
  });
});
