import './App.css';
import { Provider } from 'react-redux';
import store from './store';
import VideoUploader from './components/VideoUploader';
import VideoPlayer from './components/VideoPlayer';
import VideoList from './components/VideoList';
import SubtitleDisplay from './components/SubtitleDisplay';
import SubtitleInput from './components/SubtitleInput';

function App() {
  
  return (
    <Provider store={store}>
    <div className="App">
      <div className='app-left' >
        <div className='user-outputs'>

      <VideoPlayer />
      <SubtitleDisplay/>
        </div>
      <div className='user-inputs'>
      <VideoUploader/>
      <SubtitleInput/>
      </div>
      </div>
      <div className='app-right'>
      <VideoList />
      </div>
    </div>
    </Provider>
  );
}

export default App;
