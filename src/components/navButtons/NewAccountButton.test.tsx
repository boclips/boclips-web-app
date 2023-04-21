import { render } from '@testing-library/react';
import { NewAccountButton } from 'src/components/navButtons/NewAccountButton';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import React from 'react';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';

describe(`new account button`, () => {
  it(`text is my account if name is blank`, () => {
    const wrapper = render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <NewAccountButton user={UserFactory.sample({ firstName: ' ' })} />
      </BoclipsSecurityProvider>,
    );
    expect(wrapper.getByText('My Account')).toBeInTheDocument();
  });
});
