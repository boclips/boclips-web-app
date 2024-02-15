export const downloadFileFromUrl = (fileUrl: string) => {
  const link = document.createElement('a');
  link.href = fileUrl;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
