import React from "react";

const CancelIcon: React.FC<{ size?: number; color?: string; className?: string }> = ({ size = 24, color = "currentColor", className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <circle cx="12" cy="12" r="12" fill="none" />
        <line x1="7" y1="7" x2="17" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <line x1="17" y1="7" x2="7" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export default CancelIcon;
