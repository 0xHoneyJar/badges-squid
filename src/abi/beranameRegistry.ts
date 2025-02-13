import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    ApprovalForAll: event("0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31", "ApprovalForAll(address,address,bool)", {"owner": indexed(p.address), "operator": indexed(p.address), "approved": p.bool}),
    NewOwner: event("0xce0457fe73731f824cc272376169235128c118b49d344817417c6d108d155e82", "NewOwner(bytes32,bytes32,address)", {"node": indexed(p.bytes32), "label": indexed(p.bytes32), "owner": p.address}),
    NewResolver: event("0x335721b01866dc23fbee8b6b2c7b1e14d6f05c28cd35a2c934239f94095602a0", "NewResolver(bytes32,address)", {"node": indexed(p.bytes32), "resolver": p.address}),
    NewTTL: event("0x1d4f9bbfc9cab89d66e1a1562f2233ccbf1308cb4f63de2ead5787adddb8fa68", "NewTTL(bytes32,uint64)", {"node": indexed(p.bytes32), "ttl": p.uint64}),
    Transfer: event("0xd4735d920b0f87494915f556dd9b54c8f309026070caea5c737245152564d266", "Transfer(bytes32,address)", {"node": indexed(p.bytes32), "owner": p.address}),
}

export const functions = {
    isApprovedForAll: viewFun("0xe985e9c5", "isApprovedForAll(address,address)", {"owner_": p.address, "operator_": p.address}, p.bool),
    owner: viewFun("0x02571be3", "owner(bytes32)", {"node_": p.bytes32}, p.address),
    recordExists: viewFun("0xf79fe538", "recordExists(bytes32)", {"node_": p.bytes32}, p.bool),
    resolver: viewFun("0x0178b8bf", "resolver(bytes32)", {"node_": p.bytes32}, p.address),
    setApprovalForAll: fun("0xa22cb465", "setApprovalForAll(address,bool)", {"operator_": p.address, "approved_": p.bool}, ),
    setOwner: fun("0x5b0fc9c3", "setOwner(bytes32,address)", {"node_": p.bytes32, "owner_": p.address}, ),
    setRecord: fun("0xcf408823", "setRecord(bytes32,address,address,uint64)", {"node_": p.bytes32, "owner_": p.address, "resolver_": p.address, "ttl_": p.uint64}, ),
    setResolver: fun("0x1896f70a", "setResolver(bytes32,address)", {"node_": p.bytes32, "resolver_": p.address}, ),
    setSubnodeOwner: fun("0x06ab5923", "setSubnodeOwner(bytes32,bytes32,address)", {"node_": p.bytes32, "label_": p.bytes32, "owner_": p.address}, p.bytes32),
    setSubnodeRecord: fun("0x5ef2c7f0", "setSubnodeRecord(bytes32,bytes32,address,address,uint64)", {"node_": p.bytes32, "label_": p.bytes32, "owner_": p.address, "resolver_": p.address, "ttl_": p.uint64}, ),
    setTTL: fun("0x14ab9038", "setTTL(bytes32,uint64)", {"node_": p.bytes32, "ttl_": p.uint64}, ),
    ttl: viewFun("0x16a25cbd", "ttl(bytes32)", {"node_": p.bytes32}, p.uint64),
}

export class Contract extends ContractBase {

    isApprovedForAll(owner_: IsApprovedForAllParams["owner_"], operator_: IsApprovedForAllParams["operator_"]) {
        return this.eth_call(functions.isApprovedForAll, {owner_, operator_})
    }

    owner(node_: OwnerParams["node_"]) {
        return this.eth_call(functions.owner, {node_})
    }

    recordExists(node_: RecordExistsParams["node_"]) {
        return this.eth_call(functions.recordExists, {node_})
    }

    resolver(node_: ResolverParams["node_"]) {
        return this.eth_call(functions.resolver, {node_})
    }

    ttl(node_: TtlParams["node_"]) {
        return this.eth_call(functions.ttl, {node_})
    }
}

/// Event types
export type ApprovalForAllEventArgs = EParams<typeof events.ApprovalForAll>
export type NewOwnerEventArgs = EParams<typeof events.NewOwner>
export type NewResolverEventArgs = EParams<typeof events.NewResolver>
export type NewTTLEventArgs = EParams<typeof events.NewTTL>
export type TransferEventArgs = EParams<typeof events.Transfer>

/// Function types
export type IsApprovedForAllParams = FunctionArguments<typeof functions.isApprovedForAll>
export type IsApprovedForAllReturn = FunctionReturn<typeof functions.isApprovedForAll>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type RecordExistsParams = FunctionArguments<typeof functions.recordExists>
export type RecordExistsReturn = FunctionReturn<typeof functions.recordExists>

export type ResolverParams = FunctionArguments<typeof functions.resolver>
export type ResolverReturn = FunctionReturn<typeof functions.resolver>

export type SetApprovalForAllParams = FunctionArguments<typeof functions.setApprovalForAll>
export type SetApprovalForAllReturn = FunctionReturn<typeof functions.setApprovalForAll>

export type SetOwnerParams = FunctionArguments<typeof functions.setOwner>
export type SetOwnerReturn = FunctionReturn<typeof functions.setOwner>

export type SetRecordParams = FunctionArguments<typeof functions.setRecord>
export type SetRecordReturn = FunctionReturn<typeof functions.setRecord>

export type SetResolverParams = FunctionArguments<typeof functions.setResolver>
export type SetResolverReturn = FunctionReturn<typeof functions.setResolver>

export type SetSubnodeOwnerParams = FunctionArguments<typeof functions.setSubnodeOwner>
export type SetSubnodeOwnerReturn = FunctionReturn<typeof functions.setSubnodeOwner>

export type SetSubnodeRecordParams = FunctionArguments<typeof functions.setSubnodeRecord>
export type SetSubnodeRecordReturn = FunctionReturn<typeof functions.setSubnodeRecord>

export type SetTTLParams = FunctionArguments<typeof functions.setTTL>
export type SetTTLReturn = FunctionReturn<typeof functions.setTTL>

export type TtlParams = FunctionArguments<typeof functions.ttl>
export type TtlReturn = FunctionReturn<typeof functions.ttl>

