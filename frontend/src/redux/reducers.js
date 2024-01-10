const initialState = {
    docId: '',
    videoFileTitle: '',
    videoFileUrl: 'NA',
    subtitleFileTitle: '',
    subtitleFileUrl: '',
    subtitles: [],
    subtitleText: '',
    currentVideoTime: 0,
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_DOC_ID':
            return {...state, docId:action.payload};

        case 'SET_VIDEO_TITLE':
            return { ...state, videoFileTitle: action.payload };

        case 'SET_VIDEO_FILE_URL':
            return { ...state, videoFileUrl: action.payload }

        case 'SET_SUBTITLE_FILE_TITLE':
            return { ...state, subtitleFileTitle: action.payload };

        case 'SET_SUBTITLE_FILE_URL':
            return { ...state, subtitleFileUrl: action.payload };

        case 'ADD_SUBTITLE':
            return { ...state, subtitles: [...state.subtitles, action.payload] };

        case 'SET_SUBTITLES':
            return { ...state, subtitles: action.payload };

        case 'SET_CURRENT_VIDEO_TIME':
            return { ...state, currentVideoTime: action.payload };

        default:
            return state;
    }
};

export default rootReducer;
