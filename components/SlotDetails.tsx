import styles from '../styles/Home.module.css';
import { holesky } from "@flashbots/suave-viem/chains";
import { ValidatorsResponse } from "../hooks/useBuilderValidators";

const SlotDetails = (
    {
        data
    }: {
        data: ValidatorsResponse
    }
) => {
    // @ts-expect-error
    const href = `${holesky.blockExplorers.default.url}`

    return <a className={styles.card} href={href} target="_blank" rel="noopener noreferrer">
        <h2>Slot number: {data.slot} &rarr;</h2>
        <>
            <p>Fee recipient: {data.entry.message.fee_recipient}</p>
            <p>Timestamp: {data.entry.message.timestamp}</p>
        </>
    </a>
}

export default SlotDetails