import { getClassWithColor } from "file-icons-js";

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
export const getIcon = (file) => {
  let check = getClassWithColor(!file?.fileName ? file?.name : showNameFile(file?.fileName, file?.fileExtenstion));
  if (check) {
    return check + ' iconcustom_modal';
  }
  return 'text-icon medium-blue iconcustom_modal'
}