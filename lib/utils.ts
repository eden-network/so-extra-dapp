import { bytesToHex, encodeAbiParameters } from '@flashbots/suave-viem'

export interface IBundle {
	txs: Array<string>,
	revertingHashes: Array<string>,
}

export function txToBundleBytes(signedTx: string): string {
	return bundleToBytes(txToBundle(signedTx))
}


export function txToBundle(signedTx: string): IBundle {
	return {
		txs: [signedTx],
		revertingHashes: [],
	}
}

export function bundleToBytes(bundle: IBundle): string {
	const bundleBytes = Buffer.from(JSON.stringify(bundle), 'utf8')
    const confidentialDataBytes = encodeAbiParameters([{type: 'bytes'}], [bytesToHex(bundleBytes)])
	return confidentialDataBytes
}
