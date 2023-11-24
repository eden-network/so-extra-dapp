import { fromHex } from "viem"
import { useChainId } from "wagmi";
import useBlock from "../hooks/useBlock"
import styles from '../styles/Home.module.css';
import { goerli } from "viem/chains";

const BlockDetails = (
    {
        blockNumber
    }: {
        blockNumber: bigint | undefined
    }
) => {
    if (blockNumber === undefined) {
        return <></>
    }

    const { data, isLoading } = useBlock(blockNumber)
    const href = `${goerli.blockExplorers.etherscan.url}/block/${blockNumber.toString()}`

    return <a className={styles.card} href="" target="_blank" rel="noopener noreferrer">
        <h2>Block number: {blockNumber.toString()} &rarr;</h2>
        {isLoading ? <>
            <p>Loading...</p>
        </> : <>
            <p>Block hash: {data?.hash?.toString()}</p>
            <p>Extra data: {data?.extraData.toString()}</p>
            <p>{data?.extraData && fromHex(data.extraData, 'string')}</p>
        </>}
    </a>
}

export default BlockDetails