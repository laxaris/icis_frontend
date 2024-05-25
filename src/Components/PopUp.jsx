import React from 'react';

const PopUp = ({ message, onClose }) => {
    const errorMessage = typeof message === 'object' ? message.message : message;

    return (
        <div className="popup">
            <div className="popup-inner">
                <h2>{errorMessage}</h2>
            </div>
        </div>
    );
};

export default PopUp;
