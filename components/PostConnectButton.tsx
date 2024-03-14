import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';

export const PostConnectButton = () => {
    return <ConnectButton.Custom>
        {({
            openConnectModal,
        }) => {
            return (
                <div className='relative flex m-auto'>
                    <button type="submit" onClick={openConnectModal}>
                        <Image src="/inactive.svg" alt="So Extra" width="279" height="63" className='relative bottom-0' />
                    </button>
                </div>
            )
        }}
    </ConnectButton.Custom>
}