import React from "react";

const ToggleButton = ({ isToggled, onToggle }) => {
    const handleToggle = () => {
        onToggle(!isToggled);
    };

    return (
        <label className="switch">
            <input type="checkbox" checked={isToggled} onChange={handleToggle} />
            <span className="slider"></span>
        </label>
    );
};

export default ToggleButton;
