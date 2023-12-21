import { ConnectButton } from '@rainbow-me/rainbowkit';

export const CustomConnectButton = ({
    isSmall = false
}: {
    isSmall?: boolean
}) => {
    return <ConnectButton.Custom>
        {({
            account,
            openConnectModal,
        }) => {
            const connected = account !== undefined
            return isSmall ? <button
                className="w-[263px] h-[44px] rounded-full bg-[url('/small-connect.png')] disabled:bg-[url('/small-connect-disabled.png')] hover:bg-[url('/small-connect-hover.png')]"
                onClick={openConnectModal}
                // disabled={(useBurner ? burnerAccount !== undefined : walletAddress !== undefined)}
                disabled={connected}
                type="submit"
            >
                <p className="hidden">Connect Wallet</p>
            </button> : <button
                className="w-[274px] h-[64px] rounded-full bg-[url('/connect-button.png')] disabled:bg-[url('/connect-button-disabled.png')] hover:bg-[url('/connect-button-hover.png')]"
                onClick={openConnectModal}
                // disabled={(useBurner ? burnerAccount !== undefined : walletAddress !== undefined)}
                disabled={connected}
                type="submit"
            >
                <p className="hidden">Connect Wallet</p>
            </button>
        }}
    </ConnectButton.Custom>
}