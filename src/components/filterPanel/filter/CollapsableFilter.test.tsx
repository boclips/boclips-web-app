import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BoclipsSecurityProvider } from 'src/components/common/providers/BoclipsSecurityProvider';
import { stubBoclipsSecurity } from 'src/testSupport/StubBoclipsSecurity';
import React from 'react';
import { CollapsableFilter } from 'src/components/filterPanel/filter/CollapsableFilter';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('collapsable filter', () => {
  it('opens / closes the filter panel', async () => {
    const header = 'This is a header text';
    const contents = 'this is a test content';
    const wrapper = renderWrapper(header, contents);

    expect(wrapper.getByText(header)).toBeInTheDocument();
    expect(wrapper.getByText(contents)).toBeInTheDocument();

    await userEvent.click(wrapper.getByText(header));

    expect(wrapper.queryByText(contents)).not.toBeInTheDocument();
  });

  it('opens the info modal', async () => {
    const header = 'Best for';
    const contents = 'this is a test content';
    const wrapper = renderWrapper(header, contents);

    await userEvent.click(wrapper.getByTestId('best-for-info-button'));

    expect(await wrapper.findByTestId('best-for-modal')).toBeInTheDocument();
  });

  it('displays the modal contents for best for tag', async () => {
    const header = 'Best for';
    const contents = 'this is a test content';
    const wrapper = renderWrapper(header, contents);

    await userEvent.click(wrapper.getByTestId('best-for-info-button'));

    expect(wrapper.getByText('Discovery')).toBeInTheDocument();
    expect(wrapper.getByText('Explainer')).toBeInTheDocument();
    expect(wrapper.getByText('Experience')).toBeInTheDocument();
    expect(wrapper.getByText('Tutorial')).toBeInTheDocument();
    expect(wrapper.getByText('Application')).toBeInTheDocument();
    expect(wrapper.getByText('Synthesis')).toBeInTheDocument();
    expect(wrapper.getByText('Review')).toBeInTheDocument();

    expect(
      wrapper.getByText(
        'Best for engagement and connection to prior knowledge',
      ),
    ).toBeInTheDocument();
    expect(
      wrapper.getByText(
        'Best for comprehension of new facts, ideas, or concepts',
      ),
    ).toBeInTheDocument();
    expect(
      wrapper.getByText(
        'Best for a virtual hands-on experience; an experiment',
      ),
    ).toBeInTheDocument();
    expect(
      wrapper.getByText(
        'Best for demonstrating and modeling how to problem solve',
      ),
    ).toBeInTheDocument();
    expect(
      wrapper.getByText(
        'Best for building context to previously learned facts, ideas, or concepts',
      ),
    ).toBeInTheDocument();
    expect(
      wrapper.getByText('Best for applying higher order thinking skills'),
    ).toBeInTheDocument();
    expect(
      wrapper.getByText(
        'Best for reexamining previously learned facts, ideas, or concepts',
      ),
    ).toBeInTheDocument();
    expect(
      wrapper.getByText(
        'Best for flexible and adaptive facts, ideas, or concepts',
      ),
    ).toBeInTheDocument();
  });

  const renderWrapper = (title: string, contents: string) => {
    return render(
      <BoclipsSecurityProvider boclipsSecurity={stubBoclipsSecurity}>
        <QueryClientProvider client={new QueryClient()}>
          <CollapsableFilter title={title} showExplanation>
            <div>{contents}</div>
          </CollapsableFilter>
        </QueryClientProvider>
      </BoclipsSecurityProvider>,
    );
  };
});
