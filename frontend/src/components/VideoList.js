import { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { setVideoFileUrl, setDocId, setVideoTitle, setSubtitleFileTitle, setSubtitleFileUrl, setSubtitles } from '../redux/actions';
import "./VideoList.css";

const VideoList = ({backendUrl, docId, setVideoFileUrl, setDocId, setVideoTitle, setSubtitleFileTitle, setSubtitleFileUrl, setSubtitles }) => {
  const [videolist, setVideolist] = useState([]);
 
  useEffect(() => {
    fetch(`${backendUrl}/allvideos`)
      .then((response) => response.json())
      .then((data) => {
        setVideolist(data);
      })
      .catch((error) => {
        console.error('Error fetching video list:', error);
      });
  }, [backendUrl,docId]);

  function convertTimeToSeconds(timeString) {
    // Convert time in format "00:00:04,900" to seconds
    const [hours, minutes, seconds] = timeString.split(":").map(parseFloat);
    const milliseconds = parseFloat(timeString.split(",")[1]);
    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
  }

  function convertSubtitles(subtitlesArray) {
    return subtitlesArray.map((subtitle) => {
      const startTimeInSeconds = convertTimeToSeconds(subtitle.startTime);
      const endTimeInSeconds = convertTimeToSeconds(subtitle.endTime);

      return {
        startTime: startTimeInSeconds,
        endTime: endTimeInSeconds,
        text: subtitle.text,
      };
    });
  }

  const fetchSubtitles = async (id) => {
    if (id)
      try {
        const response = await fetch(`${backendUrl}/fetchsubtitle?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          const converteddata = convertSubtitles(data);
          setSubtitles(converteddata);
        } else {
          console.error("Failed to fetch subtitles");
        }
      } catch (error) {
        console.error("Error fetching subtitles:", error);
      }
  };



  const handleVideoClick = async (selectedVideo) => {
    setVideoFileUrl(selectedVideo.videoUrl);
    setDocId(selectedVideo._id);
    setVideoTitle(selectedVideo.videoTitle);
    setSubtitleFileTitle(selectedVideo.subtitleName);
    setSubtitleFileUrl(selectedVideo.subtitleUrl);
    if (selectedVideo.subtitleName === "NA") {
      setSubtitles([]);
    } else {
      fetchSubtitles(selectedVideo._id);
    }
  };





  return (
    <div className="VideoList">
      VideoList
      <br />
      {videolist.filter((video) => video._id !== docId).map((video) => (
        <div key={video._id}  >
          <div className="video-item" onClick={() => handleVideoClick(video)} >{video.videoTitle}</div>
        </div>
      ))}

    </div>
  )
}

const mapStateToProps = (state) => ({
  backendUrl: process.env.REACT_APP_BACKEND_URL,
  docId: state.docId,
});

const mapDispatchToProps = {
  setVideoFileUrl,
  setDocId,
  setVideoTitle,
  setSubtitleFileTitle,
  setSubtitleFileUrl,
  setSubtitles,
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoList);