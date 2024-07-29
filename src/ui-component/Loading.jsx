import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import logo from '../assets/images/logos/favilogo.png'; // Adjust the path to your logo image

export default function Loading({ open }) {
    return (
        <div>
            <Backdrop sx={{ color: '#005595', zIndex: (theme) => theme.zIndex.drawer + 1000 }} open={open}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}
