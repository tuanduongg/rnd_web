import { Box, Button, Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import SubCard from "ui-component/cards/SubCard";
import { styled } from '@mui/material/styles';
import './counter_tactics.css';
import { DATA, getPercentage, getSum, getSumRow, getSumRowPercentage } from "./counter_tactis.service";
import { DatePicker } from "@mui/x-date-pickers";
import { IconFileDownload, IconFileSpreadsheet, IconFilter, IconList } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import { IconCaretDownFilled } from "@tabler/icons-react";
import { IconInfoCircle } from "@tabler/icons-react";
import Statistic from "./component/Statistic";
import TableList from "./component/TableList";
// ==============================|| SAMPLE PAGE ||============================== //

const CounterTacticsPage = () => {

  const theme = useTheme();



  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Statistic />
        </Grid>
        <Grid item xs={12}>
          <TableList/>
        </Grid>
      </Grid>
    </>
  );
};

export default CounterTacticsPage;
