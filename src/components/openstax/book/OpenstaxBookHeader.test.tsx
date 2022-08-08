import React from 'react';
import { renderWithClients } from 'src/testSupport/render';
import { OpenstaxBookHeader } from 'src/components/openstax/book/OpenstaxBookHeader';

describe('OpenstaxBookHeader', () => {
  it('shows book title', () => {
    const wrapper = renderWithClients(
      <OpenstaxBookHeader bookTitle="Everything to know about ducks" />,
    );

    expect(
      wrapper.getByRole('heading', {
        level: 1,
        name: 'Everything to know about ducks',
      }),
    ).toBeVisible();
  });
});
