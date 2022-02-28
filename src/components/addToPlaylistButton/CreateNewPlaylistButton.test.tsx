import { render } from 'src/testSupport/render';
import { fireEvent } from '@testing-library/react';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { CreateNewPlaylistButton } from 'src/components/addToPlaylistButton/CreateNewPlaylistButton';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { BoclipsClientProvider } from 'src/components/common/providers/BoclipsClientProvider';

describe('Create new playlist button', () => {
  it('displays create new playlist button', async () => {
    const wrapper = renderWrapper();

    expect(await wrapper.findByText('Create new playlist')).toBeInTheDocument();
  });

  it(`button displays a text input when clicked`, () => {
    const wrapper = renderWrapper();

    const button = wrapper.getByRole('button', {
      name: 'Create new playlist',
    });
    fireEvent.click(button);

    expect(wrapper.getByPlaceholderText('Add playlist name')).toBeVisible();
    expect(wrapper.queryByText('Create new playlist')).toBeNull();
  });

  it(`displays the create button when playlist name is entered`, () => {
    const wrapper = renderWrapper();

    const button = wrapper.getByRole('button', { name: 'Create new playlist' });
    fireEvent.click(button);

    const playlistInput = wrapper.getByPlaceholderText('Add playlist name');
    expect(playlistInput).toBeVisible();
    fireEvent.change(playlistInput, { target: { value: 'ticket' } });

    expect(wrapper.getByDisplayValue('ticket')).toBeVisible();
    expect(wrapper.getByRole('button', { name: 'Create' })).toBeVisible();
  });

  it(`displays Create new playlist button on successful creation`, async () => {
    const wrapper = renderWrapper();
    const button = wrapper.getByRole('button', { name: 'Create new playlist' });
    fireEvent.click(button);

    fireEvent.change(wrapper.getByPlaceholderText('Add playlist name'), {
      target: { value: 'worship' },
    });
    fireEvent.click(wrapper.getByRole('button', { name: 'Create' }));

    expect(
      await wrapper.findByRole('button', { name: 'Create new playlist' }),
    ).toBeVisible();
  });

  it(`displays notification on successful creation`, async () => {
    const wrapper = renderWrapper();
    const button = wrapper.getByRole('button', { name: 'Create new playlist' });
    fireEvent.click(button);

    fireEvent.change(wrapper.getByPlaceholderText('Add playlist name'), {
      target: { value: 'worship' },
    });
    fireEvent.click(wrapper.getByRole('button', { name: 'Create' }));
    expect(
      await wrapper.findByTestId('add-video-123-to-playlist'),
    ).toBeVisible();
  });

  const renderWrapper = () => {
    const fakeClient = new FakeBoclipsClient();
    return render(
      <BoclipsClientProvider client={fakeClient}>
        <ToastContainer />
        <CreateNewPlaylistButton videoId="123" />
      </BoclipsClientProvider>,
    );
  };
});
