import { fromHex } from "viem"
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
    const { data, isLoading } = useBlock(blockNumber)
    if (blockNumber === undefined) {
        return <></>
    }

    const href = `${goerli.blockExplorers.etherscan.url}/block/${blockNumber.toString()}`
    const blockTimestamp = data !== undefined ? new Date(parseInt(data.timestamp.toString()) * 1000) : undefined
    const extraData = data !== undefined ? fromHex(data.extraData, 'string') : undefined

    return <a className={styles.card} href={href} target="_blank" rel="noopener noreferrer">
        <h2>Block number: {blockNumber.toString()} &rarr;</h2>
        {isLoading ? <>
            <p>Loading...</p>
        </> : <>
            {blockTimestamp && (<p>{blockTimestamp.toString()}</p>)}
            {extraData && (<h2>{extraData}</h2>)}
        </>}
    </a>
}

export default BlockDetails