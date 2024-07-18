import { parseAbiItem } from "viem"

export const executionNodeAdd: `0x${string}` = '0x03493869959c866713c33669ca118e774a30a0e5'
export const suaveContractAddress: `0x${string}` = "0xE7C6324E56343a4FFD1DE56Fe2a0eB7D5A768dbB"
export const suaveDeployBlock: bigint = BigInt(3253347)

export const EventRequestAdded = parseAbiItem('event RequestAdded(uint256 indexed id, string extra, uint256 blockLimit)')
export const EventRequestIncluded = parseAbiItem('event RequestIncluded(uint256 indexed id, uint64 egp, string blockHashLimit)')
export const EventRequestRemoved = parseAbiItem('event RequestIncluded(uint256 indexed id)')