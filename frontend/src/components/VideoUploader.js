// src/components/VideoUploader.js
import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { setVideoFileUrl,setDocId,setVideoTitle,setSubtitleFileTitle, setSubtitleFileUrl, setSubtitles } from '../redux/actions';
import Dropzone  from 'react-dropzone';
import axios from 'axios';
import './VideoUploader.css';

const VideoUploader = ({docId, setVideoFileUrl, setDocId, setSubtitleFileTitle, setSubtitleFileUrl,setSubtitles , backendUrl }) => {
  //File Input
  const allowedTypes = [ "video/mp4",
  "video/webm",
  "video/ogg",
  "video/avi",
  "video/mkv",
  "video/mov",];

  const dropzoneRef = useRef(null);

  const [file, setFile] = useState(null);
  const [selectedfile,setSelectedfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);


  const onDrop = (acceptedFiles) => {
    const currentFile = acceptedFiles[0];
    if(allowedTypes.includes(currentFile.type)){
      setSelectedfile(currentFile);
      setFile(currentFile);
    }else{
      alert("File format is not supported!!! \n(Supported file types are .mp4)")
      setSelectedfile(null);
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
      const response = await axios.post(`${backendUrl}/upload/videofile`, formData, {
        onUploadProgress: (progressEvent) => {
          let progress = Math.floor((progressEvent.loaded / (progressEvent.total*1.1) ) * 100);
          
          setUploadProgress(progress);
        },
      });
  
      if (response.status === 200) {
        const result = response.data;
        // Handle the result as needed
        setVideoFileUrl(result.downloadUrl);
        setDocId(result.documentId);
        setVideoTitle(result.fileName);
        setSubtitleFileTitle("NA");
        setSubtitleFileUrl("NA");
        setSubtitles([]);
        setSelectedfile(null);
        alert("File uploaded successfully");
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
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
          <p>{selectedfile ? `Selected File: ${selectedfile.name}` : 'Drag \'n\' drop a video file here, or click to select one'}</p>
        </div>
      )}
    </Dropzone>
      </div>

      {uploading && (
        <div className='upload-progress'>
          <p>Uploading...</p>
          <progress value={uploadProgress} max={100} />
          {uploadProgress===90?"saving the file this may take some time based on the size of video.":`uploading :${uploadProgress}`}
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
  docId:state.docId,
  
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
