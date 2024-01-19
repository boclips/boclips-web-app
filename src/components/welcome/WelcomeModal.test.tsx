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
import { AccountsFactory } from 'boclips-api-client/dist/test-support/AccountsFactory';
import { AccountType } from 'boclips-api-client/dist/sub-clients/accounts/model/Account';

describe('Trial Welcome Modal', () => {
  const fakeClient = new FakeBoclipsClient();

  afterEach(() => {
    fakeClient.clear();
  });

  describe('Regular user', () => {
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
      fakeClient.accounts.insertAccount(
        AccountsFactory.sample({
          id: 'LAL',
          type: AccountType.TRIAL,
          marketingInformation: { companySegments: ['Edtech'] },
        }),
      );
    });

    it('displays regular trial welcome modal', async () => {
      const wrapper = renderWelcomeView();
      expect(
        await wrapper.findByText(
          'Your colleague has invited you to a Boclips Library preview!',
        ),
      ).toBeVisible();

      expect(await wrapper.findByText('Kobe Bryant')).toBeVisible();
      expect(wrapper.getByText('kobe@la.com')).toBeVisible();
      expect(wrapper.getByText('LA Lakers')).toBeVisible();

      expect(wrapper.getByText('Job Title')).toBeVisible();
      expect(wrapper.getByText('Select your job title')).toBeVisible();

      expect(wrapper.queryByText('Organization type')).toBeNull();

      expect(wrapper.getByText('Audience')).toBeVisible();
      expect(
        wrapper.getByText(
          'Select your main audience (you can select more than one)',
        ),
      ).toBeVisible();

      expect(wrapper.queryByText('I heard about Boclips')).toBeNull();

      expect(wrapper.getByLabelText('Content Topics')).toBeVisible();
      expect(
        wrapper.getByPlaceholderText(
          'I am looking for content in these topics...',
        ),
      ).toBeVisible();

      expect(wrapper.getByText(/By clicking Let's Go!, you agree to the/));

      expect(
        wrapper.getByRole('link', { name: 'Boclips Terms & Conditions' }),
      ).toBeVisible();

      expect(
        wrapper.getByRole('link', {
          name: 'Boclips Privacy Policy',
        }),
      ).toBeVisible();

      expect(wrapper.getByRole('button', { name: "Let's Go!" })).toBeVisible();
    });

    it('updates user but not account when button clicked and form filled out', async () => {
      const updateUserSpy = jest.spyOn(fakeClient.users, 'updateUser');
      const updateAccountSpy = jest.spyOn(fakeClient.accounts, 'updateAccount');

      const wrapper = renderWelcomeView();

      await setJobTitle(wrapper, 'Professor');
      await setAudience(wrapper, 'K12');
      await setAudience(wrapper, 'Other');
      await setDesiredContent(wrapper, 'Basketball');

      fireEvent.click(wrapper.getByRole('button', { name: "Let's Go!" }));

      await waitFor(() => {
        expect(updateUserSpy).toHaveBeenCalledWith('kb', {
          jobTitle: 'Professor',
          audiences: ['K12', 'Other'],
          desiredContent: 'Basketball',
          discoveryMethods: [],
          type: 'b2bUser',
        });
        expect(updateAccountSpy).not.toHaveBeenCalled();
      });
    });

    it('displays notification when user successfully updated and the modal is closed', async () => {
      jest
        .spyOn(fakeClient.users, 'updateUser')
        .mockImplementation(() => Promise.resolve(true));

      const wrapper = renderWelcomeView();

      await setJobTitle(wrapper, 'Professor');
      await setAudience(wrapper, 'K12');
      await setDesiredContent(wrapper, 'Basketball');

      fireEvent.click(wrapper.getByRole('button', { name: "Let's Go!" }));

      await waitFor(() => {
        expect(wrapper.getByText('Welcome to')).toBeVisible();
        expect(wrapper.getByText('Boclips Library')).toBeVisible();
      });

      expect(
        await wrapper.findByText('User kobe@la.com successfully updated'),
      ).toBeVisible();

      expect(
        wrapper.queryByText(
          'Your colleague has invited you to a Boclips Library preview!',
        ),
      ).toBeNull();
    });

    it('displays error notification when user update fails', async () => {
      jest
        .spyOn(fakeClient.users, 'updateUser')
        .mockImplementation(() => Promise.reject());

      const wrapper = renderWelcomeView();

      await setJobTitle(wrapper, 'Professor');
      await setAudience(wrapper, 'K12');
      await setDesiredContent(wrapper, 'Basketball');

      fireEvent.click(wrapper.getByRole('button', { name: "Let's Go!" }));

      await waitFor(() => {
        expect(wrapper.getByText(/User update failed/));
      });
    });

    it('displays error messages when marketing information is not filled, user is not updated', async () => {
      const updateUserSpy = jest.spyOn(fakeClient.users, 'updateUser');

      const wrapper = renderWelcomeView();

      await setJobTitle(wrapper, '');
      await setDesiredContent(wrapper, ' ');

      fireEvent.click(wrapper.getByRole('button', { name: "Let's Go!" }));

      expect(await wrapper.findByText('Job title is required')).toBeVisible();
      expect(await wrapper.findByText('Audience is required')).toBeVisible();
      expect(
        await wrapper.findByText('Content topics is required'),
      ).toBeVisible();

      await waitFor(() => {
        expect(updateUserSpy).not.toBeCalled();
      });
    });

    it('does not update user if one of the marketing info is missing', async () => {
      const updateUserSpy = jest.spyOn(fakeClient.users, 'updateUser');

      const wrapper = renderWelcomeView();

      await setJobTitle(wrapper, 'Professor');
      await setAudience(wrapper, 'K12');
      await setDesiredContent(wrapper, '');

      fireEvent.click(wrapper.getByRole('button', { name: "Let's Go!" }));

      expect(wrapper.queryByText('Job title is required')).toBeNull();
      expect(wrapper.queryByText('Audience is required')).toBeNull();
      expect(
        await wrapper.findByText('Content topics is required'),
      ).toBeVisible();

      await waitFor(() => {
        expect(updateUserSpy).not.toBeCalled();
      });
    });
  });

  describe('admin user', () => {
    beforeEach(() => {
      fakeClient.users.insertCurrentUser(
        UserFactory.sample({
          id: 'sk',
          firstName: 'Saku',
          lastName: 'Saku Koivu',
          email: 'saku@koivu.com',
          account: { id: 'AND', name: 'Anaheim Ducks' },
        }),
      );
      fakeClient.accounts.insertAccount(
        AccountsFactory.sample({
          id: 'AND',
          type: AccountType.TRIAL,
          marketingInformation: {},
        }),
      );
    });

    it('updates user and account when button clicked after full form filled out', async () => {
      const updateUserSpy = jest.spyOn(fakeClient.users, 'updateUser');
      const updateAccountSpy = jest.spyOn(fakeClient.accounts, 'updateAccount');

      const wrapper = renderWelcomeView();

      expect(
        await wrapper.findByText('Tell us a bit more about you'),
      ).toBeVisible();

      await setJobTitle(wrapper, 'Professor');
      await setAudience(wrapper, 'K12');
      await setAudience(wrapper, 'Other');
      await setDesiredContent(wrapper, 'Hockey');
      await setOrganizationType(wrapper, 'Publisher');
      await setOrganizationType(wrapper, 'Edtech');
      await setDiscoveryMethod(wrapper, 'Employer');
      await setDiscoveryMethod(wrapper, 'Social Media');

      fireEvent.click(
        await wrapper.findByRole('button', { name: "Let's Go!" }),
      );

      await waitFor(() => {
        expect(updateUserSpy).toHaveBeenCalledWith('sk', {
          jobTitle: 'Professor',
          audiences: ['K12', 'Other'],
          desiredContent: 'Hockey',
          discoveryMethods: ['Employer', 'Social Media'],
          type: 'b2bUser',
        });
      });

      await waitFor(() => {
        expect(updateAccountSpy).toHaveBeenCalledWith('AND', {
          companySegments: ['Publisher', 'Edtech'],
        });
      });
    });

    it('does not update user or account if the admin marketing info is missing', async () => {
      const updateUserSpy = jest.spyOn(fakeClient.users, 'updateUser');
      const updateAccountSpy = jest.spyOn(fakeClient.accounts, 'updateAccount');

      const wrapper = renderWelcomeView();

      await setJobTitle(wrapper, 'Professor');
      await setAudience(wrapper, 'K12');
      await setDesiredContent(wrapper, 'Hockey');

      fireEvent.click(wrapper.getByRole('button', { name: "Let's Go!" }));

      expect(
        await wrapper.findByText('Organization type is required'),
      ).toBeVisible();
      expect(
        await wrapper.findByText('I heard about Boclips is required'),
      ).toBeVisible();

      await waitFor(() => {
        expect(updateUserSpy).not.toBeCalled();
        expect(updateAccountSpy).not.toHaveBeenCalled();
      });
    });
  });

  async function setJobTitle(wrapper: RenderResult, value: string) {
    if (value) {
      const dropdown = await wrapper.findByTestId('input-dropdown-job-title');
      fireEvent.click(within(dropdown).getByTestId('select'));
      const option = within(dropdown).getByText(value);
      expect(option).toBeVisible();
      fireEvent.click(option);
    }
  }

  async function setAudience(wrapper: RenderResult, value: string) {
    if (value) {
      const dropdown = await wrapper.findByTestId('input-dropdown-audience');
      fireEvent.click(within(dropdown).getByTestId('select'));
      const option = within(dropdown).getByText(value);
      expect(option).toBeVisible();
      fireEvent.click(option);

      // make sure dropdown is closed
      fireEvent.click(within(dropdown).getByTestId('select'));
      expect(within(dropdown).queryByText(value)).toBeNull();
    }
  }

  async function setDesiredContent(wrapper: RenderResult, value: string) {
    fireEvent.change(await wrapper.findByLabelText('Content Topics'), {
      target: { value },
    });
  }

  async function setOrganizationType(wrapper: RenderResult, value: string) {
    if (value) {
      const dropdown = await wrapper.findByTestId(
        'input-dropdown-organization-type',
      );
      fireEvent.click(within(dropdown).getByTestId('select'));
      const option = within(dropdown).getByText(value);
      expect(option).toBeVisible();
      fireEvent.click(option);

      // make sure dropdown is closed
      fireEvent.click(within(dropdown).getByTestId('select'));
      expect(within(dropdown).queryByText(value)).toBeNull();
    }
  }

  async function setDiscoveryMethod(wrapper: RenderResult, value: string) {
    if (value) {
      const dropdown = await wrapper.findByTestId(
        'input-dropdown-discovery-method',
      );
      fireEvent.click(within(dropdown).getByTestId('select'));
      const option = within(dropdown).getByText(value);
      expect(option).toBeVisible();
      fireEvent.click(option);

      // make sure dropdown is closed
      fireEvent.click(within(dropdown).getByTestId('select'));
      expect(within(dropdown).queryByText(value)).toBeNull();
    }
  }

  function renderWelcomeView(): RenderResult {
    return render(
      <MemoryRouter initialEntries={['/']}>
        <App
          apiClient={fakeClient}
          boclipsSecurity={stubBoclipsSecurity}
          reactQueryClient={new QueryClient(queryClientConfig)}
        />
      </MemoryRouter>,
    );
  }
});
