import React, { useState, useEffect } from 'react';

const ProgressBarHorizontal = ({ durationSec, currentSecTime }) => {
    const [progress, setProgress] = useState(0);


    const calculateProgress = () => {
        if (durationSec > 0) {
            const progressValue = (currentSecTime / durationSec) * 100;
            setProgress(progressValue);
        }
    };


    useEffect(() => {
        calculateProgress();
    }, [currentSecTime]);


    return (
        <div>
            <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
    );
};


const ProgressBarVertical = ({ durationSec, currentSecTime }) => {
    const [progress, setProgress] = useState(0);


    const calculateProgress = () => {
        if (durationSec > 0) {
            const progressValue = (currentSecTime / durationSec) * 100;
            setProgress(progressValue);
        }
    };


    useEffect(() => {
        calculateProgress();
    }, [currentSecTime]);


    return (
        <div>
            <div className="progress" style={{ height: `${progress}%`}}></div>
        </div>
    );
};

export {ProgressBarVertical, ProgressBarHorizontal};