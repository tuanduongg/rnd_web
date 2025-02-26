import { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { DatePicker } from '@mui/x-date-pickers';
import { IconFileSpreadsheet, IconSearch } from '@tabler/icons-react';
import dayjs from 'dayjs';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { saveAs } from 'file-saver';
const currentDate = dayjs();
// Lấy ngày đầu tiên của tháng hiện tại
const firstDayOfCurrentMonth = currentDate.startOf('month');

// Lấy ngày đầu tiên của tháng trước
const firstDayOfLastMonth = firstDayOfCurrentMonth.subtract(1, 'month');

// Lấy ngày đầu tiên của tháng sau
const firstDayOfNextMonth = firstDayOfCurrentMonth.add(1, 'month');
// const mereArr = (a, b) => {
//   const mergedArray = a.map((item) => {
//     const matchedItem = b.find((bItem) => bItem.processId === item.processId);
//     return {
//       ...item,
//       dateRequestCount: matchedItem ? matchedItem.dateRequestCount : 0,
//       dateReplyCount: matchedItem ? matchedItem.dateReplyCount : 0
//     };
//   });
//   return mergedArray;
// };
const Statistic = ({ listProcess, setLoading, dataStatistic, startDate, setStartDate, endDate, setEndDate, statistic, onClickSearch }) => {
  const onClickDownLoadExcel = async () => {
    // setLoading(true);
    const response = await restApi.post(
      RouterApi.exportStatisticReportQC,
      { data: dataStatistic },
      {
        responseType: 'arraybuffer'
      }
    );
    // setLoading(false);
    if (response?.status === 200) {
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, 'Export_Statistic.xlsx');
    } else {
      alert('Download file fail!');
    }
  };
  const onExportExcel = async () => {
    onClickDownLoadExcel();
  };
  return (
    <>
      <MainCard contentSX={{ padding: '13px' }}>
        <Typography variant="h4" component={'h4'} mb={2}>
          Statistic
        </Typography>
        <Stack direction="row" justifyContent="space-between" spacing={1}>
          <Stack sx={{ maxWidth: '500px' }} spacing={2} direction="row" alignItems={'center'} justifyContent="space-between">
            <DatePicker
              onChange={(newValue) => {
                setStartDate(newValue);
              }}
              value={startDate}
              sx={{ maxWidth: '160px' }}
              views={['year', 'month', 'day']}
              format="YYYY/MM/DD"
              slotProps={{ textField: { size: 'small' } }}
              label="From"
            />
            <Box>~</Box>
            <DatePicker
              onChange={(newValue) => {
                setEndDate(newValue);
              }}
              value={endDate}
              sx={{ maxWidth: '160px' }}
              autoOk={false}
              views={['year', 'month', 'day']}
              format="YYYY/MM/DD"
              slotProps={{ textField: { size: 'small' } }}
              label="To"
            />
            <Button
              onClick={() => {
                statistic();
              }}
              variant="contained"
              size="small"
              startIcon={<IconSearch />}
            >
              Search
            </Button>
          </Stack>
          <Button
            onClick={() => {
              onExportExcel();
            }}
            startIcon={<IconFileSpreadsheet />}
            size="small"
            variant="contained"
          >
            Excel
          </Button>
        </Stack>
        <Box mt={1}>
          <Stack width={'100%'} direction={'row'}>
            <Box width={'13%'} className="cell-head-custom">
              카테고리
            </Box>
            <Box width={'17%'} className="cell-head-custom">
              구분
            </Box>
            {dataStatistic?.length > 0 &&
              dataStatistic[0]?.processArr?.map((head, index) => (
                <Box width={'12%'} key={index} className="cell-head-custom">
                  {head?.processName}
                </Box>
              ))}
            <Box
              width={'10%'}
              sx={{
                textAlign: 'center',
                border: '1px solid #ffff',
                fontWeight: 'bold',
                padding: '5px',
                color: 'white',
                backgroundColor: '#333'
              }}
            >
              Total
            </Box>
          </Stack>
          {dataStatistic?.map((item, index) => (
            <Stack key={index} width={'100%'} direction={'row'}>
              <Box
                width={'13%'}
                sx={{
                  borderLeft: '1px solid #333',
                  borderBottom: '1px solid #333',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  lineHeight: '77px',
                  backgroundColor: item?.categoryName === 'Total' ? '#333' : 'rgba(0, 85, 149, 0.12)',
                  color: item?.categoryName === 'Total' ? '#ffff' : '#005595'
                }}
              >
                {item?.categoryName}
              </Box>
              <Box width={'17%'} sx={{ borderLeft: '1px solid #333' }}>
                <Box className="cell-custom">통보서(Thông báo)</Box>
                <Box className="cell-custom">대책서(Đối sách)</Box>
                <Box
                  sx={{borderLeft: item?.categoryName === 'Total' ?  '0.1px solid #ffff' : '', color: item?.categoryName === 'Total' ? '#ffff' : '', backgroundColor:  item?.categoryName === 'Total' ? '#333' : 'rgba(0, 85, 149, 0.12)' }}
                  className="cell-custom"
                >
                  완료율(Tỷ lệ)
                </Box>
              </Box>
              {item?.processArr &&
                item?.processArr.map((processItem, index) => (
                  <Box
                    key={index}
                    width={'12%'}
                    sx={{
                      borderLeft: '1px solid #333'
                    }}
                  >
                    <Box className={'cell-custom'}>{processItem?.counterRequest === 0 ? '' : processItem?.counterRequest}</Box>
                    <Box className={'cell-custom'}>{processItem?.counterReply === 0 ? '' : processItem?.counterReply}</Box>
                    <Box
                      sx={{
                        borderLeft: item?.categoryName === 'Total' ?  '0.1px solid #ffff' : '',
                        backgroundColor: item?.categoryName === 'Total' ? '#333' : 'rgba(0, 85, 149, 0.12)',
                        color: item?.categoryName === 'Total' ? '#ffff' : ''
                      }}
                      className={'cell-custom'}
                    >
                      {processItem?.percetageCel}%
                    </Box>
                  </Box>
                ))}
              <Box width={'10%'} sx={{ borderLeft: '1px solid #333', borderRight: '1px solid #333' }}>
                <Box className={'cell-custom'}>{item?.sumRowRequest}</Box>
                <Box className={'cell-custom'}>{item?.sumRowReply}</Box>
                <Box
                  sx={{
                    borderLeft: item?.categoryName === 'Total' ?  '0.1px solid #ffff' : '',
                    color: item?.categoryName === 'Total' ? '#ffff' : '',
                    backgroundColor: item?.categoryName === 'Total' ? '#333' : 'rgba(0, 85, 149, 0.12)'
                  }}
                  className={'cell-custom'}
                >
                  {item?.percentage}%
                </Box>
              </Box>
            </Stack>
          ))}
        </Box>
      </MainCard>
    </>
  );
};

export default Statistic;
