import { Address, parseAbiItem } from "viem"

type SupportedSuaveChainIds = 33626250 | 16813125

export const executionNodes: Record<SupportedSuaveChainIds, Address> = {
    [33626250]: '0xf579de142d98f8379c54105ac944fe133b7a17fe',
    [16813125]: '0x03493869959c866713c33669ca118e774a30a0e5'
}

export const suaveContractAddress: `0x${string}` = "0xe0f06e942c06b558B8d0C58cA5fEf1A114516c02"
export const suaveDeployBlock: bigint = BigInt(969472)

export const EventRequestAdded = parseAbiItem('event RequestAdded(uint256 indexed id, string extra, uint256 blockLimit)')
export const EventRequestIncluded = parseAbiItem('event RequestIncluded(uint256 indexed id, uint64 egp, string blockHashLimit)')
export const EventRequestRemoved = parseAbiItem('event RequestIncluded(uint256 indexed id)')