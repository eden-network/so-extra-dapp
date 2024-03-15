'use client'
import { Player } from '@lottiefiles/react-lottie-player';

const LottiePlayer = ({
    src
}: {
    src: any
}) => {

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
