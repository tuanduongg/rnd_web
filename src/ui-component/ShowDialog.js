import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

export const ShowConfirm = ({ title, message, onOK = () => {}, onNO = () => {}, labelYes = 'Yes', labelNo = 'No' }) => {
    confirmAlert({
        closeOnEscape: false,
        closeOnClickOutside: false,
        keyCodeForClose: [8, 32],
        title: title,
        message: message,
        buttons: [
            {
                label: labelYes,
                onClick: onOK
            },
            {
                label: labelNo,
                onClick: onNO
            }
        ],
        
    });
};

export const ShowMessage = ({ title, message, onOK = () => {}, labelYes = 'Yes' })=>{
    confirmAlert({
        closeOnEscape: false,
        closeOnClickOutside: false,
        keyCodeForClose: [8, 32],
        title: title,
        message: message,
        buttons: [
            {
                label: labelYes,
                onClick: onOK
            }
        ],
        
    });
}
