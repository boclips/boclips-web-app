import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { render } from 'src/testSupport/render';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';
import React from 'react';
import { SubjectsMenu } from './SubjectsMenu';

describe('Openstax book menu', () => {
  it(`displays all subjects`, async () => {
    const fakeClient = new FakeBoclipsClient();

    const subjects = ['Maths', 'French', 'Physics'];

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <SubjectsMenu
          subjects={subjects}
          currentSubject=""
          onClick={() => {}}
          isLoading={false}
        />
      </BoclipsClientProvider>,
    );

    expect(await wrapper.findByText('Maths')).toBeInTheDocument();
    expect(wrapper.getByText('French')).toBeInTheDocument();
    expect(wrapper.getByText('Physics')).toBeInTheDocument();
  });

  it(`displays subject menu skeleton`, async () => {
    const fakeClient = new FakeBoclipsClient();

    const subjects = ['Maths', 'French', 'Physics'];

    const wrapper = render(
      <BoclipsClientProvider client={fakeClient}>
        <SubjectsMenu
          subjects={subjects}
          currentSubject=""
          onClick={() => {}}
          isLoading
        />
      </BoclipsClientProvider>,
    );

    expect(
      await wrapper.findByTestId('subjects-skeleton-1'),
    ).toBeInTheDocument();

    expect(
      await wrapper.findByTestId('subjects-skeleton-6'),
    ).toBeInTheDocument();
  });
});
