import { Grid, useTheme } from '@mui/material';
import './counter_tactics.css';
import Statistic from './component/Statistic';
import TableList from './component/TableList';
import { useEffect, useState } from 'react';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import Loading from 'ui-component/Loading';
import { getPercentage } from './counter_tactis.service';
import { END_OF_CURRENT_MONTH, START_OF_CURRENT_MONTH } from 'utils/helper';

// ==============================|| SAMPLE PAGE ||============================== //

const CounterTacticsPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState([]);
  const [role, setRole] = useState(null);
  const [listProcess, setListProcess] = useState([]);
  const [dataStatistic, setDataStatistic] = useState([]);
  const [startDate, setStartDate] = useState(START_OF_CURRENT_MONTH);
  const [endDate, setEndDate] = useState(END_OF_CURRENT_MONTH);

  useEffect(() => {
    const dataChange = statistics.map((item) => {
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
  }, [statistics]);
  const statistic = async () => {
    setLoading(true);

    const res = await restApi.post(RouterApi.statisticReportQC, {
      startDate: startDate?.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      endDate: endDate?.endOf('day').format('YYYY-MM-DD HH:mm:ss')
    });
    setLoading(false);
    if (res?.status == 200) {
      const data = res?.data;
      setStatistics(data);
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
  const checkRole = async () => {
    setLoading(true);
    const res = await restApi.get(RouterApi.checkRole);
    setLoading(false);
    if (res?.status === 200) {
      setRole(res?.data);
    }
  };
  const onClickSearch = () => {
    statistic();
  };
  const openModalCounterTactics = () => {
    setOpenModal(true);
  };
  useEffect(() => {
    statistic();
  }, [listProcess]);
  useEffect(() => {
    checkRole();
    getListProcess();
  }, []);
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Statistic
            onClickSearch={onClickSearch}
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
          <TableList role={role} statistic={statistic} listProcess={listProcess} setLoading={setLoading} />
        </Grid>
      </Grid>

      {loading && <Loading open={loading} />}
    </>
  );
};

export default CounterTacticsPage;
