import { useState, LegacyRef, useRef } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import ButtonLottie from '../public/lotties/button.json'
import { Player, Controls } from '@lottiefiles/react-lottie-player';

export const CustomConnectButton = () => {
    const lottieRef = useRef<Player | undefined>(undefined) as LegacyRef<Player>;
    return <ConnectButton.Custom>
        {({
            openConnectModal,
        }) => {
            return (
                <div className='relative'>
                    <button type="submit" onClick={openConnectModal}>
                        <Player
                            ref={lottieRef}
                            src={ButtonLottie}
                            hover={true}
                            className="h-[44px]"
                            loop={false}
                            keepLastFrame={true}
                        >
                            <Controls visible={false} buttons={['play', 'repeat', 'frame', 'debug']} />
                        </Player>
                    </button>
                </div>
            )
        }}
    </ConnectButton.Custom>
}