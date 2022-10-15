import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import React from 'react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';

describe('Suspense', () => {
  it('renders homepage', async () => {
    const client = new FakeBoclipsClient();
    const { getByText, getByLabelText } = render(
      <MemoryRouter initialEntries={['/']}>
        <App apiClient={client} boclipsSecurity={stubBoclipsSecurity} />
      </MemoryRouter>,
    );

    await waitFor(() => getByText('Let’s find the videos you need'));

    expect(
      getByLabelText('CourseSpark logo - Go to homepage'),
    ).toBeInTheDocument();
  });
});
