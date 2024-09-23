// material-ui
import { Grid, Paper, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import config from 'config';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { styled } from '@mui/material/styles';
import toast from 'react-hot-toast';
import Loading from 'ui-component/Loading';

// ==============================|| SAMPLE PAGE ||==============================
const ManagementMold = () => {
  //   const inputRef = useRef(null);
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#ffff',
      color: '#333'
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding: '10px'
    }
  }));

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <MainCard contentSX={{ padding: '10px' }}>
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                {/* Table Head */}
                <TableHead>
                  <TableRow>
                    <StyledTableCell rowSpan={2} align="center">
                      CATEGORY
                    </StyledTableCell>
                    <StyledTableCell rowSpan={2} align="center">
                      PROJECT NAME
                    </StyledTableCell>
                    <StyledTableCell rowSpan={2} align="center">
                      구분
                    </StyledTableCell>
                    <StyledTableCell rowSpan={2} align="center">
                      MODEL
                    </StyledTableCell>
                    <StyledTableCell rowSpan={2} align="center">
                      DESCRIPTION
                    </StyledTableCell>
                    <StyledTableCell rowSpan={2} align="center">
                      MOLD NO.
                    </StyledTableCell>
                    <StyledTableCell rowSpan={2} align="center" colSpan={3}>
                      금형 출고관리
                    </StyledTableCell>
                    <StyledTableCell align="center" rowSpan={2} colSpan={2}>
                      금형 입고관리
                    </StyledTableCell>
                    <StyledTableCell rowSpan={2} align="center">
                      양산적용{' '}
                    </StyledTableCell>
                  </TableRow>
                  <TableRow>
                    <StyledTableCell colSpan={6} />
                    <StyledTableCell align="center">제작업체 </StyledTableCell>
                    <StyledTableCell align="center">발주지역</StyledTableCell>
                    <StyledTableCell align="center">출고 계획</StyledTableCell>
                    <StyledTableCell align="center">수정업체</StyledTableCell>
                    <StyledTableCell align="center">수리 출고</StyledTableCell>
                    <StyledTableCell align="center">입고 계획</StyledTableCell>
                    <StyledTableCell align="center">입고 완료</StyledTableCell>
                    <StyledTableCell align="center">TRY NO.</StyledTableCell>
                    <StyledTableCell align="center">수정내역</StyledTableCell>
                  </TableRow>
                </TableHead>

                {/* Table Body (Example Rows) */}
                <TableBody>
                  <TableRow>
                    
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
};

export default ManagementMold;
