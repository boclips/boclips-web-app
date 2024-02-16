export const downloadFileFromUrl = (fileUrl: string, filename?: string) => {
  const link = document.createElement('a');
  link.href = fileUrl;

  if (filename) {
    link.setAttribute('download', filename);
  }
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
