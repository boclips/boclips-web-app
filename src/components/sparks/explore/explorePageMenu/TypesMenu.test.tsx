import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from 'src/testSupport/render';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import React from 'react';
import { TypesMenu } from './TypesMenu';

describe('Types menu', () => {
  it(`displays all types`, async () => {
    const fakeClient = new FakeBoclipsClient();

    const types = ['Maths', 'French', 'Physics'];

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <TypesMenu
          types={types}
          currentType=""
          onClick={() => {}}
          isLoading={false}
        />
      </BoclipsClientProvider>,
    );

    expect(await wrapper.findByText('Maths')).toBeInTheDocument();
    expect(wrapper.getByText('French')).toBeInTheDocument();
    expect(wrapper.getByText('Physics')).toBeInTheDocument();
  });

  it(`displays types menu skeleton`, async () => {
    const fakeClient = new FakeBoclipsClient();

    const types = ['Maths', 'French', 'Physics'];

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <TypesMenu types={types} currentType="" onClick={() => {}} isLoading />
      </BoclipsClientProvider>,
    );

    expect(await wrapper.findByTestId('types-skeleton-1')).toBeInTheDocument();

    expect(await wrapper.findByTestId('types-skeleton-6')).toBeInTheDocument();
  });
});
