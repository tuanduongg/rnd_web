import { useEffect, useRef, useState } from 'react';
import { Box } from "@mui/material";
import { IconLock } from "@tabler/icons-react";

const UnauthorizedPage = () => {

    return <>
        <Box width={'100%'} height={'88vh'} display={'flex'} alignItems={'center'} justifyContent={'center'} textAlign={'center'}>
            <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <IconLock size={70} />
                <span style={{ fontSize: 25, marginTop: 5 }}>
                    Access Denied
                </span>
            </Box>

        </Box>
    </>
}
export default UnauthorizedPage;