import { useState, useEffect } from 'react';

const LottiePlayer = ({
    src
}: {
    src: any
}) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Set isClient to true when the component mounts
    }, []);

    // If not running in a browser environment, return null
    if (!isClient) {
        return null;
    }

    // If running in a browser environment, render the Player component
    const { Player } = require('@lottiefiles/react-lottie-player');

    return (
        <Player
            src={src}
            hover={true}
            className=""
            loop={false}
            keepLastFrame={true}
        />
    );
};

export default LottiePlayer;
