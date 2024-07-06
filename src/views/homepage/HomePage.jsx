// material-ui
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';

// ==============================|| SAMPLE PAGE ||============================== //

const HomePage = () => {
    const getUsers = async () => {
        const res = await restApi.get(RouterApi.userAll);
        console.log('res', res);
    };
    useEffect(() => {
        getUsers();
    }, []);
    return (
        <MainCard title="Sample Card">
            <Typography variant="body2">
                Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa. Ut
                enif ad minim venice, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos aube grue
                dolor in reprehended in voltage veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non president,
                sunk in culpa qui officiate descent molls anim id est labours.
            </Typography>
        </MainCard>
    );
};

export default HomePage;
