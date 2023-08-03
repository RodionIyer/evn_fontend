export const MODE = {
    CREATE: 1,
    EDIT: 2,
    VIEW: 0
}

export interface GroupChart {
    name: string;
    isExpanded: boolean;
    children: Chart[];
}

export interface Chart {
    icon: string;
    chartId: string;
    name: string;
}

export const LayoutType = {
    LT1: 'LT1', // Layout có 1 biểu đồ trên 1 hàng
    LT2: 'LT2', // Layout có 2 biểu đồ trên 1 hàng, 2 biểu đồ kích thước như nhau
    LT3: 'LT3', // Layout có 2 biểu đồ trên 1 hàng, 2 biểu đồ kích thước 1/3 - 2/3
    LT4: 'LT4', // Layout có 2 biểu đồ trên 1 hàng, 2 biểu đồ kích thước 2/3 - 1/3
    LT5: 'LT5', // Layout có 3 biểu đồ trên 1 hàng
}

export const Frame = {
    F1: 'F1',
    F2: 'F2',
    F3: 'F3'
}

export const ActionKey = {
    SAVE: 1, // ghi dữ liệu
    CANCEL: 2, // Hủy thao tác
    DELETE: 3, // Xóa dashboard
}

export interface Dashboard {
    MA_DASHBOARD: string;
    LAYOUT: string;
    USER_ID: string;
    LST_CHARTS: string;
    POSITION: string;
    USER_CR_ID: string;
    USER_CR_DTIME: Date;
    USER_MDF_ID: string;
    USER_MDF_DTIME: Date;
}

export interface BieuDo_NDL {
    chart: ChartAPI;
    nhomDuLieu: Nhom_DuLieu;
}

export interface Nhom_DuLieu {
    MA_BANG: string;
    MA_DULIEU: string;
}

export interface Nhom_DuLieu_Data {
    nhomDuLieu: Nhom_DuLieu;
    rows: any;
    data: any;
}

export interface ChartAPI {
    MA_BIEUDO: string;
    USERID: string;
    MO_TA: string;
    MA_LOAI_BIEUDO: string;
    CAU_HINH_HIEN_THI: string;
    MA_DULIEU: string;
    USER_CR_ID: string;
    USER_CR_DTIME: Date;
    USER_MDF_ID: string;
    USER_MDF_DTIME: Date;
    CHIEU: string;
    TEN_COT: string;
    HIEN: string;
    TRUC: string;
    DON_VI: string;
    MAU_SAC: string;
    STT_COT: string;
    STT_LOAI_BIEUDO: string;
    LOAI_BIEUDO_ICON: string;
    LOAI_BIEUDO: string;
}

export interface ChartDetail {
    series: any;
    chart: any;
    labels: any;
    title: any;
    xaxis: any;
    yaxis: any;
    colors: any;
    plotOptions: any;
    legend: any
}

export const URL = {
    VIEW: '/dashboards/dashboard',
    EMPTY: '/dashboards/dashboard/empty',
    CREATE: '/dashboards/dashboard/create',
    EDIT: '/dashboards/dashboard/edit'
}