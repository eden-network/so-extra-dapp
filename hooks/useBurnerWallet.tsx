import { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { generatePrivateKey, PrivateKeyAccount, privateKeyToAccount } from 'viem/accounts'
import { goerli } from 'viem/chains'
import { useBalance } from 'wagmi'
import { rigil } from './useSuave'

type PrivateKeyEntry = {
    address: `0x${string}`,
    privateKey: `0x${string}`,
}

const useBurnerWallet = () => {
    const [localPrivateKeys, setLocalPrivateKeys] = useLocalStorage<PrivateKeyEntry[]>(
        'soExtra.privateKeys', []
    )
    const [account, setAccount] = useState<PrivateKeyAccount | undefined>(undefined)
    const [privateKey, setPrivateKey] = useState<`0x${string}` | undefined>(undefined)

    const hasExistingBurnerWallet = () => {
        return localPrivateKeys.length > 0
    }

    useEffect(() => {
        if (hasExistingBurnerWallet()) {
            createBurnerWallet()
        }
    }, [localPrivateKeys])

    const createBurnerWallet = () => {
        let privateKey: `0x${string}`;
        let account: PrivateKeyAccount;
        if (hasExistingBurnerWallet()) {
            privateKey = localPrivateKeys[0].privateKey
            account = privateKeyToAccount(privateKey)
            setAccount(account)
            setPrivateKey(privateKey)
        }
        else {
            privateKey = generatePrivateKey()
            account = privateKeyToAccount(privateKey)
            setAccount(account)
            setPrivateKey(privateKey)
            setLocalPrivateKeys([
                ...localPrivateKeys,
                {
                    address: account.address,
                    privateKey: privateKey
                }
            ])
        }
        // return account
    }

    const { data: balance } = useBalance({
        address: account?.address,
        chainId: goerli.id
    })

    const { data: rigilBalance } = useBalance({
        address: account?.address,
        chainId: rigil.id
    })

    return {
        privateKey: privateKey,
        account: account,
        balance: balance,
        rigilBalance: rigilBalance,
        hasExistingBurnerWallet,
        createBurnerWallet
    }
}

export default useBurnerWallet;