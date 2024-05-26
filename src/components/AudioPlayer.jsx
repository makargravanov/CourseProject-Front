import React, { useState } from 'react';

const AudioPlayer = ({ audioUrl }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    let audio = new Audio(audioUrl);

    const togglePlay = () => {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    }

    return (
        <div>
            <button onClick={togglePlay}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
        </div>
    );
}

export default AudioPlayer;