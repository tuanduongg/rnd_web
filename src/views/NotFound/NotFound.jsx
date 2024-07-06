import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import BG from '../../assets/images/backgrounds/background_homepage.jpg';
import { useNavigate } from 'react-router-dom';
import { ConfigRouter } from 'routes/ConfigRouter';


export default function NotFound() {
    const navigate = useNavigate();

    const onClickBackToHome = () => {
        navigate(ConfigRouter.homePage);
    }
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                minHeight: '100vh',
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),  url(${BG})`,
                backgroundSize: 'cover', // Đảm bảo hình nền phủ kín toàn bộ
                backgroundPosition: 'center', // Căn giữa hình nền
            }}
        >
            <Typography variant="h1" style={{ color: 'white',fontSize:'40px',marginBottom:'20px' }}>
                404 NOT FOUND
            </Typography>
            <Button onClick={onClickBackToHome} variant="contained">Back To Home</Button>
        </Box>
    );
}
