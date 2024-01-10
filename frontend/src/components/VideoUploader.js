// src/components/VideoUploader.js
import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { setVideoFileUrl,setDocId,setVideoTitle,setSubtitleFileTitle, setSubtitleFileUrl, setSubtitles } from '../redux/actions';
import Dropzone  from 'react-dropzone';
// import axios from 'axios';
import './VideoUploader.css';

const VideoUploader = ({ setVideoFileUrl, setDocId, setSubtitleFileTitle, setSubtitleFileUrl,setSubtitles , backendUrl }) => {
  //File Input
  const allowedTypes = [ "video/mp4",
  "video/webm",
  "video/ogg",
  "video/avi",
  "video/mkv",
  "video/mov",];

  const dropzoneRef = useRef(null);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);


  const onDrop = (acceptedFiles) => {
    const currentFile = acceptedFiles[0];
    if(allowedTypes.includes(currentFile.type)){
      setFile(currentFile);
    }else{
      alert("File format is not supported!!! \n(Supported file types are .mp4,.mkv,.mov)")
      acceptedFiles = [];
    }
    
  };


  const handleUpload = async () => {
    if (!file) {
      console.error('No file selected');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${backendUrl}/upload/videofile`, {
        method: 'POST',
        body: formData,
        onProgress: (progressEvent) => {
          // Calculate and update upload progress
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          setUploadProgress(progress);
        },
      });

      if (response.ok) {
        const result = await response.json();
        setVideoFileUrl(result.downloadUrl);
        setDocId(result.documentId);
        setVideoTitle(result.fileName);
        setSubtitleFileTitle("NA");
        setSubtitleFileUrl("NA");
        setSubtitles([]);
        alert("file uploaded sucessfully")
      } else {
        
        console.error('Failed to upload file');
      }
    } catch (error) {
      
      console.error('Error uploading file:', error);
    }finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };





return (
  <div className="video-uploader">
    Upload Video
    <div className='dropzone-container'>

    <Dropzone onDrop={onDrop} ref={dropzoneRef}  >
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>{file ? `Selected File: ${file.name}` : 'Drag \'n\' drop a video file here, or click to select one'}</p>
        </div>
      )}
    </Dropzone>
      </div>

      {uploading && (
        <div className='upload-progress'>
          <p>Uploading...</p>
          <progress value={uploadProgress} max={100} />
        </div>
      )}

        <div className='video-upload-button-container'>

    <button className='video-upload-button' onClick={handleUpload} disabled={uploading} >Upload</button>
        </div>


  </div>
);
};

const mapStateToProps = (state) => ({
  backendUrl: process.env.REACT_APP_BACKEND_URL,
  
});

const mapDispatchToProps = {
  setVideoFileUrl,
  setDocId,
  setVideoTitle,
  setSubtitleFileTitle,
  setSubtitleFileUrl,
  setSubtitles,
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoUploader);
