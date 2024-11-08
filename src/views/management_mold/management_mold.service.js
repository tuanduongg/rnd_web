import { Chip } from '@mui/material';

export const LIST_COL_MOLD = [
  { canHide: false, align: 'center', name: '#', id: '#', width: 20 },
  { canHide: false, align: 'center', name: 'Category', id: 'category', width: 100 },
  { canHide: false, align: 'center', name: 'Project', id: 'project', width: 100, sx: { marginRight: '10px' } },
  { canHide: false, align: 'center', name: ' 구분', id: 'type', width: 100 },
  { canHide: false, align: 'center', name: 'Model', id: 'model', width: 100 },
  // { canHide: true, align: 'center', name: 'Description', id: 'description', width: 150 },
  { canHide: false, align: 'center', name: 'Mold No.', id: 'moldNo', width: 100 },
  { canHide: true, align: 'center', name: '제작업체<br/>NSX', id: 'manufacturer', width: 100 },
  { canHide: true, align: 'center', name: '발송지역<br/>Nơi VC', id: 'shipArea', width: 120 },
  { canHide: true, align: 'center', name: '출고 계획<br/>T.Gian VC', id: 'shipDate', width: 100 },
  { canHide: true, align: 'center', name: '양산업체<br/>Cty SX', id: 'massCompany', width: 100 },
  { canHide: true, align: 'center', name: '개발등록<br/>(RnD)', id: 'developDate', width: 100 },
  { canHide: true, align: 'center', name: '양산업체입고<br/>Thời gian', id: 'shipMassCompany', width: 110 },
  { canHide: true, align: 'center', name: '수정업체<br/>Nơi sửa', id: 'modificationCompany', width: 100 },
  { canHide: true, align: 'center', name: '수리 출고<br/>X.Kho sửa', id: 'outputEdit', width: 100 },
  { canHide: true, align: 'center', name: '입고 계획<br/>KH sửa', id: 'wearingPlan', width: 100 },
  { canHide: true, align: 'center', name: '입고 완료<br/>T.tế sửa', id: 'receivingCompleted', width: 100 },
  { canHide: true, align: 'center', name: 'TRY NO.', id: 'tryNo', width: 100 },
  { canHide: true, align: 'center', name: '수정내역<br/>Nội dung sửa', id: 'historyEdit', width: 150 },
  { canHide: true, align: 'center', name: '양산적용<br/>Trạng thái', id: 'productionStatus', width: 100 }
];
export const LIST_STATUS = [
  { id: 'DEV', name: '개발중(Đang phát triển)', value: 'DEV' },
  { id: 'EDIT', name: '양산수정(Sản xuất sửa)', value: 'EDIT' },
  { id: 'DEV_EDIT', name: '개발수정(Phát triển sửa)', value: 'DEV_EDIT' },
  { id: 'USE', name: '양산중(Đang sử dụng)', value: 'USE' },
  { id: 'RISK', name: 'Risk양산(Rủi ro sản xuất)', value: 'RISK' },
  { id: 'STOP', name: '사용중지(Ngừng sử dụng)', value: 'STOP' }
];

