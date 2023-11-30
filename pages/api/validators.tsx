import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const url = "https://boost-relay-goerli.flashbots.net/relay/v1/builder/validators"

    // Retrieve the block number from the query parameters
    // const { blockNumber } = req.query;
    console.log(req.method);

    try {
        const response = await fetch(url)
        const data = await response.json()
        console.log(data)
        res.json(data);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}