import React, { useState,useEffect } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {ProgressBarHorizontal} from "./ProgressBar";

const TrackSearchComponent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [tracks, setTracks] = useState([]);
    const [audioUrl, setAudioUrl] = useState('');
    const [isPlaying, setIsPlaying] = useState(0);
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [realData, setRealData] = useState({});
    const [userId, setUserId] = useState(0);
    const [nowPlayingImg, setNowPlayingImg] = useState(0);
    const audioRef = React.createRef();
    const [currentTime, setCurrentTime] = useState('');
    const [duration, setDuration] = useState('');
    const [currentSecTime, setCurrentSecTime] = useState(0);
    const [durationSec, setDurationSec] = useState(1);
    const [repeat , setRepeat] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [soundOn, setSoundOn] = useState(true);

    useEffect(() => {
        const jwtToken = localStorage.getItem('token');
        if(!jwtToken) {
            return;
        }
        fetch('http://localhost:8000/user/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jwtToken)
        }).then(response => response.json())
            .then(userData => {
                console.log(userData);
                const realData = userData.body;
                setRealData(realData);

                if(realData && realData.name) {
                    console.log(realData.name);
                    setName(realData.name);
                    setUserId(realData.id);
                }

            })
            .catch(error => navigate('/'));
        // Код, который нужно выполнить при монтировании компонента
        console.log('Component mounted');

        return () => {
            if(!jwtToken){
                navigate('/');
            }
            console.log('Component unmounted');
        };
    }, []);

    const handlePlayTrack = async (id) => {
        try {
            if(repeat===true || id === nowPlayingImg) {
                togglePlay();
                return;
            }
            handleStopTrack();
            const response = await axios.post('http://localhost:8000/music/track/musicFile', {
                id: id
            }, { responseType: 'arraybuffer' });
            const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(audioUrl);
            setIsPlaying(id);
            setNowPlayingImg(id);
            console.log("Track with ID ", id, " is playing.");
        } catch (error) {
            console.error("Error playing track with ID ", id, ":", error);
        }
    };
    const togglePlay = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleNextTrack = () => {
        for(let i = 0; i < tracks.length; i++) {
            if( repeat===true && tracks[i].id === nowPlayingImg) {

                setCurrentSecTime(0);
                audioRef.current.currentTime = 0;
                const audio = audioRef.current
                audio.play();
                setIsPlaying(tracks[i].id);
                console.log(isPlaying);
                break;
            } else if(tracks[i+1] === undefined){
                handlePlayTrack(tracks[0].id);
                break;
            }
            else if(tracks[i].id === nowPlayingImg) {
                handlePlayTrack(tracks[i+1].id);
                break;
            }
        }
    }
    const handlePreviousTrack = () => {
        for(let i = 0; i < tracks.length; i++) {
            if(currentSecTime > 5) {
                setCurrentSecTime(0);
                audioRef.current.currentTime = 0;
                break;
            } else if (tracks[i-1] === undefined) {
                handlePlayTrack(tracks[i].id);
                break;
            } else if(tracks[i].id === nowPlayingImg) {
                handlePlayTrack(tracks[i-1].id);
                break;
            }
        }
    }
    const handleStopTrack = () => {
        setAudioUrl('');
        setIsPlaying(0);
        setNowPlayingImg(0);
    };

    const minusPage = () => {
        if (page > 0) {
            setPage(page - 1);
            setTracks([]);
            trySubmitPageMinus();
        }
    }
    const plusPage = () => {
        setPage(page + 1);
        setTracks([]);
        trySubmitPagePlus();
    }

    const submit = async (event) => {
        if (event.target.name === 'trackName') {
            await setSearchTerm(event.target.value);
            await trySubmit();
        }
    };
    const trySubmitPagePlus = async (event) => {
        try {
            const response = await axios.post('http://localhost:8000/music/getTracksByName', {
                name: searchTerm,
                page: page+1
            });
            for(let i=0;i<response.data.length;i++){
                response.data[i].author= await loadAuthor(response.data[i].authorId);
                response.data[i].imageUrl = "http://localhost:8000/music/track/imageFile/" + response.data[i].id;
            }
            setTracks(response.data);
        } catch (error) {
            console.error('Error fetching tracks:', error);
            setTracks([]);
        }
    }
    const trySubmitPageMinus = async (event) => {
        try {
            const response = await axios.post('http://localhost:8000/music/getTracksByName', {
                name: searchTerm,
                page: page-1
            });
            for(let i=0;i<response.data.length;i++){
                response.data[i].author= await loadAuthor(response.data[i].authorId);
                response.data[i].imageUrl = "http://localhost:8000/music/track/imageFile/" + response.data[i].id;
            }
            setTracks(response.data);
        } catch (error) {
            console.error('Error fetching tracks:', error);
            setTracks([]);
        }
    }

    const trySubmit = async (event) => {
        try {
            const response = await axios.post('http://localhost:8000/music/getTracksByName', {
                name: searchTerm,
                page: page
            });
            for(let i=0;i<response.data.length;i++){
                response.data[i].author= await loadAuthor(response.data[i].authorId);
                response.data[i].imageUrl = "http://localhost:8000/music/track/imageFile/" + response.data[i].id;
            }
            setTracks(response.data);
        } catch (error) {
            console.error('Error fetching tracks:', error);
            setTracks([]);
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/music/getTracksByName', {
                name: searchTerm,
                page: page
            });
            for(let i=0;i<response.data.length;i++){
                response.data[i].author= await loadAuthor(response.data[i].authorId);
                response.data[i].imageUrl = "http://localhost:8000/music/track/imageFile/" + response.data[i].id;
            }
            setTracks(response.data);
        } catch (error) {
            console.error('Error fetching tracks:', error);
            setTracks([]);
        }
    };
    const loadAuthor = async (id) => {
        try {
            const formData = new FormData();

            formData.append('id', id);

            const response = await axios.post('http://localhost:8000/author/getAuthorById', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data.name);
            return response.data.name
        } catch (error) {
            console.error('Error fetching authors:', error);
            return "NoName";
        }
    }
    const handleAddTrack = async (id) =>{
        try {
            const formData = new FormData();
            console.log(userId);
            formData.append('userId', userId);
            formData.append('trackId', id);
            const response = await axios.post('http://localhost:8000/user/addToPlaylist', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching authors:', error);
        }
    }

    const getBorders= (id)=>{
        if(id===nowPlayingImg){
            return { border : "2px solid #f6e751"};
        }else{
            return {};
        }
    }
    const handleLoadedMetadata = () => {
        const audio = audioRef.current;
        const total = audio.duration;
        setDurationSec(total)
        const minutes = Math.floor(total / 60);
        const seconds = Math.floor(total % 60);
        const formatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        setDuration(formatted);
    };
    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        const total = audio.currentTime;
        setCurrentSecTime(total);
        const minutes = Math.floor(total / 60);
        const seconds = Math.floor(total % 60);
        const formatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        setCurrentTime(formatted);
    };
    const getImageUrl = () => {
        for(let i = 0; i < tracks.length; i++) {
            if(tracks[i].id === nowPlayingImg) {
                return tracks[i].imageUrl;
            }
        }
    }
    const getNowTrackName = () => {
        for(let i = 0; i < tracks.length; i++) {
            if(tracks[i].id === nowPlayingImg) {
                return tracks[i].name;
            }
        }
    }
    const getNowTrackAuthor = () => {
        for(let i = 0; i < tracks.length; i++) {
            if(tracks[i].id === nowPlayingImg) {
                return tracks[i].author;
            }
        }
    }
    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const progressBarRect = e.target.getBoundingClientRect();
        const clickOffsetX = e.clientX - progressBarRect.left;
        const clickedPercent = (clickOffsetX / progressBarRect.width) * 100;
        const newCurrentSecTime = Math.round((durationSec * clickedPercent) / 100);
        setCurrentSecTime(newCurrentSecTime);
        audioRef.current.currentTime = newCurrentSecTime;
    };

    const handleProgressBarChange = (e) => {
        const progressBarRect = e.target.getBoundingClientRect();
        const clickOffsetX = e.clientX - progressBarRect.left;
        const clickedPercent = (clickOffsetX / progressBarRect.width) * 100;
        const newCurrentSecTime = Math.round((durationSec * clickedPercent) / 100);
        setCurrentSecTime(newCurrentSecTime);
        audioRef.current.currentTime = newCurrentSecTime;
    };

    const changeRepeat = () => {
        if (repeat) {
            setRepeat(false);
        } else {
            setRepeat(true);
        }
    }

    const changeSound = () => {
        const audio = audioRef.current;
        if (soundOn) {
            audio.muted = true;
            setSoundOn(false);
        } else {
            audio.muted = false;
            setSoundOn(true);
        }
    }
    return (
        <div className={"profile-container"}>
        <div className={"hello"}><p>Привет, {name} !   </p>
            <div className={"find-new"}
                 onClick={() => {
                     navigate('/profile');
                 }}>Назад на главную</div>
            <div className={"find-new"}
                 onClick={() => {
                     navigate('/upload');
                 }}>Загрузить трек в профиль</div>
            <div className={"find-new"}
                 onClick={() => {
                     navigate('/creativity');
                 }}>Мои профили исполнителей</div>
        </div>
            <div className={"main-title"}>Поиск: </div>

            <div className={"place-for-tracks"}>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="trackName"
                        value={searchTerm}
                        onChange={submit}
                        placeholder="Введите название трека"
                    />
                    <button className={"plus-page"} type="submit" hidden={"true"}>Найти</button>
                </form>
                <div className={"page-manager"}>
                    <div onClick={minusPage} className={"minus-page"}>Назад</div>
                    <div className={"page-num"}>{page}</div>
                    <div onClick={plusPage} className={"plus-page"}>Вперёд</div>
                </div>
                <br/><br/>
                {tracks.map((track) => (
                    <div key={track.id} className={"track-card"} style={getBorders(track.id)}
                         onClick={() => handlePlayTrack(track.id)}>
                        <div className={"track-image"}>
                            <img src={track.imageUrl} alt="" height={"100%"}/>
                        </div>
                        <div className={"card-text"}>
                            <div className={"track-name"}>{track.name}</div>
                            <div className={"author-name"}>{track.author}</div>
                        </div>
                        <div className={"anim"} hidden={track.id!==nowPlayingImg}>
                            <div className={"load-1"}>
                                <div className={"line"}></div>
                                <div className={"line"}></div>
                            </div>
                        </div>
                        <div className={"add-to-favourite"} onClick={() =>handleAddTrack(track.id)}>
                            <img src={"favorite.png"} alt="" height={"100%"}/>
                        </div>

                    </div>
                ))}
            </div>

            {audioUrl && (
                <div className={"player"}>
                    <div className={"player-img"}>
                        <img src={getImageUrl()} alt="" height={"100%"}/>
                    </div>
                    <audio ref={audioRef} controls onLoadedMetadata={handleLoadedMetadata} onTimeUpdate={handleTimeUpdate} autoPlay onEnded={handleNextTrack} hidden={true}>
                        <source src={audioUrl} type='audio/mpeg' />
                    </audio>

                    <div onClick={handleStopTrack} className={"stop-button"}>✕</div>
                    <div className={"progress-bar-container"}>
                        <div className={"track-name-player"}>{getNowTrackName()}</div>
                        <div className={"author-name-player"}>{getNowTrackAuthor()}</div>
                        <div className={"clickable"}  onMouseDown={handleMouseDown}
                             onMouseUp={handleMouseUp}
                             onMouseMove={handleMouseMove}
                             onClick={handleProgressBarChange}>
                            <div className={"progress-wrapper"}>
                                <ProgressBarHorizontal durationSec={durationSec} currentSecTime={currentSecTime} />
                            </div>
                        </div>
                        <div className={"currentTime"}>{currentTime}</div>
                        <div className={"duration"}>{duration}</div>
                        <div onClick={togglePlay} className={"pause-button"}>
                            {isPlaying ? <img src={"pause.png"} alt="" height={"100%"}/> : <img src={"play.png"} alt="" height={"100%"}/>}
                        </div>
                        <div onClick={handleNextTrack} className={"next-button"}>
                            <img src={"img.png"} alt="" height={"100%"}/>
                        </div>
                        <div onClick={handlePreviousTrack} className={"previous-button"}>
                            <img src={"img1.png"} alt="" height={"100%"}/>
                        </div>
                        <div onClick={changeSound} className={"sound-button"}>
                            {soundOn ? <img src={"sound.png"} alt="" height={"75%"}/> : <img src={"mute.png"} alt="" height={"75%"}/>}
                        </div>
                        <div onClick={changeRepeat} className={"repeat-button"}>
                            {repeat ? <img src={"repeat.png"} alt="" height={"100%"}/> : <img src={"repeatGrey.png"} alt="" height={"100%"}/>}
                        </div>
                    </div>

                </div>
            )}


        </div>
    );
};

export default TrackSearchComponent;