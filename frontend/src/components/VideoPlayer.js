// src/components/VideoPlayer.js
import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player';
import {  setCurrentVideoTime } from '../redux/actions';
import './VideoPlayer.css';

const VideoPlayer = ({ videoFileUrl, setCurrentVideoTime, backendUrl }) => {
  const [played, setPlayed] = useState(0);
  const playerRef = useRef(null);
  const handleProgress = ({ played }) => {
    setPlayed(played);
    const currentTime = playerRef.current.getCurrentTime();
    setCurrentVideoTime(currentTime);
  };

  return (
    <div className="video-player">
      
      <ReactPlayer
        ref={playerRef}
        url={videoFileUrl}
        controls
        className="react-player"
        onProgress={handleProgress}
        played={played}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  backendUrl: process.env.REACT_APP_BACKEND_URL,
  videoFileUrl: state.videoFileUrl,
});

const mapDispatchToProps = {
  setCurrentVideoTime,
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer);
