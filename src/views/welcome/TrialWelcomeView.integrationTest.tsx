import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
  within,
} from '@testing-library/react';
import React from 'react';
import { FakeBoclipsClient } from 'boclips-api-client/dist/test-support';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import { UserFactory } from 'boclips-api-client/dist/test-support/UserFactory';
import { QueryClient } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import App from 'src/App';
import { queryClientConfig } from 'src/hooks/api/queryClientConfig';

describe('Trial Welcome View', () => {
  const fakeClient = new FakeBoclipsClient();
  beforeEach(() => {
    fakeClient.users.insertCurrentUser(
      UserFactory.sample({
        id: 'kb',
        firstName: 'Kobe',
        lastName: 'Bryant',
        email: 'kobe@la.com',
        account: { id: 'LAL', name: 'LA Lakers' },
      }),
    );
    fakeClient.users.setCurrentUserFeatures({ BO_WEB_APP_DEV: true });
  });

  it('displays trial welcome view', async () => {
    const wrapper = renderWelcomeView();

    expect(
      await wrapper.findByText(
        "You've just been added to Boclips by your colleague",
      ),
    ).toBeVisible();

    expect(wrapper.getByText('Kobe Bryant')).toBeVisible();
    expect(wrapper.getByText('kobe@la.com')).toBeVisible();
    expect(wrapper.getByText('LA Lakers')).toBeVisible();

    expect(wrapper.getByLabelText('Job Title*')).toBeVisible();
    expect(wrapper.getByPlaceholderText('example: Designer')).toBeVisible();

    expect(wrapper.getByText('Your audience type*')).toBeVisible();
    expect(wrapper.getByText('example: K12')).toBeVisible();

    expect(
      wrapper.getByLabelText('What Content are you interested in*'),
    ).toBeVisible();
    expect(wrapper.getByPlaceholderText('Design')).toBeVisible();

    expect(wrapper.getByText(/By clicking Create Account, you agree to the/));
    expect(
      wrapper.getByRole('link', { name: 'Boclips Terms & Conditions' }),
    ).toBeVisible();

    const privacyPolicyLinks = wrapper.getAllByRole('link', {
      name: 'Privacy Policy',
    });
    expect(privacyPolicyLinks).toHaveLength(2);
    expect(privacyPolicyLinks[0]).toBeVisible();
    expect(privacyPolicyLinks[1]).toBeVisible();

    expect(
      wrapper.getByRole('button', { name: 'Create Account' }),
    ).toBeVisible();
  });

  it('user update is performed when clicked button', async () => {
    const updateUserSpy = jest.spyOn(fakeClient.users, 'updateUser');

    const wrapper = renderWelcomeView();

    await setJobTitle(wrapper, 'Player');
    await setAudience(wrapper, 'K12');
    await setDesiredContent(wrapper, 'Basketball');

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(updateUserSpy).toHaveBeenCalledWith('kb', {
        jobTitle: 'Player',
        audience: 'K12',
        desiredContent: 'Basketball',
        type: 'b2bUser',
      });
    });
  });

  it('redirects to home page and notification is displayed when user successfully updated', async () => {
    jest
      .spyOn(fakeClient.users, 'updateUser')
      .mockImplementation(() => Promise.resolve(true));

    const wrapper = renderWelcomeView();

    await setJobTitle(wrapper, 'Player');
    await setAudience(wrapper, 'K12');
    await setDesiredContent(wrapper, 'Basketball');

    fireEvent.click(
      await wrapper.findByRole('button', { name: 'Create Account' }),
    );

    await waitFor(() => {
      expect(wrapper.getByText(/Welcome to/)).toBeVisible();
      expect(wrapper.getByText(/CourseSpark!/)).toBeVisible();
    });

    expect(
      await wrapper.findByText('User kobe@la.com successfully updated'),
    ).toBeVisible();
  });

  it('error notification is displayed when user update fails', async () => {
    jest
      .spyOn(fakeClient.users, 'updateUser')
      .mockImplementation(() => Promise.reject());

    const wrapper = renderWelcomeView();

    await setJobTitle(wrapper, 'Player');
    await setAudience(wrapper, 'K12');
    await setDesiredContent(wrapper, 'Basketball');

    fireEvent.click(
      await wrapper.findByRole('button', { name: 'Create Account' }),
    );

    await waitFor(() => {
      expect(wrapper.getByText(/User update failed/));
    });
  });

  it('error messages are displayed when marketing information is not filled, user is not updated', async () => {
    const updateUserSpy = jest.spyOn(fakeClient.users, 'updateUser');

    const wrapper = renderWelcomeView();

    await setJobTitle(wrapper, '');
    await setDesiredContent(wrapper, ' ');

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    expect(await wrapper.findByText('Job title is required')).toBeVisible();
    expect(await wrapper.findByText('Audience type is required')).toBeVisible();
    expect(
      await wrapper.findByText('Desired content is required'),
    ).toBeVisible();

    await waitFor(() => {
      expect(updateUserSpy).not.toBeCalled();
    });
  });

  it('user is not updated if one of the marketing info is missing', async () => {
    const updateUserSpy = jest.spyOn(fakeClient.users, 'updateUser');

    const wrapper = renderWelcomeView();

    await setJobTitle(wrapper, 'Player');
    await setAudience(wrapper, 'K12');
    await setDesiredContent(wrapper, '');

    fireEvent.click(wrapper.getByRole('button', { name: 'Create Account' }));

    expect(await wrapper.queryByText('Job title is required')).toBeNull();
    expect(await wrapper.queryByText('Audience type is required')).toBeNull();
    expect(
      await wrapper.findByText('Desired content is required'),
    ).toBeVisible();

    await waitFor(() => {
      expect(updateUserSpy).not.toBeCalled();
    });
  });

  async function setJobTitle(wrapper: RenderResult, value: string) {
    fireEvent.change(await wrapper.findByLabelText(/Job Title/), {
      target: { value },
    });
  }

  async function setAudience(wrapper: RenderResult, value: string) {
    if (value) {
      const dropdown = await wrapper.findByTestId('input-dropdown-audience');
      fireEvent.click(within(dropdown).getByTestId('select'));
      const option = within(dropdown).getByText(value);
      expect(option).toBeVisible();
      fireEvent.click(option);
    }
  }

  async function setDesiredContent(wrapper: RenderResult, value: string) {
    fireEvent.change(
      await wrapper.findByLabelText(/What Content are you interested in/),
      {
        target: { value },
      },
    );
  }

  function renderWelcomeView(): RenderResult {
    return render(
      <MemoryRouter initialEntries={['/welcome']}>
        <App
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={new QueryClient(queryClientConfig)}
        />
      </MemoryRouter>,
    );
  }
});
