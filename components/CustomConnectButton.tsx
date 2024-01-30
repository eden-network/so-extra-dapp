import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const CustomConnectButton = ({
    isSmall = false
}: {
    isSmall?: boolean
}) => {
    const [isHovered, setIsHovered] = useState<boolean>(false)
    return <ConnectButton.Custom>
        {({
            account,
            openConnectModal,
        }) => {
            const connected = account !== undefined
            return isSmall ?
                <div className='relative' onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                    <button
                        className="w-[263px] h-[44px] rounded-full bg-[url('/connect-metamask.svg')] disabled:bg-[url('/small-connect-disabled.png')] hover:bg-[url('/connect-metamask-hover.svg')]"
                        onClick={openConnectModal}
                        // disabled={(useBurner ? burnerAccount !== undefined : walletAddress !== undefined)}
                        disabled={connected}
                        type="submit"
                    />
                    <button
                        className={`${isHovered ? "flex" : "hidden"} w-[263px] h-[44px] rounded-full bg-[url('/connect-metamask-hover.svg')] absolute top-0 left-0`}
                        onClick={openConnectModal}
                        // disabled={(useBurner ? burnerAccount !== undefined : walletAddress !== undefined)}
                        disabled={connected}
                        type="submit"
                    />
                </div>
                :
                <div className='relative'>
                    <button
                        className="w-[274px] h-[64px] rounded-full bg-[url('/connect-button.png')] disabled:bg-[url('/connect-button-disabled.png')] hover:bg-[url('/connect-button-hover.png')]"
                        onClick={openConnectModal}
                        // disabled={(useBurner ? burnerAccount !== undefined : walletAddress !== undefined)}
                        disabled={connected}
                        type="submit"
                    />
                    <button
                        className="w-[274px] h-[64px] rounded-full bg-[url('/connect-button.png')] disabled:bg-[url('/connect-button-disabled.png')] hover:bg-[url('/connect-button-hover.png')]"
                        onClick={openConnectModal}
                        // disabled={(useBurner ? burnerAccount !== undefined : walletAddress !== undefined)}
                        disabled={connected}
                        type="submit"
                    />
                </div>

        }}
    </ConnectButton.Custom>
}