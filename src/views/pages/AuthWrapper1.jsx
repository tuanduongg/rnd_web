// material-ui
import { styled } from '@mui/material/styles';
import BG from '../../assets/images/backgrounds/background_homepage.jpg';
// project imports

// ==============================|| AUTHENTICATION 1 WRAPPER ||============================== //

const AuthWrapper1 = styled('div')(({ theme }) => ({
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),  url(${BG})`,
  backgroundSize: 'cover', // Đảm bảo hình nền phủ kín toàn bộ
  backgroundPosition: 'center', // Căn giữa hình nền
  minHeight: '100vh'
}));

export default AuthWrapper1;
