import config from 'config';
import dayjs from 'dayjs';
import { ConfigRouter } from 'routes/ConfigRouter';
import authReducer from 'store/authReducer';
import { initialState } from 'store/customizationReducer';

const currentDate = dayjs();
// Lấy ngày đầu tiên của tháng hiện tại
export const START_OF_CURRENT_MONTH = currentDate.startOf('month');

// Lấy ngày cuối của thangs hiện tại
export const END_OF_CURRENT_MONTH = currentDate.endOf('month');

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function setCookie(name, value, days) {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}
export function stringAvatar(name) {
  if (!name) return '';
  if (name.includes(' ')) {
    return {
      sx: {
        bgcolor: '#fafafa',
        color:'#005595'
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
    };
  }
  return {
    sx: {
      bgcolor: '#fafafa',
      color:'#005595'
    },
    children: `${name.at(0)}`
  };
}
export function getCookie(name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
export const getDataUserFromLocal = () => {
  const dataStr = localStorage.getItem('DATA_USER');
  if (dataStr) {
    return JSON.parse(dataStr);
  }
  return null;
};

export const delete_cookie = (name) => {
  document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};
export function logout() {
  localStorage.setItem('DATA_USER', null);
  localStorage.setItem('theme', JSON.stringify(initialState));
  setCookie('AUTH', '', 1);
  delete_cookie('AUTH');
  sessionStorage.removeItem('AUTH');
  if (location.pathname !== ConfigRouter.login) {
    window.location.replace(ConfigRouter.login);
    // location.href = ConfigRouter.login;
  }
}
export function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function getDepartmentEditMold(num) {
  let text = '';
  switch (num) { //phat trien
    case 1:
      text = '개발수정';
      
      break;
      case 2: // san xuat
      
      text = '양산수정';
      break;
  
    default:
      break;
  }
  return text;
}

export function addZero(num) {
  const numInt = parseInt(num);
  return (numInt < 10 ? '0' : '') + numInt;
}
function isDate(value) {
  return value instanceof Date;
}
export const formatDateFromDB = (dateString, showTime = true) => {
  if (!dateString) {
    return '';
  }
  // Tạo một đối tượng Date từ chuỗi
  var date = null;
  if (isDate(dateString)) {
    date = dateString;
  } else {
    date = new Date(dateString);
  }
  // Lấy các thành phần ngày
  var day = date.getDate();
  var month = date.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0 nên cần cộng thêm 1
  var year = date.getFullYear();
  if (!showTime) {
    return year + '/' + addZero(month) + '/' + addZero(day);
  }
  // Lấy các thành phần thời gian
  var hours = date.getHours();
  var minutes = date.getMinutes();

  // Hàm để thêm số 0 trước các giá trị nhỏ hơn 10
  // Tạo chuỗi định dạng
  return addZero(hours) + ':' + addZero(minutes) + ' ' + year + '/' + addZero(month) + '/' + addZero(day);
};
export function getExtenstionFromOriginalName(originalname) {
  const resutl = originalname?.includes('.') ? originalname.split('.').pop() : '';

  return resutl;
}

export function isValidFileType(fileExtension) {
  const validFileTypes = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'svg',
    'webp', // Hình ảnh
    'pdf', // Tài liệu
    'mp4',
    'webm',
    'ogg', // Video
    'mp3',
    'wav',
    'ogg', // Âm thanh
    'txt',
    'html',
    'css',
    'js',
    'json', // Các file văn bản
    'doc',
    'docx'
  ];

  return validFileTypes.includes(fileExtension);
}
export function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
}
export const formatNumberWithCommas = (text) => {
  const numericValue = `${text}`.replace(/,/g, ''); // Remove existing commas before formatting
  if (!isNaN(numericValue)) {
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return formattedValue;
  }
};

export const showImageFromAPI = (url) => {
  if (url) {
    const baseUrl = config.baseUrlImage;
    return baseUrl + url;
  }
  return '';
};

export const concatFileNameWithExtension = (fileName, extenstion) => {
  if (extenstion) {
    return fileName + '.' + extenstion;
  }
  return fileName;
};

export const cssScrollbar = {
  // '&::-webkit-scrollbar': {
  //   width: '0.5em', // Narrower scrollbar width
  //   height: '0.6em' // Shorter scrollbar height
  // },
  // '&::-webkit-scrollbar-track': {
  //   boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
  //   webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
  // },
  // '&::-webkit-scrollbar-thumb': {
  //   backgroundColor: '#bdbdbd',
  //   borderRadius: '20px' // Sets border radius for thumb
  // },
  // '&::-webkit-scrollbar-thumb:hover': {
  //   backgroundColor: '#818181'
  // }
};
