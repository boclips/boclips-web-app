export const handleEnterKeyEvent = (event, callback) =>
  handleKey(event, callback, 'Enter');

export const handleEscapeKeyEvent = (event, callback) =>
  handleKey(event, callback, 'Escape');

const handleKey = (event, callback, key) => {
  if (event.key === key) {
    callback();
  }
};
