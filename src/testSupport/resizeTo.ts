function resizeTo(width: number, height: number): void {
  const resizeEvent = document.createEvent('Event');
  resizeEvent.initEvent('resize', true, true);

  // @ts-ignore
  window.innerWidth = width;
  // @ts-ignore
  window.innerHeight = height;
  window.dispatchEvent(resizeEvent);
}

export default resizeTo;
