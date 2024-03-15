import { ConnectButton } from '@rainbow-me/rainbowkit';
import ButtonLottie from '../public/lotties/accountwallet.json'
import LottiePlayer from './LottiePlayer';

export const CustomConnectButton = () => {
    return <ConnectButton.Custom>
        {({
            openConnectModal,
        }) => {
            return (
                <div className='relative'>
                    <button type="submit" onClick={openConnectModal}>
                        <LottiePlayer src={ButtonLottie} />
                    </button>
                </div>
            )
        }}
    </ConnectButton.Custom>
}