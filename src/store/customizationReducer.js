// project imports
import config from 'config';

// action - state management
import * as actionTypes from './actions';
export let initialState = {
    isOpen: [], // for active default menu
    defaultId: '/',
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    opened: true,
    openRightDrawer: false
};

const themeFromLocalString = localStorage.getItem('theme');
if (themeFromLocalString) {
    initialState = JSON.parse(themeFromLocalString);
}
// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationReducer = (state = initialState, action) => {
    let id;
    switch (action.type) {
        case actionTypes.MENU_OPEN:
            id = action.id;
            localStorage.setItem('theme', JSON.stringify({ ...state, isOpen: [id] }));
            return {
                ...state,
                isOpen: [id]
            };
        case actionTypes.MENU_OPEN_ARR:
            id = action.id;
            localStorage.setItem('theme', JSON.stringify({ ...state, isOpen: id }));
            return {
                ...state,
                isOpen: id
            };
        case actionTypes.SET_MENU:
            localStorage.setItem('theme', JSON.stringify({ ...state, opened: action.opened }));
            return {
                ...state,
                opened: action.opened
            };
        case actionTypes.SET_FONT_FAMILY:
            localStorage.setItem('theme', JSON.stringify({ ...state, fontFamily: action.fontFamily }));

            return {
                ...state,
                fontFamily: action.fontFamily
            };
        case actionTypes.SET_BORDER_RADIUS:
            localStorage.setItem('theme', JSON.stringify({ ...state, borderRadius: action.borderRadius }));
            return {
                ...state,
                borderRadius: action.borderRadius
            };
        case actionTypes.SET_OPEN_DRAWE_RIGHT:
            localStorage.setItem('theme', JSON.stringify({ ...state, openRightDrawer: action.openRightDrawer }));
            return {
                ...state,
                openRightDrawer: action?.openRightDrawer
            };
        default:
            return state;
    }
};

export default customizationReducer;
