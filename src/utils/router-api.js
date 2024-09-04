export const RouterApi = {
  login: '/auth/login',
  createUser: '/user/create',
  updateUser: '/user/update',
  userAll: '/user/all',
  userPublic: '/user/public',
  userGetStorage: '/user/get-storage',
  findUser: '/user/find',
  changePasswordUser: '/user/changePassword',
  checkRole: '/user/checkRole',
  roleAll: '/role/all',
  cateConceptAll: '/category-concept/all',

  conceptAdd: '/concept/add',
  conceptFindByCode: '/concept/findByCode',
  conceptUpdate: '/concept/update',
  conceptHistory: '/concept/history',
  conceptAll: '/concept/all',
  conceptDelete: '/concept/delete',
  conceptDetail: '/concept/detail',
  conceptAccept: '/concept/accept',
  conceptDownload: '/concept/download',
  conceptDownloadMultiple: '/concept/download-multiple',

  processAll: '/process/all',

  getImagesByReportQC: '/file-report-qc/findByReportId',

  addReportQC: '/report-qc/add',
  updateReportQC: '/report-qc/update',
  deleteReportQC: '/report-qc/delete',
  allReportQC: '/report-qc/all',
  // statisticReportQC: '/report-qc/statistic',
  statisticReportQC: '/category-concept/statisticReportQC',
  downloadFileReportQC: '/file-report-qc/download',
  exportStatisticReportQC: '/report-qc/exportExcel-statistic',

  allJIG: '/jig/all',
  addJIG: '/jig/create',
  findByAssetNoJIG: '/jig/findByAssetNo',
  deleteJIG: '/jig/delete',
  updateJIG: '/jig/update',

  findInOutJigByJig: '/inout-jig/findByJig'
};
