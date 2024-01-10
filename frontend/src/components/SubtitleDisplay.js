// src/components/SubtitleDisplay.js
import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { setSubtitles } from '../redux/actions';
import './SubtitleDisplay.css';


const SubtitleDisplay = ({backendUrl, currentVideoTime, docId, subtitles, setSubtitles }) => {
  const visibleSubtitles = useMemo(() => {
    return subtitles.filter((subtitle) => {
      const startTime = parseFloat(subtitle.startTime);
      const endTime = parseFloat(subtitle.endTime); 
      return currentVideoTime >= startTime && currentVideoTime <= endTime;
    });
  }, [subtitles, currentVideoTime]);

  useEffect( ()=>{

  },[subtitles]);

  return (
    <div className="subtitle-display">
        {visibleSubtitles.map((subtitle, index) => (
          <div key={index} className="subtitle-item">
            {/* <span className="subtitle-timestamp">{subtitle.timestamp}</span> */}
            {subtitle.text}
          </div>
        ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
  backendUrl: process.env.REACT_APP_BACKEND_URL,
  subtitles: state.subtitles,
  docId: state.docId,
  currentVideoTime: state.currentVideoTime,
});


const mapDispatchToProps = {
  setSubtitles,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubtitleDisplay);
