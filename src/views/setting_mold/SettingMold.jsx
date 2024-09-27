// material-ui
import { Grid } from '@mui/material';
import config from 'config';
// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| SAMPLE PAGE ||==============================
const SettingMold = () => {

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <MainCard contentSX={{ padding: '10px' }}>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
};

export default SettingMold;