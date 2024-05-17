import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import MarketingInfoForm from 'src/components/welcome/MarketingInfoForm';

describe('MarketingInfoForm', () => {
  it('all job titles are available when dropdown clicked', async () => {
    const wrapper = render(
      <MarketingInfoForm errors={{}} setMarketingInfo={jest.fn()} isAdmin />,
    );

    expect(await wrapper.findByText('Job Title')).toBeVisible();
    const dropdown = await wrapper.findByText('Select your job title');

    fireEvent.click(dropdown);

    expect(
      wrapper.getByText('Curriculum Developer/Instructional Designer'),
    ).toBeVisible();
    expect(wrapper.getByText('Curriculum Leader')).toBeVisible();
    expect(wrapper.getByText('Product Manager/Owner')).toBeVisible();
    expect(wrapper.getByText('Procurement/Licensing')).toBeVisible();
    expect(wrapper.getByText('Faculty/Support Staff')).toBeVisible();
    expect(wrapper.getByText('Executive')).toBeVisible();
    expect(wrapper.getByText('Project Manager')).toBeVisible();
    expect(wrapper.getByText('Portfolio Manager')).toBeVisible();
    expect(wrapper.getByText('Teacher')).toBeVisible();
    expect(wrapper.getByText('Professor')).toBeVisible();
    expect(wrapper.getByText('Other')).toBeVisible();
  });

  it('classroom specific job titles are available when dropdown clicked when classroom user', async () => {
    const wrapper = render(
      <MarketingInfoForm
        errors={{}}
        setMarketingInfo={jest.fn()}
        isAdmin
        isClassroomUser
      />,
    );

    expect(await wrapper.findByText('Job Title')).toBeVisible();
    const dropdown = await wrapper.findByText('Select your job title');

    fireEvent.click(dropdown);

    expect(wrapper.getByText('Administrator')).toBeVisible();
    expect(
      wrapper.getByText('Curriculum Developer/Instructional Designer'),
    ).toBeVisible();
    expect(wrapper.getByText('Curriculum Leader')).toBeVisible();
    expect(wrapper.getByText('Product Manager/Owner')).toBeVisible();
    expect(wrapper.getByText('Procurement/Licensing')).toBeVisible();
    expect(wrapper.getByText('Principal')).toBeVisible();
    expect(wrapper.getByText('Faculty/Support Staff')).toBeVisible();
    expect(wrapper.getByText('Technology Specialist')).toBeVisible();
    expect(wrapper.getByText('Project Manager')).toBeVisible();
    expect(wrapper.getByText('Teacher')).toBeVisible();
    expect(wrapper.getByText('Professor')).toBeVisible();
    expect(wrapper.getByText('Other')).toBeVisible();
  });

  it('discovery method is visible for admin user', async () => {
    const wrapper = render(
      <MarketingInfoForm errors={{}} setMarketingInfo={jest.fn()} isAdmin />,
    );

    expect(await wrapper.findByText('I heard about Boclips')).toBeVisible();
    expect(await wrapper.findByText('How did you hear about us')).toBeVisible();
  });

  it('discovery method is not visible for regular user', async () => {
    const wrapper = render(
      <MarketingInfoForm
        errors={{}}
        setMarketingInfo={jest.fn()}
        isAdmin={false}
      />,
    );

    expect(await wrapper.queryByText('I heard about Boclips')).toBeNull();
  });

  it('all discovery methods are available when dropdown clicked', async () => {
    const wrapper = render(
      <MarketingInfoForm errors={{}} setMarketingInfo={jest.fn()} isAdmin />,
    );

    expect(await wrapper.findByText('I heard about Boclips')).toBeVisible();
    const dropdown = await wrapper.findByText('How did you hear about us');

    fireEvent.click(dropdown);

    expect(wrapper.getByText('Search Engine (Google, Bing etc)')).toBeVisible();
    expect(wrapper.getByText('Industry newsletter')).toBeVisible();
    expect(wrapper.getByText('Blog or Publication')).toBeVisible();
    expect(wrapper.getByText('Employer')).toBeVisible();
    expect(
      wrapper.getByText('Recommended by Friend or Colleague'),
    ).toBeVisible();
    expect(wrapper.getByText('Contacted by Boclips')).toBeVisible();
    expect(wrapper.getByText('School ad board/website')).toBeVisible();
    expect(wrapper.getByText('Social Media')).toBeVisible();
    expect(wrapper.getByText('Other')).toBeVisible();
  });

  it('organization type is visible for admin user', async () => {
    const wrapper = render(
      <MarketingInfoForm errors={{}} setMarketingInfo={jest.fn()} isAdmin />,
    );

    expect(await wrapper.findByText('Organization type')).toBeVisible();
    expect(
      await wrapper.findByText('Select your organization type'),
    ).toBeVisible();
  });

  it('organization type is not visible for admin classroom user', async () => {
    const wrapper = render(
      <MarketingInfoForm
        errors={{}}
        setMarketingInfo={jest.fn()}
        isAdmin
        isClassroomUser
      />,
    );

    expect(await wrapper.queryByText('Organization type')).toBeNull();
    expect(
      await wrapper.queryByText('Select your organization type'),
    ).toBeNull();
  });

  it('organization type is not visible for regular user', async () => {
    const wrapper = render(
      <MarketingInfoForm
        errors={{}}
        setMarketingInfo={jest.fn()}
        isAdmin={false}
      />,
    );

    expect(await wrapper.queryByText('Organization type')).toBeNull();
  });

  it('all organization types are available when dropdown clicked', async () => {
    const wrapper = render(
      <MarketingInfoForm errors={{}} setMarketingInfo={jest.fn()} isAdmin />,
    );

    expect(await wrapper.findByText('Organization type')).toBeVisible();
    const dropdown = await wrapper.findByText('Select your organization type');

    fireEvent.click(dropdown);

    expect(wrapper.getByText('Publisher')).toBeVisible();
    expect(wrapper.getByText('Edtech')).toBeVisible();
    expect(wrapper.getByText('Virtual/Charter Schools')).toBeVisible();
    expect(wrapper.getByText('Government')).toBeVisible();
    expect(wrapper.getByText('College/University')).toBeVisible();
    expect(wrapper.getByText('Other')).toBeVisible();
  });

  it('error messages not visible by default for admin related fields', async () => {
    const wrapper = render(
      <MarketingInfoForm errors={{}} setMarketingInfo={jest.fn()} isAdmin />,
    );

    expect(
      await wrapper.queryByText('Organization type is required'),
    ).toBeNull();
    expect(
      await wrapper.queryByText('I heard about Boclips is required'),
    ).toBeNull();
  });

  it('error messages visible for admin related fields', async () => {
    const wrapper = render(
      <MarketingInfoForm
        errors={{
          isDiscoveryMethodsEmpty: true,
          isOrganizationTypesEmpty: true,
        }}
        setMarketingInfo={jest.fn()}
        isAdmin
      />,
    );

    expect(
      await wrapper.findByText('Organization type is required'),
    ).toBeVisible();
    expect(
      await wrapper.findByText('I heard about Boclips is required'),
    ).toBeVisible();
  });

  it('prompt is visible for regular user', async () => {
    const wrapper = render(
      <MarketingInfoForm
        errors={{}}
        setMarketingInfo={jest.fn()}
        isAdmin={false}
      />,
    );

    expect(
      await wrapper.findByText(
        'Complete your account setup by filling in the details below.',
      ),
    ).toBeVisible();
  });

  it('prompt is not visible for admin user', async () => {
    const wrapper = render(
      <MarketingInfoForm errors={{}} setMarketingInfo={jest.fn()} isAdmin />,
    );

    expect(
      await wrapper.queryByText(
        'Complete your account setup by filling in the details below.',
      ),
    ).toBeNull();
  });
});
