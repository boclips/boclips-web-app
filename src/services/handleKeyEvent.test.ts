import {
  handleEnterKeyEvent,
  handleEscapeKeyEvent,
} from '@src/services/handleKeyEvent';

describe('Handle key event', () => {
  describe('Handle Enter', () => {
    it('calls callback when Enter is pressed', () => {
      const mock = vi.fn();
      handleEnterKeyEvent(new KeyboardEvent('keyDown', { key: 'Enter' }), mock);
      expect(mock).toHaveBeenCalled();
    });

    it('does not call callback when random key is pressed', () => {
      const mock = vi.fn();
      handleEnterKeyEvent(new KeyboardEvent('keyDown', { key: 'a' }), mock);
      expect(mock).not.toHaveBeenCalled();
    });
  });
  describe('Handle ESC', () => {
    it('calls callback when Esc is pressed', () => {
      const mock = vi.fn();
      handleEscapeKeyEvent(
        new KeyboardEvent('keyDown', { key: 'Escape' }),
        mock,
      );
      expect(mock).toHaveBeenCalled();
    });

    it('does not call callback when random key is pressed', () => {
      const mock = vi.fn();
      handleEscapeKeyEvent(new KeyboardEvent('keyDown', { key: 'a' }), mock);
      expect(mock).not.toHaveBeenCalled();
    });
  });
});
