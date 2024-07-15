export const showNameFile = (fileName, fileExtenstion) => {
  let result = '';
  if (fileName) {
    result += fileName;
  }
  if (fileExtenstion) {
    result += '.' + fileExtenstion;
  }
  return result;
};
