import { useBlockNumber } from "wagmi"
import BlockDetails from "./BlockDetails"
import styles from '../styles/Home.module.css';
import BlockBid from "./BlockBid";

const BlockNumber = () => {
    const { data } = useBlockNumber({
        watch: true
    })

    const pastBlocks = data !== undefined ? Array.from({ length: 12 }, (_, index) => data - BigInt(index)) : []
    const upcomingBlocks = data !== undefined ? Array.from({ length: 12 }, (_, index) => data + BigInt(index) + BigInt(1)) : []

    return <>
        <p className={styles.description}>
            Block number: {' '}
            <code className={styles.code}>{data?.toString()}</code>
        </p>
        <h2>Bid on a Block</h2>
        <BlockBid />
        <h2>Upcoming Blocks</h2>
        <div className={styles.grid}>
            {upcomingBlocks.map(n => <BlockDetails key={n} blockNumber={n} />)}
        </div>
        <h2>Recent Blocks</h2>
        <div className={styles.grid}>
            {pastBlocks.map(n => <BlockDetails key={n} blockNumber={n} />)}
        </div>
    </>
}

export default BlockNumber