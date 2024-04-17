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

export const fetchFile = (fileUrl: string) => {
  fetch(fileUrl).then(async (response) => {
    const blob = await response.blob();
    const fileName = response.headers
      .get('Content-Disposition')
      ?.split('filename=')[1]
      ?.replaceAll('"', '');

    downloadFileFromUrl(URL.createObjectURL(blob), fileName);
  });
};
