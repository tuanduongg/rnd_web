export const LIST_COL = [
  { canHide: false, align: 'center', name: '#', id: '#', width: 20 },
  { canHide: false, align: 'center', name: 'Time', id: 'time', width: 120 },
  { canHide: false, align: 'center', name: 'Category', id: 'category', width: 100 },
  { canHide: false, align: 'center', name: 'Model', id: 'model', width: 120 },
  { canHide: false, align: 'center', name: 'Code', id: 'code', width: 120 },
  { canHide: true, align: 'center', name: 'Item', id: 'item', width: 150 },
  { canHide: true, align: 'center', name: 'P/L Name', id: 'PL_name', width: 100 },
  { canHide: false, align: 'center', name: '불량명<br/>(Tên Lỗi)', id: 'NG_name', width: 115 },
  { canHide: false, align: 'center', name: 'Tỷ lệ', id: 'percentage', width: 100 },
  { canHide: true, align: 'center', name: '고객<br/>(Khách hàng)', id: 'supplier', width: 130 },
  { canHide: false, align: 'center', name: '부적합 통보<br/>(BP)', id: 'stage', width: 100 },
  { canHide: true, align: 'center', name: '귀책처<br/>(Chịu trách nhiệm)', id: 'attributable', width: 150 },
  { canHide: true, align: 'center', name: '공급 업체 담당자<br/>(Đại diện NCC)', id: 'supplierRepresentative', width: 150 },
  // { canHide: false, align: 'center', name: '불량 사진', id: 'photo', width: 100 },
  { canHide: true, align: 'center', name: '불량원인<br/>(Nguyên nhân lỗi)', id: 'tech_NG', width: 150 },
  { canHide: true, align: 'center', name: '임시조치<br/>(Biện pháp)', id: 'tempSolution', width: 200 },
  { canHide: true, align: 'center', name: 'Seowon Stock', id: 'SW_Stock', width: 80 },
  { canHide: true, align: 'center', name: 'Vendor Stock', id: 'vendorStock', width: 80 },
  { canHide: false, align: 'center', name: '요청 일자<br/>(Request Date)', id: 'requestDate', width: 150 },
  // { canHide: false, align: 'center', name: '첨부자료<br/>(File)', id: 'file', width: 100 },
  { canHide: false, align: 'center', name: '회신 일자<br/>(Reply Date)', id: 'replyDate', width: 150 },
  { canHide: true, align: 'center', name: '등록자<br/>(Người đăng ký)', id: 'author', width: 150 },
  { canHide: true, align: 'center', name: '조치사항<br/>(Hành động đã thực hiện)', id: 'remark', width: 200 }
];

export const ITEM_HEIGHT = 48;
export const itemData = [
  {
    img: 'http://10.0.4.20:5005/uploads/qc/a.PNG',
    title: 'Breakfast',
    rows: 2,
    cols: 2
  },
  {
    img: 'http://10.0.4.20:5005/uploads/qc/b.PNG',
    title: 'Burger'
  },
  {
    img: 'http://10.0.4.20:5005/uploads/qc/c.PNG',
    title: 'Camera'
  },
  {
    img: 'http://10.0.4.20:5005/uploads/qc/a.PNG',
    title: 'Coffee',
    cols: 2
  },
  {
    img: 'http://10.0.4.20:5005/uploads/qc/a.PNG',
    title: 'Hats',
    cols: 2
  },
  {
    img: 'http://10.0.4.20:5005/uploads/qc/a.PNG',
    title: 'Honey',
    author: '@arwinneil',
    rows: 2,
    cols: 2
  },
  {
    img: 'http://10.0.4.20:5005/uploads/qc/a.PNG',
    title: 'Basketball'
  },
  {
    img: 'http://10.0.4.20:5005/uploads/qc/a.PNG',
    title: 'Fern'
  },
  {
    img: 'http://10.0.4.20:5005/uploads/qc/a.PNG',
    title: 'Mushrooms',
    rows: 2,
    cols: 2
  },
  {
    img: 'http://10.0.4.20:5005/uploads/qc/a.PNG',
    title: 'Tomato basil'
  },
  {
    img: 'http://10.0.4.20:5005/uploads/qc/a.PNG',
    title: 'Sea star'
  },
  {
    img: 'http://10.0.4.20:5005/uploads/qc/a.PNG',
    title: 'Bike',
    cols: 2
  }
];
export function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`
  };
}

export const getShift = (type) => {
  let result = '';
  switch (type) {
    case 'D':
      result = 'Day';
      break;
    case 'N':
      result = 'Night';
      break;

    default:
      break;
  }
  return result;
};

export const initValueCel = {
  categoryId: 'total',
  categoryName: 'Total',
  sumRowReply: 1,
  sumRowRequest: 4,
  processArr: [
    {
      processId: 1,
      processName: 'IQC',
      counterRequest: 0,
      counterReply: 0,
      percetageCel: 0
    },
    {
      processId: 2,
      processName: 'WRB OQC',
      counterRequest: 1,
      counterReply: 0,
      percetageCel: '0'
    },
    {
      processId: 3,
      processName: 'OQC1',
      counterRequest: 2,
      counterReply: 1,
      percetageCel: '50'
    },
    {
      processId: 4,
      processName: 'OQC 2',
      counterRequest: 0,
      counterReply: 0,
      percetageCel: 0
    },
    {
      processId: 5,
      processName: 'Assy',
      counterRequest: 0,
      counterReply: 0,
      percetageCel: 0
    },
    {
      processId: 6,
      processName: 'MQIS',
      counterRequest: 1,
      counterReply: 0,
      percetageCel: '0'
    }
  ],
  percentage: '25'
};
