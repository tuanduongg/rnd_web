import { InputAdornment, Button, FormControl, Grid, IconButton, OutlinedInput, Paper, Stack, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme, Tooltip, InputLabel, Select, ListItemText, Checkbox, MenuItem, MenuList, Divider, Menu } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import { IconPlus, IconInfoCircle, IconSearch, IconEdit, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { ITEM_HEIGHT, LIST_COL } from "./tablelist.service";
import { IconCheck } from "@tabler/icons-react";


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
const TableList = () => {

    const [currentShowCol, setCurrentShowCol] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const onChangeCheckedCol = (e, item) => {
        const check = e.target.checked;
        switch (check) {
            case false:
                const newArr = currentShowCol.filter((i) => i !== item?.id);
                setCurrentShowCol(newArr)
                break;
            case true:
                setCurrentShowCol([...currentShowCol, item?.id])
                break;

            default:
                break;
        }
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <MainCard contentSX={{ padding: '10px' }}>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} mb={2}>
                    <Typography variant="h4" component={'h4'}>List</Typography>
                    <Stack direction={'row'} spacing={4}>
                        <FormControl fullWidth sx={{ maxWidth: '220px' }} size="small" ariant="outlined">
                            <OutlinedInput
                                onChange={(e) => {
                                }}
                                placeholder="Search..."
                                id="outlined-adornment-password"
                                type={'text'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton color="primary" aria-label="search" edge="end">
                                            <IconSearch />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            // label="Search"
                            />
                        </FormControl>
                        <Stack direction="row" justifyContent="space-between" spacing={1}>
                            <Button
                                size="small"
                                startIcon={<IconPlus />}
                                variant="contained"
                            >
                                New
                            </Button>

                            <Button

                                size="small"
                                startIcon={<IconEdit />}
                                variant="outlined"
                            >
                                Edit
                            </Button>

                            <Button
                                size="small"
                                startIcon={<IconTrash />}
                                variant="outlined"
                                color="error"
                            >
                                Delete
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
                <TableContainer
                    sx={{
                        maxHeight: `calc(100vh - 240px)`
                    }}
                    component={Paper}
                >
                    <Table style={{ tableLayout: "fixed" }} stickyHeader sx={{ maxHeight: 200 }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                {LIST_COL?.map((col, index) => (currentShowCol.includes(col.id) && <StyledTableCell key={index} {...col}>{col.name}</StyledTableCell>))}
                            </TableRow>
                        </TableHead>
                        <TableBody
                        >
                            {new Array(100).fill(0).map((item, index) => (<StyledTableRow key={index}>
                                <StyledTableCell align="center">1</StyledTableCell>
                                <StyledTableCell align="center" component="th" scope="row">
                                    CONVERTING
                                </StyledTableCell>
                                <StyledTableCell align="center">GF-925</StyledTableCell>
                                <StyledTableCell align="center">Q6</StyledTableCell>
                                <StyledTableCell align="center">d</StyledTableCell>
                                <StyledTableCell sx={{ wordBreak: 'break-all' }}>TAPE;TAPE BACK GLASS, F958N</StyledTableCell>
                                <StyledTableCell align="center">50%</StyledTableCell>
                                <StyledTableCell align="center">
                                    h
                                </StyledTableCell>
                                <StyledTableCell align="center">k</StyledTableCell>
                                <StyledTableCell align="center">2024/08/07</StyledTableCell>
                                <StyledTableCell align="center">k</StyledTableCell>
                                <StyledTableCell align="center">k</StyledTableCell>
                                <StyledTableCell align="center">2024/08/07</StyledTableCell>
                                <StyledTableCell align="center">Bong keo</StyledTableCell>
                                {/* <StyledTableCell align="right">
                                    <IconButton
                                        color="primary"
                                        size="small"
                                        aria-label="Download"
                                    >
                                        <IconInfoCircle />
                                    </IconButton>
                                </StyledTableCell> */}
                            </StyledTableRow>))}
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
                        onClick={handleClick}
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
                        rowsPerPageOptions={[5, 10, 25, 50, 100]}
                        // rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                        colSpan={10}
                        count={100}
                        rowsPerPage={10}
                        page={0}
                        slotProps={{
                            select: {
                                inputProps: {
                                    'aria-label': 'rows per page'
                                }
                                // native: true
                            }
                        }}
                    // onPageChange={handleChangePage}
                    // onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Stack>
            </MainCard>
            <Menu PaperProps={{
                style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: '20ch',
                },
            }} anchorEl={anchorEl}
                open={open}
                onClose={handleClose} dense>
                {LIST_COL.map((item, index) => (
                    <MenuItem>
                        <ListItemText key={index}>
                            <Checkbox onChange={(e) => {
                                onChangeCheckedCol(e, item)
                            }} checked={currentShowCol.includes(item.id)} />
                            {item.name}
                        </ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

export default TableList;