// src/components/SubtitleInput.js
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { addSubtitle, setSubtitleFileUrl } from '../redux/actions';
import './SubtitleInput.css';

const SubtitleInput = ({docId, videoFileUrl, subtitleFileUrl, subtitles, addSubtitle, setSubtitleFileUrl, backendUrl}) => {
  const [subtitleText, setSubtitleText] = useState('');
  const [starthours, setStarthours] = useState('');
  const [startminutes, setStartminutes] = useState('');
  const [startseconds, setStartseconds] = useState('');
  const [endhours, setEndhours] = useState('');
  const [endminutes, setEndminutes] = useState('');
  const [endseconds, setEndseconds] = useState('');
  
  function validatetime(time){
      let t = parseFloat(time);
      if(t<=60 && t>=0 ) return true;
      else return false;
  }

  const handleAddSubtitle = () => {

    let sh = starthours||"0";
    
    let sm = startminutes||"0";
    if(!validatetime(sm)){
      alert("invalid start minutes");
      return;
    }
    let ss = startseconds||"0";
    if(!validatetime(ss)){
      alert("invalid start seconds");
      return;
    }
    let eh = endhours||"0";
    let em = endminutes||"0";
    if(!validatetime(em)){
      alert("invalid end minutes");
      return;
    }
    let es = endseconds||"0";
    if(!validatetime(es)){
      alert("invalid end seconds");
      return;
    }

    let newsubtitle;
    let newsubtitleStartTime = parseFloat(sh)*3600;
    newsubtitleStartTime = newsubtitleStartTime + parseFloat(sm)*60;
    newsubtitleStartTime = newsubtitleStartTime+ parseFloat(ss);
    
    let newsubtitleEndTime = parseFloat(eh)*3600;
    newsubtitleEndTime += parseFloat(em)*60;
    newsubtitleEndTime += parseFloat(es);
    

    let newsubtitletext = subtitleText;
     newsubtitle = {
      startTime:newsubtitleStartTime,
      endTime:newsubtitleEndTime,
      text:newsubtitletext
    }
    addSubtitle(newsubtitle);
    setSubtitleText('');
    setStarthours('');
    setStartminutes('');
    setStartseconds('');
    setEndhours('');
    setEndminutes('');
    setEndseconds('');
  };

  const handleSubmitSubtitle = async () => {
    // Validate if subtitles array is not empty and docId is available
    
    if (subtitles.length === 0 || !docId) {
      console.error('Subtitles array or docId is missing');
      return;
    }

    const userConfirmed = window.confirm('Are you sure you want to publish these subtitles? \n You won\'t be able to add more subtitle.');

    if (!userConfirmed) {
      console.log('User cancelled subtitle publishing.');
      return;
    }

    try {
      // Make a POST request to the backend endpoint with subtitles array and docId
      const response = await fetch(`${backendUrl}/upload/subtitlefile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          docId,
          subtitles,
        }),
      })
     

      if (response.ok) {
        
        // console.log('Subtitles successfully submitted to the backend');
       
        setSubtitleFileUrl(response.downloadUrl);
        
      } else {
        console.error('Failed to submit subtitles to the backend');
      }
    } catch (error) {
      console.error('Error submitting subtitles to the backend:', error);
    }
  };

  


  useEffect( () => {

  },[docId,subtitleFileUrl,] )

 
  if(videoFileUrl && subtitleFileUrl==="NA")
  return (
    <div className="subtitle-input">
      Subtitle Input
      <textarea
        value={subtitleText}
        onChange={(e) => setSubtitleText(e.target.value)}
        placeholder="Enter subtitle text..."
        className="subtitle-textarea"
      />
      <div className='time-inputs-container'>
        <div className='starttime-inputs'>
          <input
            type="number"
            
            value={starthours}
            onChange={(e) => setStarthours(e.target.value)}
            placeholder="1"
            className='starttime-input-item time-inputs'
          />:
          <input
            type="number"
            max={60}
            min={0}
            value={startminutes}
            onChange={(e) => setStartminutes(e.target.value)}
            placeholder="5"
            className='starttime-input-item time-inputs'
          />:

          <input
            type="number"
            max={60}
            min={0}
            value={startseconds}
            onChange={(e) => setStartseconds(e.target.value)}
            placeholder="2"
            className='starttime-input-item time-inputs'
          />
        </div>
        <div className='sep' >- &gt; </div>
        <div className='endtime-inputs '>
          <input
            type="number"
            value={endhours}
            onChange={(e) => setEndhours(e.target.value)}
            placeholder="01"
            className='endtime-input-item time-inputs'
          />:
          <input
            type="number"
            max={60}
            min={0}
            value={endminutes}
            onChange={(e) => setEndminutes(e.target.value)}
            placeholder="05"
            className='endtime-input-item time-inputs'
          />:

          <input
            type="number"
            max={60}
            min={0}
            value={endseconds}
            onChange={(e) => setEndseconds(e.target.value)}
            placeholder="9"
            className='endtime-input-item time-inputs'
          />
        </div>
      </div>
      <div className='submit-button-container'>
        
      <button className='add-button' onClick={handleAddSubtitle}>Add</button>
      </div>
      <div>
      <button className='submit-button' onClick={handleSubmitSubtitle}>Publish</button>

      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  backendUrl: process.env.REACT_APP_BACKEND_URL,
  docId: state.docId,
  videoFileUrl: state.videoFileUrl,
  subtitleFileUrl: state.subtitleFileUrl,
  subtitles: state.subtitles
});

const mapDispatchToProps = {
  addSubtitle,
  setSubtitleFileUrl,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubtitleInput);
