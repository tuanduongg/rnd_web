// material-ui
import { Grid, Paper, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import config from 'config';
// project imports
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { styled } from '@mui/material/styles';
import toast from 'react-hot-toast';
import Loading from 'ui-component/Loading';
import TableDataMold from './component/TableDataMold';

// ==============================|| SAMPLE PAGE ||==============================
const ManagementMold = () => {
  const [categories, setCategories] = useState([]);
  const [modelMolds, setModelMolds] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);

  const getCategories = async () => {
    setLoading(true);
    const res = await restApi.get(RouterApi.cateConceptAll);
    setLoading(false);
    if (res?.status === 200) {
      setCategories(res?.data);
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

  useEffect(() => {
    checkRole();
    getCategories();
  }, []);
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TableDataMold role={role} setLoading={setLoading} categories={categories} />
        </Grid>
      </Grid>
      {loading && <Loading open={true} />}
    </>
  );
};

export default ManagementMold;
