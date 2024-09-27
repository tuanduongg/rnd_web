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
import TableDataMold from './component/TableDataMold';
import ModalAddMold from 'ui-component/modals/ModalAddMold/ModalAddMold';

// ==============================|| SAMPLE PAGE ||==============================
const ManagementMold = () => {
  const [categories, setCategories] = useState([]);
  const [modelMolds, setModelMolds] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCategories = async () => {
    setLoading(true);
    const res = await restApi.get(RouterApi.cateConceptAll);
    setLoading(false);
    if (res?.status === 200) {
      setCategories(res?.data);
    }
  };



  useEffect(() => {
    getCategories();
  }, [])
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <MainCard contentSX={{ padding: '10px' }}>
            <TableDataMold setLoading={setLoading} categories={categories} />
          </MainCard>
        </Grid>
      </Grid>
      {loading && <Loading open={true} />}
    </>
  );
};

export default ManagementMold;
