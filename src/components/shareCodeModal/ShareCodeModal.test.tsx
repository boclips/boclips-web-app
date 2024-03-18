import { render } from '@testing-library/react';
import React from 'react';
import ShareCodeModal from 'src/components/shareCodeModal/ShareCodeModal';
import userEvent from '@testing-library/user-event';

describe('Share Code Modal', () => {
  it('renders the share code modal', async () => {
    const wrapper = render(
      <ShareCodeModal
        assetId="asset-id"
        fetchAssetWithCode={() => {}}
        isFetching={false}
        isError={false}
        referer="referer-1"
      />,
    );

    expect(wrapper.getByText('Enter code to watch videos')).toBeVisible();
    expect(
      wrapper.getByText("Don't have a code? Ask your teacher."),
    ).toBeVisible();
    expect(wrapper.getByPlaceholderText('Unique access code')).toBeVisible();
    expect(wrapper.getByText('Watch Video')).toBeVisible();

    expect(wrapper.queryByText('Invalid code')).toBeNull();
  });

  it('asset fetching invoked when button clicked', async () => {
    const fetchingSpy = jest.fn();

    const wrapper = render(
      <ShareCodeModal
        assetId="asset-id"
        fetchAssetWithCode={fetchingSpy}
        isFetching={false}
        isError={false}
        referer="referer-1"
      />,
    );

    const input = wrapper.getByPlaceholderText('Unique access code');
    await userEvent.type(input, '1234');

    const button = wrapper.getByRole('button', { name: 'Watch Video' });
    await userEvent.click(button);

    expect(fetchingSpy).toHaveBeenCalled();
  });

  it('asset fetching invoked when enter clicked', async () => {
    const fetchingSpy = jest.fn();

    const wrapper = render(
      <ShareCodeModal
        assetId="asset-id"
        fetchAssetWithCode={fetchingSpy}
        isFetching={false}
        isError={false}
        referer="referer-1"
      />,
    );

    const input = wrapper.getByPlaceholderText('Unique access code');
    await userEvent.type(input, '1234');

    await userEvent.keyboard('{enter}');

    expect(fetchingSpy).toHaveBeenCalled();
  });

  it('asset fetching not invoked when code is too short', async () => {
    const fetchingSpy = jest.fn();

    const wrapper = render(
      <ShareCodeModal
        assetId="asset-id"
        fetchAssetWithCode={fetchingSpy}
        isFetching={false}
        isError={false}
        referer="referer-1"
      />,
    );

    const input = wrapper.getByPlaceholderText('Unique access code');
    await userEvent.type(input, '134');

    await userEvent.keyboard('{enter}');

    expect(fetchingSpy).not.toHaveBeenCalled();
  });

  it('error message displayed when isError is true', async () => {
    const fetchingSpy = jest.fn();

    const wrapper = render(
      <ShareCodeModal
        assetId="asset-id"
        fetchAssetWithCode={fetchingSpy}
        isFetching={false}
        isError
        referer="referer-1"
      />,
    );

    expect(wrapper.getByText('Invalid code')).toBeVisible();
  });
});
