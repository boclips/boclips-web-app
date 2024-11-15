import { render, screen } from '@testing-library/react';
import React from 'react';
import GridCard from '@src/components/common/gridCard/GridCard';
import { MemoryRouter } from 'react-router-dom';

describe('Playlist Card', () => {
  it('has an href to single playlist', async () => {
    render(
      <MemoryRouter>
        <GridCard header={<div />} name="test name" link="/playlists/test-id" />
      </MemoryRouter>,
    );

    expect(screen.getByText('test name').closest('a')).toHaveAttribute(
      'href',
      '/playlists/test-id',
    );
  });

  it('has no href when link is not provided', async () => {
    render(
      <MemoryRouter>
        <GridCard header={<div />} name="test name" link={null} />
      </MemoryRouter>,
    );

    expect(screen.getByText('test name').closest('a')).toBeNull();
  });
});
