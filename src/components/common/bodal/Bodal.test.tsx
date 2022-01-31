import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { Bodal } from 'src/components/common/bodal/Bodal';

describe('The mighty Bodal', () => {
  it('can find the modal by role=dialog', () => {
    const wrapper = render(<Bodal />);
    expect(wrapper.getByRole('dialog')).toBeVisible();
  });

  it('renders the title that is assigned to the modal', () => {
    const wrapper = render(<Bodal title="Hello Bodal" />);
    const bodal = wrapper.getByLabelText('Hello Bodal', {
      selector: '[role=dialog]',
    });
    expect(bodal).toBeVisible();
    expect(wrapper.getByText('Hello Bodal')).toBeVisible();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const handleConfirm = jest.fn();
    const wrapper = render(<Bodal onConfirm={handleConfirm} />);
    const button = wrapper.getByRole('button', { name: 'Confirm' });
    fireEvent.click(button);
    expect(handleConfirm).toBeCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    const handleCancel = jest.fn();
    const wrapper = render(<Bodal onCancel={handleCancel} />);
    const button = wrapper.getByRole('button', { name: 'Cancel' });
    fireEvent.click(button);
    expect(handleCancel).toBeCalledTimes(1);
  });

  it('can change the name of the confirm button', () => {
    const handleConfirm = jest.fn();
    const wrapper = render(
      <Bodal confirmButtonText="Press me!" onConfirm={handleConfirm} />,
    );
    const button = wrapper.getByRole('button', { name: 'Press me!' });
    fireEvent.click(button);
    expect(button).toBeVisible();
    expect(handleConfirm).toBeCalledTimes(1);
  });

  it('can change the name of the cancel button', () => {
    const handleCancel = jest.fn();
    const wrapper = render(
      <Bodal cancelButtonText="Press me!" onCancel={handleCancel} />,
    );
    const button = wrapper.getByRole('button', { name: 'Press me!' });
    fireEvent.click(button);
    expect(button).toBeVisible();
    expect(handleCancel).toBeCalledTimes(1);
  });

  it('renders content', () => {
    const content = <div>Hello</div>;
    const wrapper = render(<Bodal>{content}</Bodal>);
    const renderedContent = wrapper.getByText('Hello');
    expect(renderedContent).toBeVisible();
  });

  it('calls onCancel when clicking on X', () => {
    const handleCancel = jest.fn();
    const wrapper = render(<Bodal onCancel={handleCancel} title="The Bodal" />);
    const closeButton = wrapper.getByLabelText('Close The Bodal modal');
    fireEvent.click(closeButton);
    expect(handleCancel).toBeCalledTimes(1);
  });

  it(`renders a spinner in confirm button when loading and prevents clicking`, () => {
    const onConfirmSpy = jest.fn();
    const wrapper = render(
      <Bodal
        isLoading
        onConfirm={onConfirmSpy}
        title="The Bodal"
        confirmButtonText="confirm with spinner"
      />,
    );
    const confirmButton = wrapper.getByText('confirm with spinner');

    fireEvent.click(confirmButton);
    expect(onConfirmSpy).not.toBeCalled();

    expect(wrapper.getByTestId('spinner')).toBeInTheDocument();
  });

  // Nice to have for later
  xit('calls onCancel when clicking outside of the modal', () => {
    const handleCancel = jest.fn();

    const wrapper = render(
      <div>
        <div>
          <Bodal onCancel={handleCancel} />
        </div>
        <div>Hello</div>
      </div>,
    );

    fireEvent.click(wrapper.getByText('Hello'));
    expect(handleCancel).toBeCalledTimes(1);
  });
});
