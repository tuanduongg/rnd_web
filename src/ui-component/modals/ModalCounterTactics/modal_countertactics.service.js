import dayjs from 'dayjs';

export const initValidate = { error: false, msg: '' };
export const currentDate = dayjs();
export const currenWeekNum = dayjs().week();
export const inititalValueForm = {
  shift: 'D',
  week: currenWeekNum,
  date: currentDate,
  category: '',
  ngName: '',
  percentage: '',
  code: '',
  process: '',
  model: '',
  supplier: '',
  plName: '',
  attributable: '',
  item: '',
  representative: '',
  seowonStock: '',
  vendorStock: '',
  tempSolution: '',
  techNg: '',
  remark: '',
  author: '',
  requestDate: currentDate,
  replyDate: null
};
export const inititalValidateForm = {
  shift: initValidate,
  week: initValidate,
  date: initValidate,
  category: initValidate,
  ngName: initValidate,
  percentage: initValidate,
  code: initValidate,
  process: initValidate,
  author: initValidate,
  model: initValidate,
  supplier: initValidate,
  plName: initValidate,
  attributable: initValidate,
  item: initValidate,
  representative: initValidate,
  seowonStock: initValidate,
  vendorStock: initValidate,
  tempSolution: initValidate,
  techNg: initValidate,
  remark: initValidate,
  requestDate: initValidate,
  replyDate: initValidate
};
export const listObjDate = ['date', 'requestDate', 'replyDate'];
export const arrFieldNum = [
  'seowonStock',
  'vendorStock',
];
export const arrNoValidate = [
  'supplier',
  'plName',
  'attributable',
  'representative',
  'seowonStock',
  'vendorStock',
  'tempSolution',
  'techNg',
  'remark',
  'requestDate',
  'replyDate'
];
