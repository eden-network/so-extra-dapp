import { parseAbiItem } from "viem"

export const executionNodeAdd: `0x${string}` = '0x03493869959c866713c33669ca118e774a30a0e5'
export const suaveContractAddress: `0x${string}` = "0x0829fC66B8D714f789e3f333c10d38B6B92D0D70"
export const suaveDeployBlock: bigint = BigInt(2115019)

export const EventRequestAdded = parseAbiItem('event RequestAdded(uint256 indexed id, string extra, uint256 blockLimit)')
export const EventRequestIncluded = parseAbiItem('event RequestIncluded(uint256 indexed id, uint64 egp, string blockHashLimit)')
export const EventRequestRemoved = parseAbiItem('event RequestIncluded(uint256 indexed id)')