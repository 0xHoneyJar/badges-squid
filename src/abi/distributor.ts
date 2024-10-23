import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Distributed: event("0x96b077538301034fee0c56fc41bbee8e61ddedc1029eeeaff049fd4db8fac18a", "Distributed(address,uint256,address,uint256)", {"valCoinbase": indexed(p.address), "blockNumber": indexed(p.uint256), "receiver": indexed(p.address), "amount": p.uint256}),
}

export const functions = {
    distributeFor: fun("0xc0f672a4", "distributeFor(address,uint256)", {"coinbase": p.address, "blockNumber": p.uint256}, ),
}

export class Contract extends ContractBase {
}

/// Event types
export type DistributedEventArgs = EParams<typeof events.Distributed>

/// Function types
export type DistributeForParams = FunctionArguments<typeof functions.distributeFor>
export type DistributeForReturn = FunctionReturn<typeof functions.distributeFor>

