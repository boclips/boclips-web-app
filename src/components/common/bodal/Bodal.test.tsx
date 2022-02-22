import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { Bodal } from 'src/components/common/bodal/Bodal';
import { BoInputText } from 'src/components/common/input/BoInputText';
import userEvent from '@testing-library/user-event';

describe('The mighty Bodal', () => {
  beforeEach(() => {
    window.resizeTo(1680, 1024);
  });
  it('can find the modal by role=dialog', () => {
    const wrapper = render(<Bodal title="Title" />);
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

  it('has describedby attribute assigned to the modal', () => {
    const wrapper = render(<Bodal title="Hello Bodal" />);
    const modal = wrapper.getByRole('dialog');
    const screenReaderText = wrapper.getByText(
      'This is a dialog for Hello Bodal. Escape will cancel and close the window.',
    );

    expect(modal.getAttribute('aria-describedby')).toEqual('bodal-description');
    expect(screenReaderText.getAttribute('id')).toEqual('bodal-description');
    expect(screenReaderText).not.toBeVisible();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const handleConfirm = jest.fn();
    const wrapper = render(<Bodal title="Title" onConfirm={handleConfirm} />);
    const button = wrapper.getByRole('button', { name: 'Confirm' });
    fireEvent.click(button);
    expect(handleConfirm).toBeCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    const handleCancel = jest.fn();
    const wrapper = render(<Bodal title="Title" onCancel={handleCancel} />);
    const button = wrapper.getByRole('button', { name: 'Cancel' });
    fireEvent.click(button);
    expect(handleCancel).toBeCalledTimes(1);
  });

  it('can change the name of the confirm button', () => {
    const handleConfirm = jest.fn();
    const wrapper = render(
      <Bodal
        title="Title"
        confirmButtonText="Press me!"
        onConfirm={handleConfirm}
      />,
    );
    const button = wrapper.getByRole('button', { name: 'Press me!' });
    fireEvent.click(button);
    expect(button).toBeVisible();
    expect(handleConfirm).toBeCalledTimes(1);
  });

  it('can change the name of the cancel button', () => {
    const handleCancel = jest.fn();
    const wrapper = render(
      <Bodal
        title="Title"
        cancelButtonText="Press me!"
        onCancel={handleCancel}
      />,
    );
    const button = wrapper.getByRole('button', { name: 'Press me!' });
    fireEvent.click(button);
    expect(button).toBeVisible();
    expect(handleCancel).toBeCalledTimes(1);
  });

  it('renders content', () => {
    const content = <div>Hello</div>;
    const wrapper = render(<Bodal title="Title">{content}</Bodal>);
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

  it(`attempts to cancel on pressing esc`, () => {
    const cancelSpy = jest.fn();
    const wrapper = render(<Bodal title="test" onCancel={cancelSpy} />);

    fireEvent.keyDown(wrapper.getByRole('dialog'), { key: 'Escape' });

    expect(cancelSpy).toHaveBeenCalledTimes(1);
  });

  it(`sets focus on requested element`, () => {
    const inputRef = React.createRef<HTMLInputElement>();

    const wrapper = render(
      <Bodal title="test" initialFocusInputRef={inputRef}>
        <div>skip focus</div>
        <BoInputText label="dont-focus-input" inputType="text" />
        <BoInputText ref={inputRef} label="Focus me" inputType="text" />
      </Bodal>,
    );

    expect(wrapper.getByLabelText('Focus me (Optional)')).toHaveFocus();
  });

  it(`traps focus to bodal`, () => {
    const inputRef = React.createRef<HTMLInputElement>();

    const wrapper = render(
      <div data-qa="main">
        <Bodal title="test" initialFocusInputRef={inputRef}>
          <BoInputText ref={inputRef} label="Focus me" inputType="text" />
        </Bodal>
        <BoInputText label="Don't focus me" inputType="text" />
      </div>,
    );

    expect(wrapper.getByLabelText('Focus me (Optional)')).toHaveFocus();
    userEvent.tab();
    expect(wrapper.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    userEvent.tab();
    expect(wrapper.getByRole('button', { name: 'Confirm' })).toHaveFocus();
    userEvent.tab();

    expect(wrapper.getByLabelText('Close test modal')).toHaveFocus();
    expect(
      wrapper.getByLabelText("Don't focus me (Optional)"),
    ).not.toHaveFocus();
  });

  // Nice to have for later
  xit('calls onCancel when clicking outside of the modal', () => {
    const handleCancel = jest.fn();

    const wrapper = render(
      <div>
        <div>
          <Bodal title="Title" onCancel={handleCancel} />
        </div>
        <div>Hello</div>
      </div>,
    );

    fireEvent.click(wrapper.getByText('Hello'));
    expect(handleCancel).toBeCalledTimes(1);
  });
});
