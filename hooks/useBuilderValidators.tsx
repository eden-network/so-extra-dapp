import { useEffect, useState } from "react"

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
        fetch(url)
            .then((r: Response) => r.json())
            .then((data: ValidatorsResponse[]) => {
                console.log(data)
                setIsLoading(false)
                setData(data)
            })
            .catch((e: Error) => {
                console.log(e)
                setIsLoading(false)
            })
    }, [])

    useEffect(() => {
        console.log(data)
    }, [data])

    return {
        data: data,
        isLoading
    }

}

export default useBuilderValidators