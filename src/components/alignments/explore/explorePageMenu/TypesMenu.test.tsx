import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from '@src/testSupport/render';
import { BoclipsClientProvider } from '@components/common/providers/BoclipsClientProvider';
import React from 'react';
import { TypesMenu } from './TypesMenu';

describe('Types menu', () => {
  it(`displays all types`, async () => {
    const fakeClient = new FakeBoclipsClient();

    const types = ['Maths', 'French', 'Physics'];

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <TypesMenu types={types} currentType="" onClick={() => {}} />
      </BoclipsClientProvider>,
    );

    expect(await wrapper.findByText('Maths')).toBeInTheDocument();
    expect(wrapper.getByText('French')).toBeInTheDocument();
    expect(wrapper.getByText('Physics')).toBeInTheDocument();
  });
});
