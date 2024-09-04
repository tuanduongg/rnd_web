import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useTheme
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import { styled } from '@mui/material/styles';
import './counter_tactics.css';
import Statistic from './component/Statistic';
import TableList from './component/TableList';
import ModalCounterTactics from 'ui-component/modals/ModalCounterTactics/ModalCounterTactics';
import { useEffect, useState } from 'react';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import Loading from 'ui-component/Loading';
import { getPercentage } from './counter_tactis.service';
import dayjs from 'dayjs';

const currentDate = dayjs();
// Lấy ngày đầu tiên của tháng hiện tại
const firstDayOfCurrentMonth = currentDate.startOf('month');

// Lấy ngày đầu tiên của tháng trước
const firstDayOfLastMonth = firstDayOfCurrentMonth.subtract(1, 'month');

// Lấy ngày đầu tiên của tháng sau
const firstDayOfNextMonth = firstDayOfCurrentMonth.add(1, 'month');
// ==============================|| SAMPLE PAGE ||============================== //

const CounterTacticsPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [listProcess, setListProcess] = useState([]);
  const [dataStatistic, setDataStatistic] = useState([]);
  const [startDate, setStartDate] = useState(firstDayOfLastMonth);
  const [endDate, setEndDate] = useState(firstDayOfNextMonth);

  const statistic = async () => {
    setLoading(true);
    const res = await restApi.post(RouterApi.statisticReportQC, {
      startDate: startDate?.hour(0).minute(0).second(0),
      endDate: endDate?.hour(23).minute(59).second(59)
    });
    setLoading(false);
    if (res?.status == 200) {
      const data = res?.data;
      const dataChange = data.map((item) => {
        const listReport = item?.reportQC;
        let sumRowRequest = 0;
        let sumRowReply = 0;
        const processArr = listProcess?.map((process) => {
          let counterRequest = 0;
          let counterReply = 0;
          listReport.map((report) => {
            if (report?.processQC?.processId === process?.processId) {
              if (report?.dateRequest) {
                counterRequest++;
              }
              if (report?.dateReply) {
                counterReply++;
              }
            }
          });
          sumRowRequest += counterRequest;
          sumRowReply += counterReply;
          return { ...process, counterRequest, counterReply, percetageCel: getPercentage(counterReply, counterRequest) };
        });
        return {
          categoryId: item?.categoryId,
          categoryName: item?.categoryName,
          sumRowRequest,
          sumRowReply,
          percentage: getPercentage(sumRowReply, sumRowRequest),
          processArr
        };
      });

      const resutProcess = dataChange[0]?.processArr?.map((process) => {
        let sumRequest = 0;
        let sumReply = 0;
        dataChange.map((itemChange) => {
          const find = itemChange.processArr.find((row) => row?.processId === process?.processId);
          if (find) {
            sumRequest += find?.counterRequest;
            sumReply += find?.counterReply;
          }
        });
        return {
          processId: process?.processId,
          processName: process?.processName,
          counterRequest: sumRequest,
          counterReply: sumReply,
          percetageCel: getPercentage(sumReply, sumRequest)
        };
      });
      let sumRowReply = 0;
      let sumRowRequest = 0;
      resutProcess?.map((row) => {
        sumRowRequest += row?.counterRequest;
        sumRowReply += row?.counterReply;
      });

      const dataSet = dataChange.concat([
        {
          categoryId: 'TOTAL',
          categoryName: 'Total',
          sumRowReply: sumRowReply,
          sumRowRequest: sumRowRequest,
          processArr: resutProcess,
          percentage: getPercentage(sumRowReply, sumRowRequest)
        }
      ]);
      setDataStatistic(dataSet);
    }
  };
  const getListProcess = async () => {
    setLoading(true);
    const res = await restApi.get(RouterApi.processAll);
    setLoading(false);
    if (res?.status === 200) {
      setListProcess(res?.data);
      // statistic();
    }
  };
  const openModalCounterTactics = () => {
    setOpenModal(true);
  };
  useEffect(() => {
    statistic();
  }, [listProcess]);
  useEffect(() => {
    getListProcess();
  }, []);
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Statistic
            statistic={statistic}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            dataStatistic={dataStatistic}
            listProcess={listProcess}
            setLoading={setLoading}
          />
        </Grid>
        <Grid item xs={12}>
          <TableList statistic={statistic} listProcess={listProcess} setLoading={setLoading} />
        </Grid>
      </Grid>

      {loading && <Loading open={loading} />}
    </>
  );
};

export default CounterTacticsPage;
