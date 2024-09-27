import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import { Box, Card, Chip, Divider, Grid, IconButton, Stack, Tab, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { isMobile } from 'react-device-detect';
import config from 'config';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import TableModel from './component/TableModel';
import TableCompany from './component/TableCompany';
import { useState } from 'react';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { useEffect } from 'react';
import { IconBox, IconHome2, IconMapPin } from '@tabler/icons-react';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
        borderBottom: 'none'
    },
    '.MuiPaper-root': {
        maxWidth: '800px',
        minWidth: '400px'
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1)
    },

    '& .MuiDialogTitle-root': {
        padding: '10px 15px'
    }
}));
export const VALUE_TAB = {
    model: 'MODEL',
    company: 'COMPANY',
};
export default function ModalSettingMold({
    open,
    onClose,
    categories,
    typeModal,
    valueTabProp,
    modelMolds,
    companies,
    afterSave,
    rowsPerPageModel,
    setRowsPerPageModel,
    pageModel,
    setPageModel,
    totalModel,
    setTotalModel,
    rowsPerPageCompany,
    setRowsPerPageCompany,
    pageCompany,
    setPageCompany,
    totalCompany,
    setTotalCompany,

    searchModel,
    setSearchModel,
    searchCompany,
    setSearchCompany,

    onClickSearch,

    onChooseItem
}) {
    const [valueTab, setValueTab] = useState(VALUE_TAB.model);

    useEffect(() => {
        if (valueTabProp && open) {
            setValueTab(valueTabProp)
        }
    }, [open]);



    const handleClose = (event, reason) => {
        if (reason && (reason == 'backdropClick' || reason === 'escapeKeyDown')) return;
        onClose();
    };
    return (
        <>
            <BootstrapDialog fullScreen={isMobile} maxWidth={'lg'} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle sx={{ m: 0, p: 2, fontSize: '18px' }} id="customized-dialog-title">
                    <Stack direction={'row'} alignItems={'center'}>
                        <div style={{ marginRight: '5px' }}>
                            {typeModal === 'PICK' ? valueTabProp === VALUE_TAB.model ? 'Model' : 'Places' : 'Model & Places'}
                        </div>
                    </Stack>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 6
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <TabContext value={valueTab}>
                        {typeModal !== 'PICK' && (<Box>
                            <TabList
                                onChange={(event, newValue) => {
                                    setValueTab(newValue);
                                }}
                                aria-label="Tabs"
                            >
                                <Tab icon={<IconBox />} iconPosition="start" label="Model" value={VALUE_TAB.model} />
                                <Tab label="Places" icon={<IconMapPin />} iconPosition="start" value={VALUE_TAB.company} />
                            </TabList>
                        </Box>)}
                        <TabPanel sx={{ padding: '0px' }} value={VALUE_TAB.model}>
                            <TableModel
                                afterSave={afterSave}
                                onChooseItem={onChooseItem}
                                onClickSearch={onClickSearch}
                                rowsPerPageModel={rowsPerPageModel}
                                setRowsPerPageModel={setRowsPerPageModel}
                                pageModel={pageModel}
                                setPageModel={setPageModel}
                                totalModel={totalModel}
                                setTotalModel={setTotalModel}
                                modelMolds={modelMolds}
                                typeModal={typeModal}
                                categories={categories}
                                searchModel={searchModel}
                                setSearchModel={setSearchModel} />
                        </TabPanel>
                        <TabPanel sx={{ padding: '0px' }} value={VALUE_TAB.company}>
                            <TableCompany
                                onChooseItem={onChooseItem}
                                onClickSearch={onClickSearch}
                                rowsPerPageCompany={rowsPerPageCompany}
                                setRowsPerPageCompany={setRowsPerPageCompany}
                                pageCompany={pageCompany}
                                setPageCompany={setPageCompany}
                                totalCompany={totalCompany}
                                setTotalCompany={setTotalCompany}
                                searchCompany={searchCompany}
                                setSearchCompany={setSearchCompany}
                                afterSave={afterSave}
                                companies={companies}
                                typeModal={typeModal} />
                        </TabPanel>
                    </TabContext>
                </DialogContent>
                <DialogActions>
                    <Button variant="custom" onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    );
}
