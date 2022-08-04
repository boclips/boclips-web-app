import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from 'src/testSupport/render';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import React from 'react';
import { Menu } from './Menu';

describe('Openstax book menu', () => {
  it(`displays all subjects`, async () => {
    const fakeClient = new FakeBoclipsClient();

    const subjects = ['Maths', 'French', 'Physics'];

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <Menu subjects={subjects} currentSubject="" onClick={() => {}} />
      </BoclipsClientProvider>,
    );

    expect(await wrapper.findByText('Maths')).toBeInTheDocument();
    expect(wrapper.getByText('French')).toBeInTheDocument();
    expect(wrapper.getByText('Physics')).toBeInTheDocument();
  });
});
