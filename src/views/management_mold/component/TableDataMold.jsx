import { Box, Table, TableBody, styled, TableCell, TableContainer, TableHead, TableRow, Paper, tableCellClasses, Menu, Button, TablePagination, MenuItem, ListItemText, Checkbox, Chip, Tooltip } from "@mui/material"
import { LIST_COL_MOLD, FAKE_DATA } from "../management_mold.service";
import { useEffect, useState } from "react";
import IMAGE_EMPTYDATA from 'assets/images/backgrounds/empty-box.png';
import { cssScrollbar, formatDateFromDB } from "utils/helper";
import config from "config";
import { Stack } from "@mui/system";
import {
    IconPlus,
    IconSearch,
    IconEdit,
    IconTrash,
    IconEye,
    IconFileSpreadsheet,
    IconAdjustmentsAlt,
    IconSettings,
    IconTableOptions
} from '@tabler/icons-react';
import ModalSettingMold from "ui-component/modals/ModalSettingMold/ModalSettingMold";
import ModalAddMold from "ui-component/modals/ModalAddMold/ModalAddMold";
import restApi from "utils/restAPI";
import { RouterApi } from "utils/router-api";
import { ShowConfirm } from "ui-component/ShowDialog";
import toast from "react-hot-toast";
import './tabledata.css';
import ModalDetailMold from "ui-component/modals/ModalDetailMold/ModalDetailMold";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        padding: '12px'
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: '10px'
    }
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));
const getChipStatus = (status) => {
    let text = '';
    let color = '';
    switch (status) {
        case 'DEV':
            text = '개발중';
            color = 'info';
            break;
        case 'USE':
            text = '양산';
            color = 'success';
            break;
        case 'STOP':
            text = '사용중지';
            color = 'error';
            break;

        default:
            return '';
    }
    return (<Chip variant={color === 'success' ? 'filled' : "outlined"} label={text} size="small" color={color} />);

}
const listColDefault = [];
LIST_COL_MOLD.map((col) => {
    if (col?.canHide === false) {
        listColDefault.push(col?.id);
    }
});


const TableDataMold = ({ categories, setLoading }) => {
    const [modelMolds, setModelMolds] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [currentShowCol, setCurrentShowCol] = useState(listColDefault);
    const [listData, setListData] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [total, setTotal] = useState(0);
    const [openModalSetting, setOpenModalSetting] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);

    const [rowsPerPageModel, setRowsPerPageModel] = useState(10);
    const [pageModel, setPageModel] = useState(0);
    const [totalModel, setTotalModel] = useState(0);
    const [searchModel, setSearchModel] = useState('');
    const [searchModelSend, setSearchModelSend] = useState('');


    const [rowsPerPageCompany, setRowsPerPageCompany] = useState(10);
    const [pageCompany, setPageCompany] = useState(0);
    const [totalCompany, setTotalCompany] = useState(0);
    const [searchCompany, setSearchCompany] = useState('');
    const [searchCompanySend, setSearchCompanySend] = useState('');

    const [openModalDetail, setOpenModalDetail] = useState(false);

    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [typeModalSetting, setTypeModalSetting] = useState('');
    const [tabModalSetting, setTabModalSetting] = useState('');
    const [currentPropChoose, setCurrentPropChoose] = useState('');

    const [formValues, setFormValues] = useState({});


    const [typeModalAdd, setTypeModalAdd] = useState('');
    const [selectedRow, setSelectedRow] = useState(null);
    const [hightLightIndex, setHightLightIndex] = useState([]);



    const getAllReport = async () => {
        setLoading(true);
        const res = await restApi.post(RouterApi.allOutputJig, {});
        setLoading(false);
        if (res?.status === 200) {
            setListData(res?.data);
            const arrModel = [];
            const arrModelIndex = [];
            res?.data.map((item, index) => {
                const mixModelType = item?.model?.type + item?.model?.model + item?.model?.category?.categoryId;
                if (!arrModel?.includes(mixModelType)) {
                    arrModel.push(mixModelType);
                    arrModelIndex.push(index);
                }
            });
            setHightLightIndex(arrModelIndex);

        }
    };
    const getModelMolds = async () => {
        setLoading(true);
        const res = await restApi.post(RouterApi.allModelMold, {
            page: pageModel,
            rowsPerPage: rowsPerPageModel,
            search: searchModelSend?.trim(),
        });
        setLoading(false);
        if (res?.status === 200) {
            setModelMolds(res?.data?.data);
            setTotalModel(res?.data?.total);
        }
    };
    const getAllCompany = async () => {
        setLoading(true);
        const res = await restApi.post(RouterApi.allCompany, {
            page: pageCompany,
            rowsPerPage: rowsPerPageCompany,
            search: searchCompanySend?.trim(),
        });
        setLoading(false);
        if (res?.status === 200) {
            setTotalCompany(res?.data?.total)
            setCompanies(res?.data?.data);
        }
    };

    useEffect(() => {
        getModelMolds();
    }, [pageModel, rowsPerPageModel, searchModelSend]);
    useEffect(() => {
        getAllCompany();
    }, [pageCompany, rowsPerPageCompany, searchCompanySend]);

    useEffect(() => {
        getAllReport();
    }, []);

    const open = Boolean(anchorEl);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const onChangeCheckedCol = (e, item) => {
        const check = e.target.checked;
        switch (check) {
            case false:
                const newArr = currentShowCol.filter((i) => i !== item?.id);
                setCurrentShowCol(newArr);
                break;
            case true:
                setCurrentShowCol([...currentShowCol, item?.id]);
                break;

            default:
                break;
        }
    };

    const onClickShowDetail = () => {
        if (selectedRow) {

            setOpenModalDetail(true);
        }
    };
    const onClickSelectAll = () => {
        setCurrentShowCol(LIST_COL_MOLD.map((item) => item.id));
    };
    const onOpenModalSetting = (type, value) => {

        setCurrentPropChoose(value)
        setTypeModalSetting('PICK')
        setTabModalSetting(type);
        setOpenModalSetting(true)
        // setTypeModalSetting(type)
    };
    const onClickDelete = () => {
        if (selectedRow) {
            ShowConfirm({
                title: 'Delete',
                message: 'Do you want to delete?',
                onOK: async () => {
                    setLoading(true);
                    const res = await restApi.post(RouterApi.deleteOutputJig, { outputJigID: selectedRow?.outputJigID });
                    setLoading(false);
                    if (res?.status === 200) {
                        toast.success('Successfully deleted!');
                        afterSaveDataModalAdd();
                    } else {
                        toast.error(res?.data?.message || 'Delete fail!');
                    }
                }
            });
        } else {
            toast.error('Please choose a row in table!');
        }
    };
    const onChooseItem = (item, type) => {
        setFormValues({ prop: currentPropChoose, value: item })
        onCloseModalSetting()
    };
    const afterSaveDataModalAdd = () => {
        setSelectedRow(null);
        getAllReport();
    };
    const onCloseModalDetail = () => {
        setOpenModalDetail(false)
    };
    const onCloseModalSetting = () => {
        setOpenModalSetting(false)
    };
    const onCloseModalAdd = () => {
        setOpenModalAdd(false);
    }
    const onClickSearch = (type) => {
        switch (type) {
            case 'COMPANY':
                setPageCompany(0);
                setSearchCompanySend(searchCompany);
                break;
            case 'MODEL':
                setPageModel(0);
                setSearchModelSend(searchModel);
                break;

            default:
                break;
        }
    };
    const afterSave = (type) => {
        switch (type) {
            case 'COMPANY':
                getAllCompany();
                break;
            case 'MODEL':
                getModelMolds();
                break;

            default:
                break;
        }
    };
    const onClickUnSelectAll = () => {
        const newArr = LIST_COL_MOLD.map((item) => {
            if (!item?.canHide) {
                return item.id;
            }
        });
        setCurrentShowCol(newArr);
    };

    return (<>
        <Stack direction="row" justifyContent="space-between">

            <Stack direction="row" justifyContent="space-between">
                <Button onClick={() => {
                    setTabModalSetting('MODEL')
                    setTypeModalSetting('EDIT')
                    setOpenModalSetting(true)
                }} startIcon={<IconTableOptions />} size="small" variant="outlined">
                    Model & Places
                </Button>

            </Stack>
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
                {/* <Button startIcon={<IconFileSpreadsheet />} size="small" variant="outlined">
                    Excel
                </Button> */}
                <Button
                    onClick={() => {
                        setTypeModalAdd('ADD')
                        setOpenModalAdd(true)
                    }}
                    size="small"
                    startIcon={<IconPlus />}
                    variant="contained"
                >
                    New
                </Button>
                <Button
                    onClick={() => {
                        setTypeModalAdd('EDIT')
                        setOpenModalAdd(true)
                    }}
                    size="small"
                    disabled={!selectedRow}
                    startIcon={<IconEdit />}
                    variant="outlined"
                >
                    Edit
                </Button>
                <Button
                    onClick={onClickDelete}
                    disabled={!selectedRow}
                    size="small"
                    startIcon={<IconTrash />}
                    variant="outlined"
                    color="error"
                >
                    Delete
                </Button>

                <Button
                    disabled={!selectedRow}
                    size="small"
                    onClick={onClickShowDetail}
                    startIcon={<IconEye />}
                    variant="custom"
                >
                    Detail
                </Button>
            </Stack>
        </Stack>

        <Box mt={2}>

            <TableContainer
                sx={{
                    height: `calc(100vh - 240px)`,
                    ...cssScrollbar
                }}
                component={Paper}
            >
                <Table style={{ tableLayout: 'fixed' }} stickyHeader sx={{ maxHeight: 200 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            {LIST_COL_MOLD?.map(
                                (col, index) =>
                                    currentShowCol.includes(col.id) && (
                                        <StyledTableCell dangerouslySetInnerHTML={{ __html: col.name }} key={index} {...col}></StyledTableCell>
                                    )
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody
                        sx={{
                            '.MuiTableRow-root.Mui-selected': { backgroundColor: config.colorSelected },
                            '.MuiTableRow-root.Mui-selected:hover': { backgroundColor: config.colorSelected }
                        }}
                    >
                        {
                            listData?.length <= 0 ? (
                                <TableRow sx={{ textAlign: 'center' }}>
                                    <StyledTableCell colSpan={currentShowCol?.length} align="center">
                                        <img src={IMAGE_EMPTYDATA} width={70} height={70} alt="image" />
                                        <div>NO DATA</div>
                                    </StyledTableCell>
                                </TableRow>
                            ) : (
                                listData.map((item, index) => (
                                    <StyledTableRow sx={{ cursor: 'pointer' }} onClick={() => { setSelectedRow(item) }} selected={item?.outputJigID === selectedRow?.outputJigID} key={index}>
                                        {currentShowCol?.includes('#') && <StyledTableCell  align="center">{index + 1}</StyledTableCell>}
                                        {currentShowCol?.includes('category') && <StyledTableCell className={!hightLightIndex?.includes(index) ? "no-hight-linght" : ''} align="center">{item?.model.category?.categoryName}</StyledTableCell>}
                                        {currentShowCol?.includes('project') && <StyledTableCell className={!hightLightIndex?.includes(index) ? "no-hight-linght" : ''} align="center">{item?.model?.projectName}</StyledTableCell>}
                                        {currentShowCol?.includes('type') && <StyledTableCell className={!hightLightIndex?.includes(index) ? "no-hight-linght" : ''} align="center">{item?.model?.type}</StyledTableCell>}
                                        {currentShowCol?.includes('model') && <StyledTableCell className={!hightLightIndex?.includes(index) ? "no-hight-linght" : ''} align="center">{item?.model?.model}</StyledTableCell>}
                                        {currentShowCol?.includes('description') && <StyledTableCell align="center">{item?.model?.description}</StyledTableCell>}
                                        {currentShowCol?.includes('moldNo') && <StyledTableCell align="center">{item?.moldNo}</StyledTableCell>}
                                        {currentShowCol?.includes('manufacturer') && <StyledTableCell align="center">
                                            <Tooltip title={item?.manufacturer?.companyName} >
                                                {item?.manufacturer?.companyCode}
                                            </Tooltip>
                                        </StyledTableCell>}
                                        {currentShowCol?.includes('shipArea') && <StyledTableCell align="center">
                                            <Tooltip title={item?.shipArea?.companyName} >
                                                {item?.shipArea?.companyCode}
                                            </Tooltip>
                                        </StyledTableCell>}
                                        {currentShowCol?.includes('shipDate') && <StyledTableCell align="center">{formatDateFromDB(item?.shipDate, false)}</StyledTableCell>}
                                        {currentShowCol?.includes('massCompany') && <StyledTableCell align="center">{item?.massCompany ? (
                                            <Tooltip title={item?.massCompany?.companyName} >
                                                {item?.massCompany?.companyCode}
                                            </Tooltip>
                                        ) : ''}
                                        </StyledTableCell>}
                                        {currentShowCol?.includes('shipMassCompany') && <StyledTableCell align="center">{formatDateFromDB(item?.shipMassCompany, false)}</StyledTableCell>}
                                        {currentShowCol?.includes('modificationCompany') && <StyledTableCell align="center">
                                            {item?.modificationCompany ? (
                                                <Tooltip title={item?.modificationCompany?.companyName} >
                                                    {item?.modificationCompany?.companyCode}
                                                </Tooltip>
                                            ) : ''}
                                        </StyledTableCell>}
                                        {currentShowCol?.includes('outputEdit') && <StyledTableCell align="center">{formatDateFromDB(item?.outputEdit, false)}</StyledTableCell>}
                                        {currentShowCol?.includes('wearingPlan') && <StyledTableCell align="center">
                                            {item?.wearingPlan ? (
                                                <Tooltip title={item?.wearingPlan?.companyName} >
                                                    {item?.wearingPlan?.companyCode}
                                                </Tooltip>
                                            ) : ''}
                                        </StyledTableCell>}
                                        {currentShowCol?.includes('receivingCompleted') && <StyledTableCell align="center">{formatDateFromDB(item?.receivingCompleted, false)}</StyledTableCell>}
                                        {currentShowCol?.includes('tryNo') && <StyledTableCell align="center">{item?.tryNo}</StyledTableCell>}
                                        {currentShowCol?.includes('historyEdit') && <StyledTableCell align="center">{item?.historyEdit}</StyledTableCell>}
                                        {currentShowCol?.includes('productionStatus') && <StyledTableCell align="center">{getChipStatus(item?.productionStatus)}</StyledTableCell>}
                                    </StyledTableRow>
                                ))
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack direction={'row'} sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }} justifyContent={'flex-end'}>
                <Button
                    size="small"
                    variant="text"
                    id="demo-positioned-button"
                    aria-controls={open ? 'demo-positioned-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={(event) => {
                        setAnchorEl(event.currentTarget);
                    }}
                >
                    Show colums
                </Button>
                <TablePagination
                    sx={{
                        '.MuiTablePagination-toolbar': { padding: '0px' },
                        borderBottom: 'none',
                        marginLeft: '10px'
                    }}
                    color="primary"
                    rowsPerPageOptions={config.arrRowperpages}
                    // rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={10}
                    count={total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    slotProps={{
                        select: {
                            inputProps: {
                                'aria-label': 'rows per page'
                            }
                            // native: true
                        }
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Stack>
        </Box>

        <Menu anchorEl={anchorEl} open={open} onClose={() => {
            setAnchorEl(null);
        }} dense>
            <Stack pl={1} pr={1} direction={'row'} justifyContent={'space-between'}>
                <Button
                    onClick={() => {
                        onClickSelectAll();
                    }}
                    size="small"
                >
                    Select all
                </Button>
                <Button
                    onClick={() => {
                        onClickUnSelectAll();
                    }}
                    size="small"
                    color="error"
                >
                    Unselect
                </Button>
            </Stack>
            <Box sx={{ overflowY: 'auto', maxHeight: '300px' }}>
                {LIST_COL_MOLD.map((item, index) => {
                    return item?.canHide ? (
                        <MenuItem key={index}>
                            <ListItemText>
                                <Checkbox
                                    onChange={(e) => {
                                        onChangeCheckedCol(e, item);
                                    }}
                                    checked={currentShowCol.includes(item.id)}
                                />
                                {item?.name?.replaceAll('<br/>', '')}
                            </ListItemText>
                        </MenuItem>
                    ) : null;
                })}
            </Box>
        </Menu>
        <ModalDetailMold selected={selectedRow} open={openModalDetail} onClose={onCloseModalDetail} />
        <ModalAddMold afterSave={afterSaveDataModalAdd} typeModal={typeModalAdd} selected={selectedRow} setFormValues={formValues} onOpenModalSetting={onOpenModalSetting} categories={categories} onClose={onCloseModalAdd} open={openModalAdd} />
        <ModalSettingMold
            onChooseItem={onChooseItem}
            onClickSearch={onClickSearch}
            searchModel={searchModel}
            setSearchModel={setSearchModel}
            searchCompany={searchCompany}
            setSearchCompany={setSearchCompany}
            rowsPerPageModel={rowsPerPageModel}
            setRowsPerPageModel={setRowsPerPageModel}
            pageModel={pageModel}
            setPageModel={setPageModel}
            totalModel={totalModel}
            setTotalModel={setTotalModel}
            rowsPerPageCompany={rowsPerPageCompany}
            setRowsPerPageCompany={setRowsPerPageCompany}
            pageCompany={pageCompany}
            setPageCompany={setPageCompany}
            totalCompany={totalCompany}
            setTotalCompany={setTotalCompany}
            afterSave={afterSave}
            modelMolds={modelMolds}
            companies={companies}
            valueTabProp={tabModalSetting}
            typeModal={typeModalSetting}
            categories={categories}
            open={openModalSetting}
            onClose={onCloseModalSetting}
        />
    </>)


}

export default TableDataMold;