const mobileMaxWidth = 768;
const tabletMaxWidth = 1148;
const desktopMaxWidth = 9999;

function resizeTo(width: number, height: number): void {
  const resizeEvent = document.createEvent('Event');
  resizeEvent.initEvent('resize', true, true);

  // @ts-ignore
  window.innerWidth = width;
  // @ts-ignore
  window.innerHeight = height;
  window.dispatchEvent(resizeEvent);
}

export function resizeToMobile(height = 1024) {
  resizeTo(mobileMaxWidth - 1, height);
}

export function resizeToTablet(height = 1024) {
  resizeTo(tabletMaxWidth - 1, height);
}

export function resizeToDesktop(height = 1024) {
  resizeTo(desktopMaxWidth - 1, height);
}

export default resizeTo;
