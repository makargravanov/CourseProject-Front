import React, { useState } from 'react';
//import './App.css';
import { LogReg } from "./components/Log-Reg";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Profile from "./components/Profile";
import TrackSearchComponent from "./components/TrackSearchComponent";
import UploadTrackForm from "./components/UploadTrackForm";
import MyCreativity from "./components/MyCreativity";
import CreateAuthor from "./components/CreateAuthor";
import AnimatedBackground from "./components/AnimatedBackground";
function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<LogReg />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/tracksearch" element={<TrackSearchComponent />} />
                    <Route path="/upload" element={<UploadTrackForm />} />
                    <Route path="/creativity" element={<MyCreativity/>} />
                    <Route path="/createAuthor" element={<CreateAuthor/>} />
                    {/* Другие маршруты для отображения других страниц */}
                </Routes>
            </Router>
        </div>
    );
}
export default App;