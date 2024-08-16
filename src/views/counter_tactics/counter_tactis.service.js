export const DATA = [
    {
        iqc: {
            name: 'IQC',
            request: 1,
            respose: 1,
        },
        oqc: {
            name: 'OQC',
            request: 5,
            respose: 4,
        },
        wrb_oqc: {
            name: 'WRB OQC',
            request: 1,
            respose: 1,
        },
        oqc_1_2: {
            name: 'OQC(1,2)',
            request: 1,
            respose: 1,
        },
        assy: {
            name: 'Assy',
            request: 1,
            respose: 1,
        },
        mqis: {
            name: 'MQIS',
            request: 5,
            respose: 2,
        },
        id: 'ACC'
    },
    {
        iqc: {
            name: 'IQC',
            request: 1,
            respose: 1,
        },
        oqc: {
            name: 'OQC',
            request: 5,
            respose: 4,
        },
        wrb_oqc: {
            name: 'WRB OQC',
            request: 1,
            respose: 1,
        },
        oqc_1_2: {
            name: 'OQC(1,2)',
            request: 1,
            respose: 1,
        },
        assy: {
            name: 'Assy',
            request: 1,
            respose: 1,
        },
        mqis: {
            name: 'MQIS',
            request: 5,
            respose: 2,
        }, id: 'RUBBER'
    },
    {
        iqc: {
            name: 'IQC',
            request: 1,
            respose: 1,
        },
        oqc: {
            name: 'OQC',
            request: 5,
            respose: 4,
        },
        wrb_oqc: {
            name: 'WRB OQC',
            request: 1,
            respose: 1,
        },
        oqc_1_2: {
            name: 'OQC(1,2)',
            request: 1,
            respose: 1,
        },
        assy: {
            name: 'Assy',
            request: 1,
            respose: 1,
        },
        mqis: {
            name: 'MQIS',
            request: 5,
            respose: 2,
        }, id: 'CONVERTING'
    },
    {
        iqc: {
            name: 'IQC',
            request: 1,
            respose: 1,
        },
        oqc: {
            name: 'OQC',
            request: 5,
            respose: 4,
        },
        wrb_oqc: {
            name: 'WRB OQC',
            request: 1,
            respose: 1,
        },
        oqc_1_2: {
            name: 'OQC(1,2)',
            request: 1,
            respose: 1,
        },
        assy: {
            name: 'Assy',
            request: 1,
            respose: 1,
        },
        mqis: {
            name: 'MQIS',
            request: 5,
            respose: 2,
        }, id: 'INJECTION'
    },
    {
        iqc: {
            name: 'IQC',
            request: 1,
            respose: 1,
        },
        oqc: {
            name: 'OQC',
            request: 5,
            respose: 4,
        },
        wrb_oqc: {
            name: 'WRB OQC',
            request: 1,
            respose: 1,
        },
        oqc_1_2: {
            name: 'OQC(1,2)',
            request: 1,
            respose: 1,
        },
        assy: {
            name: 'Assy',
            request: 1,
            respose: 1,
        },
        mqis: {
            name: 'MQIS',
            request: 5,
            respose: 2,
        }, id: 'METAL KEY'
    },
];

export const getSum = (arr = []) => {
    if (arr?.length > 0) {
        const sum = arr.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0,
        );
        return sum;
    }
    return 0;
}
export const getSumRow = (item, type) => {
    let arr = [];
    switch (type) {
        case 'RQ':
            arr = [item.iqc.request, item.oqc.request, item.oqc_1_2.request, item.wrb_oqc.request, item.assy.request, item.mqis.request];
            break;
        case 'RS':
            arr = [item.iqc.respose, item.oqc.respose, item.oqc_1_2.respose, item.wrb_oqc.respose, item.assy.respose, item.mqis.respose];
            break;

        default:
            break;
    }
    return getSum(arr);
}
export const getSumRowPercentage = (item) => {
    const arrRq = getSum([item.iqc.request, item.oqc.request, item.oqc_1_2.request, item.wrb_oqc.request, item.assy.request, item.mqis.request]);
    const arrRs = getSum([item.iqc.respose, item.oqc.respose, item.oqc_1_2.respose, item.wrb_oqc.respose, item.assy.respose, item.mqis.respose]);
    const percentage = getPercentage(arrRs, arrRq);
    return percentage;
}

export const getPercentage = (a, b) => {
    return (a / b * 100).toFixed();
}