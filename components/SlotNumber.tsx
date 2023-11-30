import styles from '../styles/Home.module.css';
import useBuilderValidators, { ValidatorsResponse } from "../hooks/useBuilderValidators";
import SlotDetails from './SlotDetails';

const SlotNumber = () => {
    const { data } = useBuilderValidators()
    console.log(data)


    // const pastBlocks = data !== undefined ? Array.from({ length: 12 }, (_, index) => data - BigInt(index)) : []
    // const upcomingSlots = data !== undefined ? Array.from({ length: 12 }, (_, index) => data[index].slot) : []

    return <>
        <h2>Upcoming Slots</h2>
        <div className={styles.grid}>
            {data.map(n => <SlotDetails key={n.slot} data={n} />)}
        </div>
    </>
}

export default SlotNumber