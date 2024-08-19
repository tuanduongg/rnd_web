import { useState } from "react";
import { Box, Button, Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TablePagination, TableRow, Typography, useTheme } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import { DATA, getPercentage, getSum, getSumRow, getSumRowPercentage } from "../counter_tactis.service";
import { DatePicker } from "@mui/x-date-pickers";
import { IconFileSpreadsheet, IconFilter, IconSearch } from "@tabler/icons-react";
import dayjs from "dayjs";

const currentDate = dayjs();
// Lấy ngày đầu tiên của tháng hiện tại
const firstDayOfCurrentMonth = currentDate.startOf('month');

// Lấy ngày đầu tiên của tháng trước
const firstDayOfLastMonth = firstDayOfCurrentMonth.subtract(1, 'month');

// Lấy ngày đầu tiên của tháng sau
const firstDayOfNextMonth = firstDayOfCurrentMonth.add(1, 'month');

const Statistic = () => {
    const [startDate, setStartDate] = useState(firstDayOfLastMonth);
    const [endDate, setEndDate] = useState(firstDayOfNextMonth);
    return (<>
        <MainCard contentSX={{ padding: '13px' }}>
            <Typography variant="h4" component={'h4'} mb={2}>Statistic</Typography>
            <Stack direction="row" justifyContent="space-between" spacing={1}>
                <Stack sx={{ maxWidth: '500px' }} spacing={2} direction="row" alignItems={'center'} justifyContent="space-between">
                    <DatePicker
                        value={startDate}
                        sx={{ maxWidth: '160px' }}
                        views={['year', 'month', 'day']}
                        format="YYYY/MM/DD"
                        slotProps={{ textField: { size: 'small' } }}
                        label="From"
                    />
                    <Box>~</Box>
                    <DatePicker
                        value={endDate}
                        sx={{ maxWidth: '160px' }}
                        autoOk={false}
                        views={['year', 'month', 'day']}
                        format="YYYY/MM/DD"
                        slotProps={{ textField: { size: 'small' } }}
                        label="To"
                    />
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<IconSearch />}
                    >
                        Search
                    </Button>
                </Stack>
                <Button startIcon={<IconFileSpreadsheet />} size="small" variant="contained">Excel</Button>

            </Stack>
            <Box sx={{ backgroundColor: '#0055951f' }} mt={3}>
                <Stack width={'100%'} direction={'row'}>
                    <Box width={'13%'} className="cell-head-custom"  >카테고리</Box>
                    <Box width={'17%'} className="cell-head-custom"  >구분</Box>
                    <Box width={'10%'} className="cell-head-custom"  >IQC</Box>
                    <Box width={'10%'} className="cell-head-custom"  >OQC</Box>
                    <Box width={'10%'} className="cell-head-custom"  >WRB OQC</Box>
                    <Box width={'10%'} className="cell-head-custom"  >OQC(1,2)</Box>
                    <Box width={'10%'} className="cell-head-custom"  >Assy</Box>
                    <Box width={'10%'} className="cell-head-custom"  >MQIS</Box>
                    <Box width={'10%'} sx={{ textAlign: 'center', border: '1px solid #333', fontWeight: 'bold', padding: '5px', color: '#005595' }} >Total</Box>
                </Stack>
                {
                    DATA.map((item, index) => (
                        <Stack key={index} width={'100%'} direction={'row'}>
                            <Box width={'13%'} sx={{ borderLeft: '1px solid #333', borderBottom: '1px solid #333', fontWeight: 'bold', textAlign: 'center', lineHeight: '55px', color: '#005595' }} >
                                {item.id}
                            </Box>
                            <Box width={'17%'} sx={{ borderLeft: '1px solid #333' }}>
                                <Box className="cell-custom">통보서(Thông báo)</Box>
                                <Box className="cell-custom">대책서(Đối sách)</Box>
                                <Box className="cell-custom">완료율(Tỷ lệ)</Box>
                            </Box>
                            <Box width={'10%'} sx={{ borderLeft: '1px solid #333' }}>
                                <Box className="cell-custom">{item.iqc.request}</Box>
                                <Box className="cell-custom">{item.iqc.respose}</Box>
                                <Box className="cell-custom">{item.iqc.respose / item?.iqc.request * 100}%</Box>
                            </Box>
                            <Box width={'10%'} sx={{ borderLeft: '1px solid #333' }}>
                                <Box className="cell-custom">{item.oqc.request}</Box>
                                <Box className="cell-custom">{item.oqc.respose}</Box>
                                <Box className="cell-custom">{getPercentage(item.oqc.respose, item?.oqc.request)}%</Box>
                            </Box>
                            <Box width={'10%'} sx={{ borderLeft: '1px solid #333' }}>
                                <Box className="cell-custom">{item.wrb_oqc.request}</Box>
                                <Box className="cell-custom">{item.wrb_oqc.respose}</Box>
                                <Box className="cell-custom">{getPercentage(item.wrb_oqc.respose, item?.wrb_oqc.request)}%</Box>
                            </Box>
                            <Box width={'10%'} sx={{ borderLeft: '1px solid #333' }}>
                                <Box className="cell-custom">{item.oqc_1_2.request}</Box>
                                <Box className="cell-custom">{item.oqc_1_2.respose}</Box>
                                <Box className="cell-custom">{getPercentage(item.oqc_1_2.respose, item?.oqc_1_2.request)}%</Box>
                            </Box>
                            <Box width={'10%'} sx={{ borderLeft: '1px solid #333' }}>
                                <Box className="cell-custom">{item.assy.request}</Box>
                                <Box className="cell-custom">{item.assy.respose}</Box>
                                <Box className="cell-custom">{getPercentage(item.assy.respose, item?.assy.request)}%</Box>
                            </Box>
                            <Box width={'10%'} sx={{ borderLeft: '1px solid #333' }}>
                                <Box className="cell-custom">{item.mqis.request}</Box>
                                <Box className="cell-custom">{item.mqis.respose}</Box>
                                <Box className="cell-custom">{(getPercentage(item.mqis.respose, item?.mqis.request))}%</Box>
                            </Box>
                            <Box width={'10%'} sx={{ borderLeft: '1px solid #333', borderRight: '1px solid #333', fontWeight: 'bold', color: '#005595' }}>
                                <Box className="cell-custom">{getSumRow(item, 'RQ')}</Box>
                                <Box className="cell-custom">{getSumRow(item, 'RS')}</Box>
                                <Box className="cell-custom">{getSumRowPercentage(item)}%</Box>
                            </Box>
                        </Stack>
                    ))
                }
                <Stack key={'index'} sx={{ fontWeight: 'bold', color: '#005595' }} width={'100%'} direction={'row'}>
                    <Box width={'13%'} sx={{ borderLeft: '1px solid #333', borderBottom: '1px solid #333', fontWeight: 'bold', textAlign: 'center', lineHeight: '55px', color: '#005595' }} >
                        Total
                    </Box>
                    <Box width={'17%'} sx={{ borderLeft: '1px solid #333' }}>
                        <Box className="cell-custom">통보서(Thông báo)</Box>
                        <Box className="cell-custom">대책서(Đối sách)</Box>
                        <Box className="cell-custom">완료율(Tỷ lệ)</Box>
                    </Box>
                    <Box width={'10%'} sx={{ borderLeft: '1px solid #333' }}>
                        <Box className="cell-custom">{getSum(DATA.map(item => item.iqc.request))}</Box>
                        <Box className="cell-custom">{getSum(DATA.map(item => item.iqc.respose))}</Box>
                        <Box className="cell-custom">100%</Box>
                    </Box>
                    <Box width={'10%'} sx={{ borderLeft: '1px solid #333' }}>
                        <Box className="cell-custom">{getSum(DATA.map(item => item.oqc.request))}</Box>
                        <Box className="cell-custom">{getSum(DATA.map(item => item.oqc.respose))}</Box>
                        <Box className="cell-custom">100%</Box>
                    </Box>
                    <Box width={'10%'} sx={{ borderLeft: '1px solid #333' }}>
                        <Box className="cell-custom">2</Box>
                        <Box className="cell-custom">1</Box>
                        <Box className="cell-custom">50%</Box>
                    </Box>
                    <Box width={'10%'} sx={{ borderLeft: '1px solid #333' }}>
                        <Box className="cell-custom">3</Box>
                        <Box className="cell-custom">3</Box>
                        <Box className="cell-custom">100%</Box>
                    </Box>
                    <Box width={'10%'} sx={{ borderLeft: '1px solid #333' }}>
                        <Box className="cell-custom">3</Box>
                        <Box className="cell-custom">5</Box>
                        <Box className="cell-custom">60%</Box>
                    </Box>
                    <Box width={'10%'} sx={{ borderLeft: '1px solid #333' }}>
                        <Box className="cell-custom">2</Box>
                        <Box className="cell-custom">2</Box>
                        <Box className="cell-custom">100%</Box>
                    </Box>
                    <Box width={'10%'} sx={{ borderLeft: '1px solid #333', borderRight: '1px solid #333', fontWeight: 'bold', color: '#005595' }}>
                        <Box className="cell-custom">10</Box>
                        <Box className="cell-custom">10</Box>
                        <Box className="cell-custom">100%</Box>
                    </Box>
                </Stack>
            </Box>
        </MainCard></>)
}

export default Statistic;