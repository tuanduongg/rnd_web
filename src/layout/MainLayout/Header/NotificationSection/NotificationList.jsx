import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// project-import
import CircleIcon from '@mui/icons-material/Circle';

// assets
import { IconBrandTelegram, IconBuildingStore, IconMailbox, IconPhoto, IconPoint } from '@tabler/icons-react';
import User1 from 'assets/images/users/user-round.svg';
import { Accordion, AccordionDetails, AccordionSummary, IconButton } from '@mui/material';
import { IconClockEdit } from '@tabler/icons-react';
import { formatDateFromDB } from 'utils/helper';

const ListItemWrapper = ({ children }) => {
  return (
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'primary.light'
        }
      }}
    >
      {children}
    </Box>
  );
};

ListItemWrapper.propTypes = {
  children: PropTypes.node
};

const html = `<strong>12/12/2005</strong> thucjw hien bao tri he thong`;

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const NotificationList = ({ notifications }) => {
  const theme = useTheme();

  const chipSX = {
    height: 24,
    padding: '0 6px'
  };
  const chipErrorSX = {
    ...chipSX,
    color: theme.palette.orange.dark,
    backgroundColor: theme.palette.orange.light,
    marginRight: '5px'
  };

  const chipWarningSX = {
    ...chipSX,
    color: theme.palette.warning.dark,
    backgroundColor: theme.palette.warning.light
  };

  const chipSuccessSX = {
    ...chipSX,
    color: theme.palette.success.dark,
    backgroundColor: theme.palette.success.light,
    height: 28
  };

  return (
    <Box sx={{ minWidth: 300, maxWidth: 350, minHeight: 200 }}>

      <Divider />
      {notifications?.map((item, index) => (<Accordion>
        <AccordionSummary
          key={index}
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${index}-content`}
          id={`panel${index}-header`}
        >
          {/* <IconButton size='small' color='success'>
            </IconButton> */}
          <Stack>
            <Stack direction={'row'} alignItems={'center'}>
              <Typography color={'primary'} variant='h5'>{item?.title}</Typography>
            </Stack>
            <Stack direction={'row'} alignItems={'center'}>
              <Typography  variant='subtitle2' whiteSpace={"pre-line"}>
                <IconClockEdit height={15} />
              </Typography>
              <Typography variant='subtitle2' mb={0.5} whiteSpace={"pre-line"}>
                {formatDateFromDB(item?.createAt, true)}
              </Typography>
            </Stack>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography  variant='subtitle2' dangerouslySetInnerHTML={{
            __html: item?.content
          }} whiteSpace={"pre-line"}>

          </Typography>
        </AccordionDetails>
      </Accordion>))}
    </Box >

  );
};

export default NotificationList;
