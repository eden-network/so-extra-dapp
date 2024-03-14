import { useEffect, useState } from "react"
import axios from "axios"

export type ValidatorsResponse = {
    slot: string,
    validator_index: string,
    entry: {
        message: {
            fee_recipient: string,
            gas_limit: string,
            timestamp: string,
            pubkey: string,
            signature: string
        }
    }
}

const useBuilderValidators = () => {
    const url = "/api/validators"
    const [data, setData] = useState<ValidatorsResponse[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        setIsLoading(true)
        axios.get(url)
            .then(response => {
                setIsLoading(false)
                setData(response.data)
            })
            .catch(error => {
                console.error(error)
                setIsLoading(false)
            })
    }, [])

    return {
        data: data,
        isLoading
    }
}

export default useBuilderValidators
