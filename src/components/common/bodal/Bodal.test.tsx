import { fireEvent, render, waitFor } from '@testing-library/react';
import React from 'react';
import { Bodal } from '@src/components/common/bodal/Bodal';
import { InputText } from '@boclips-ui/input';
import userEvent from '@testing-library/user-event';

describe('The mighty Bodal', () => {
  beforeEach(() => {
    window.resizeTo(1680, 1024);
  });
  it('can find the modal by role=dialog', () => {
    const wrapper = render(
      <Bodal title="Title">
        <span>i must be here!</span>
      </Bodal>,
    );
    expect(wrapper.getByRole('dialog')).toBeVisible();
  });

  it('renders the title that is assigned to the modal', () => {
    const wrapper = render(
      <Bodal title="Hello Bodal">
        <span>i must be here!</span>
      </Bodal>,
    );
    const bodal = wrapper.getByLabelText('Hello Bodal', {
      selector: '[role=dialog]',
    });
    expect(bodal).toBeVisible();
    expect(wrapper.getByText('Hello Bodal')).toBeVisible();
  });

  it('has describedby attribute assigned to the modal', () => {
    const wrapper = render(
      <Bodal title="Hello Bodal">
        <span>i must be here!</span>
      </Bodal>,
    );
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
    const wrapper = render(
      <Bodal title="Title" onConfirm={handleConfirm}>
        <span>i must be here!</span>
      </Bodal>,
    );
    const button = wrapper.getByRole('button', { name: 'Confirm' });
    fireEvent.click(button);
    expect(handleConfirm).toBeCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    const handleCancel = jest.fn();
    const wrapper = render(
      <Bodal title="Title" onCancel={handleCancel}>
        <span>i must be here!</span>
      </Bodal>,
    );
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
      >
        <span>i must be here!</span>
      </Bodal>,
    );

    const button = wrapper.getByRole('button', { name: 'Press me!' });
    fireEvent.click(button);
    expect(button).toBeVisible();
    expect(handleConfirm).toBeCalledTimes(1);
  });

  it('can change the name of the cancel button', () => {
    const handleCancel = jest.fn();
    const wrapper = render(
      <Bodal title="Title" cancelButtonText="Press me!" onCancel={handleCancel}>
        <span>i must be here!</span>
      </Bodal>,
    );
    const button = wrapper.getByRole('button', { name: 'Press me!' });
    fireEvent.click(button);
    expect(button).toBeVisible();
    expect(handleCancel).toBeCalledTimes(1);
  });

  it(`doesn't display cancel button if displayCancelButton set to false`, () => {
    const wrapper = render(
      <Bodal
        title="Title"
        cancelButtonText="Press me!"
        displayCancelButton={false}
      >
        <span>i must be here!</span>
      </Bodal>,
    );
    const button = wrapper.queryByRole('button', { name: 'Press me!' });
    expect(button).toBeNull();
  });

  it('renders content', () => {
    const content = <div>Hello</div>;
    const wrapper = render(<Bodal title="Title">{content}</Bodal>);
    const renderedContent = wrapper.getByText('Hello');
    expect(renderedContent).toBeVisible();
  });

  it('calls onCancel when clicking on X', () => {
    const handleCancel = jest.fn();
    const wrapper = render(
      <Bodal onCancel={handleCancel} title="The Bodal">
        <span>i must be here!</span>
      </Bodal>,
    );
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
      >
        <span>i must be here!</span>
      </Bodal>,
    );
    const confirmButton = wrapper.getByText('confirm with spinner');

    fireEvent.click(confirmButton);
    expect(onConfirmSpy).not.toBeCalled();

    expect(wrapper.getByTestId('spinner')).toBeInTheDocument();
  });

  it(`attempts to cancel on pressing esc`, () => {
    const cancelSpy = jest.fn();
    const wrapper = render(
      <Bodal title="test" onCancel={cancelSpy}>
        <span>i must be here!</span>
      </Bodal>,
    );

    fireEvent.keyDown(wrapper.getByRole('dialog'), { key: 'Escape' });

    expect(cancelSpy).toHaveBeenCalledTimes(1);
  });

  it(`sets focus on requested element`, () => {
    const inputRef = React.createRef<HTMLInputElement>();

    const wrapper = render(
      <Bodal title="test" initialFocusRef={inputRef}>
        <div>skip focus</div>
        <InputText
          onChange={jest.fn()}
          id="no-focus-text"
          labelText="dont-focus-input"
          inputType="text"
        />
        <InputText
          onChange={jest.fn()}
          id="focus-text"
          ref={inputRef}
          labelText="Focus me"
          inputType="text"
        />
      </Bodal>,
    );

    expect(wrapper.getByLabelText('Focus me')).toHaveFocus();
  });

  it(`traps focus to bodal`, async () => {
    const inputRef = React.createRef<HTMLInputElement>();
    const user = userEvent.setup();

    const wrapper = render(
      <div data-qa="main">
        <InputText
          id="no-focus-text"
          labelText="Don't focus me"
          inputType="text"
          onChange={jest.fn()}
        />
        <Bodal
          title="test"
          initialFocusRef={inputRef}
          onCancel={jest.fn()}
          onConfirm={jest.fn()}
        >
          <InputText
            onChange={jest.fn()}
            id="focus-text"
            ref={inputRef}
            labelText="Focus me"
            inputType="text"
          />
        </Bodal>
      </div>,
    );

    expect(wrapper.getByLabelText('Focus me')).toHaveFocus();
    user.tab();

    await waitFor(() =>
      expect(wrapper.getByRole('button', { name: 'Cancel' })).toHaveFocus(),
    );
    user.tab();
    await waitFor(() =>
      expect(wrapper.getByRole('button', { name: 'Confirm' })).toHaveFocus(),
    );
    user.tab();
    await waitFor(() =>
      expect(wrapper.getByLabelText('Close test modal')).toHaveFocus(),
    );

    expect(wrapper.getByLabelText("Don't focus me")).not.toHaveFocus();
  });

  it('onCancel invoked when mouse down outside of bodal when closeOnClickOutside prop is set', () => {
    const handleOnCancel = jest.fn();
    const wrapper = render(
      <Bodal title="Hello Bodal" onCancel={handleOnCancel} closeOnClickOutside>
        <span>i must be here!</span>
      </Bodal>,
    );
    const bodal = wrapper.getByRole('dialog');

    fireEvent.mouseDown(bodal);

    expect(handleOnCancel).toBeCalledTimes(1);
  });

  it('onCancel invoked when mouse down outside of bodal and closeOnClickOutside prop not set', () => {
    const handleOnCancel = jest.fn();
    const wrapper = render(
      <Bodal title="Bodal" onCancel={handleOnCancel}>
        <span>i must be here!</span>
      </Bodal>,
    );
    const bodal = wrapper.getByRole('dialog');

    fireEvent.mouseDown(bodal);

    expect(handleOnCancel).toBeCalledTimes(1);
  });

  it('onCancel not invoked when mouse down outside of bodal but closeOnClickOutside prop set to false', () => {
    const handleOnCancel = jest.fn();
    const wrapper = render(
      <Bodal
        title="Bodal"
        onCancel={handleOnCancel}
        closeOnClickOutside={false}
      >
        <span>i must be here!</span>
      </Bodal>,
    );
    const bodal = wrapper.getByRole('dialog');

    fireEvent.mouseDown(bodal);

    expect(handleOnCancel).toBeCalledTimes(0);
  });

  it('onCancel invoked when escape key down (when escape pressed with no focus on/within bodal)', () => {
    const handleOnCancel = jest.fn();
    const wrapper = render(
      <Bodal title="Hello Bodal" onCancel={handleOnCancel} closeOnClickOutside>
        <span>i must be here!</span>
      </Bodal>,
    );

    const body = wrapper.baseElement;
    fireEvent.keyDown(body, { key: 'Escape' });

    expect(handleOnCancel).toBeCalledTimes(1);
  });

  it('renders extraButton element if provided', () => {
    const wrapper = render(
      <Bodal
        title="Hello Bodal"
        onCancel={jest.fn}
        extraButton={<div>Second button!</div>}
      >
        <span>i must be here!</span>
      </Bodal>,
    );

    expect(wrapper.getByText('Second button!')).toBeVisible();
  });

  it('confirm button disabled if button disabled', () => {
    const wrapper = render(
      <Bodal
        title="Hello Bodal"
        onCancel={jest.fn}
        extraButton={<div>Second button!</div>}
        isConfirmEnabled={false}
      >
        <span>i must be here!</span>
      </Bodal>,
    );

    expect(wrapper.getByRole('button', { name: 'Confirm' })).toBeDisabled();
  });

  it('confirm button disabled if isLoading', () => {
    const wrapper = render(
      <Bodal
        title="Hello Bodal"
        onCancel={jest.fn}
        extraButton={<div>Second button!</div>}
        isLoading
      >
        <span>i must be here!</span>
      </Bodal>,
    );
    expect(
      wrapper.getByRole('button', { name: 'loading Confirm' }),
    ).toBeDisabled();
  });

  it('confirm button enabled if isLoading is false and confirm is enabled', () => {
    const wrapper = render(
      <Bodal
        title="Hello Bodal"
        onCancel={jest.fn}
        extraButton={<div>Second button!</div>}
        isLoading={false}
        isConfirmEnabled
      >
        <span>i must be here!</span>
      </Bodal>,
    );
    expect(wrapper.getByRole('button', { name: 'Confirm' })).toBeEnabled();
  });
});
