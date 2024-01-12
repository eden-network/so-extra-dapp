import { parseAbiItem } from "viem"

export const executionNodeAdd: `0x${string}` = '0x03493869959c866713c33669ca118e774a30a0e5'
export const suaveContractAddress: `0x${string}` = "0xbA1B456C993B5c18DBCC25aBEA7FcCE081EF57a8"
export const suaveDeployBlock: bigint = BigInt(904301)

export const EventRequestAdded = parseAbiItem('event RequestAdded(uint256 id, string extra, uint256 blockLimit)')
export const EventRequestIncluded = parseAbiItem('event RequestIncluded(uint256 indexed id, uint64 egp, string blockHashLimit)')
export const EventRequestRemoved = parseAbiItem('event RequestIncluded(uint256 indexed id)')