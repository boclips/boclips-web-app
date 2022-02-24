import { render } from 'src/testSupport/render';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { CreateNewPlaylistButton } from 'src/components/addToPlaylistButton/CreateNewPlaylistButton';

describe('Create new playlist button', () => {
  it('displays create new playlist button', async () => {
    const wrapper = render(<CreateNewPlaylistButton onCreate={jest.fn} />);

    expect(await wrapper.findByText('Create new playlist')).toBeInTheDocument();
  });

  it(`button displays a text input when clicked`, () => {
    const wrapper = render(<CreateNewPlaylistButton onCreate={jest.fn} />);

    const button = wrapper.getByRole('button', {
      name: 'Create new playlist',
    });
    fireEvent.click(button);

    expect(wrapper.getByPlaceholderText('Add playlist name')).toBeVisible();
    expect(wrapper.queryByText('Create new playlist')).toBeNull();
  });

  it(`displays the create button when playlist name is entered`, () => {
    const wrapper = render(<CreateNewPlaylistButton onCreate={jest.fn} />);

    const button = wrapper.getByRole('button', { name: 'Create new playlist' });
    fireEvent.click(button);

    const playlistInput = wrapper.getByPlaceholderText('Add playlist name');
    expect(playlistInput).toBeVisible();
    fireEvent.change(playlistInput, { target: { value: 'ticket' } });

    expect(wrapper.getByDisplayValue('ticket')).toBeVisible();
    expect(wrapper.getByRole('button', { name: 'Create' })).toBeVisible();
  });

  it(`calls on create when create button is clicked`, () => {
    const createSpy = jest.fn();
    const wrapper = render(<CreateNewPlaylistButton onCreate={createSpy} />);
    const button = wrapper.getByRole('button', { name: 'Create new playlist' });
    fireEvent.click(button);

    fireEvent.change(wrapper.getByPlaceholderText('Add playlist name'), {
      target: { value: 'worship' },
    });
    fireEvent.click(wrapper.getByRole('button', { name: 'Create' }));
    expect(createSpy).toHaveBeenCalledWith('worship');
  });
});
