export const setDocId = (id) => ({
    type: 'SET_DOC_ID',
    payload:id
})

export const setVideoTitle = (title) => ({
    type: 'SET_VIDEO_TITLE',
    payload: title,
})


export const setVideoFileUrl = (url) => ({
    type: 'SET_VIDEO_FILE_URL',
    payload: url,
});

export const setSubtitleFileTitle = (title) => ({
    type: 'SET_SUBTITLE_FILE_TITLE',
    payload: title,
});

export const setSubtitleFileUrl = (url) => ({
    type: 'SET_SUBTITLE_FILE_URL',
    payload: url,
});

export const addSubtitle = (newsubtitle) => ({
    type: 'ADD_SUBTITLE',
    payload: newsubtitle,
});


export const setSubtitles = (subtitles) => ({
    type: 'SET_SUBTITLES',
    payload: subtitles,
});


export const setCurrentVideoTime = (time) => {
    return {
        type: 'SET_CURRENT_VIDEO_TIME',
        payload: time,
    };
};


export const setSubtitleText = (text) => ({
    type: 'SET_SUBTITLE_TEXT',
    payload: text,
});




