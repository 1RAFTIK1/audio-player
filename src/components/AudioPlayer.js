// import React from 'react';
// import { AudioPlayer as Player } from 'react-h5-audio-player';
// import AudioPlayer from 'react-h5-audio-player';
// import 'react-h5-audio-player/lib/styles.css';

// const AudioPlayer = ({ track }) => {
//     return (
//         <div>
//             <Player
//                 src={track.file_path}
//                 onPlay={() => console.log("Playing")}
//                 // Add other props like onPause, onEnded, etc.
//             />
//         </div>
//     );
// };

// export default AudioPlayer;
import React from 'react';
import AudioPlayer from 'react-h5-audio-player'; // This is the correct import
import 'react-h5-audio-player/lib/styles.css';

const MyAudioPlayer = ({ tracks }) => {
    const [currentTrackIndex, setCurrentTrackIndex] = React.useState(0);

    const handleEnded = () => {
        setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
    };

    return (
        <AudioPlayer
            autoPlay
            src={tracks[currentTrackIndex]?.url}
            onEnded={handleEnded}
            onPlay={(e) => console.log("Playing")}
            // Add other props as needed
        />
    );
};

export default MyAudioPlayer;
