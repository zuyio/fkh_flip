import React from 'react';

interface ProgressBarProps {
    progress: number; // 0 to 100
    color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = 'bg-black' }) => {
    // Ensure progress is between 0 and 100
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
                className={`h-full ${color} transition-all duration-500 ease-out`}
                style={{ width: `${clampedProgress}%` }}
            />
        </div>
    );
};

export default ProgressBar;
