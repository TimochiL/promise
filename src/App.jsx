import { useRef, useState } from 'react';
import { PhaserGame } from './game/PhaserGame';

function App ()
{
    // The sprite can only be moved in the MainMenu Scene
    const [play, setPlay] = useState(false);
    
    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef();

    const handleSetPlay = () => {
        setPlay(true);
    }

    return (
        <div id="app"> {
            play
                ? <PhaserGame ref={phaserRef} />
                : <button className='button' onClick={handleSetPlay}>►</button>
        } </div>
    )
}

export default App
