
export const getSum = (arr = []) => {
  if (arr?.length > 0) {
    const sum = arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return sum;
  }
  return 0;
};
export const getSumRow = (item, type) => {
  let arr = [];
  switch (type) {
    case 'RQ':
      arr = [item.iqc.request, item.oqc.request, item.oqc_1_2.request, item.wrb_oqc.request, item.assy.request, item.mqis.request];
      break;
    case 'RS':
      arr = [item.iqc.respose, item.oqc.respose, item.oqc_1_2.respose, item.wrb_oqc.respose, item.assy.respose, item.mqis.respose];
      break;

    default:
      break;
  }
  return getSum(arr);
};
export const getSumRowPercentage = (item) => {
  const arrRq = getSum([
    item.iqc.request,
    item.oqc.request,
    item.oqc_1_2.request,
    item.wrb_oqc.request,
    item.assy.request,
    item.mqis.request
  ]);
  const arrRs = getSum([
    item.iqc.respose,
    item.oqc.respose,
    item.oqc_1_2.respose,
    item.wrb_oqc.respose,
    item.assy.respose,
    item.mqis.respose
  ]);
  const percentage = getPercentage(arrRs, arrRq);
  return percentage;
};

export const getPercentage = (a, b) => {
  const result = ((a / b) * 100).toFixed();
  if (isNaN(result)) {
    return 0;
  }
  return result;
};
