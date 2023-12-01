import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const url = "https://boost-relay-goerli.flashbots.net/relay/v1/builder/validators"

    try {
        const response = await fetch(url)
        const data = await response.json()
        res.json(data);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}