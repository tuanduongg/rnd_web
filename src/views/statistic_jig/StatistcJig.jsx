// material-ui

import { useState } from 'react';
import config from 'config';
import Loading from 'ui-component/Loading';

// ==============================|| SAMPLE PAGE ||==============================
const StatisticJig = () => {
    const [loading, setLoading] = useState(false)
    return (
        <>
            Statistic Jig
            {loading && <Loading open={loading} />}
        </>
    );
};

export default StatisticJig;
