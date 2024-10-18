import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "approved": indexed(p.address), "tokenId": indexed(p.uint256)}),
    ApprovalForAll: event("0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31", "ApprovalForAll(address,address,bool)", {"owner": indexed(p.address), "operator": indexed(p.address), "approved": p.bool}),
    Mint: event("0xc368b9d544dedfe16e4ac071dcfbafe213adfe63bbc35e0fd438a2e815e98a44", "Mint(uint256,string[],address)", {"id": indexed(p.uint256), "chars": p.array(p.string), "to": indexed(p.address)}),
    OwnershipTransferStarted: event("0x38d16b8cac22d99fc7c124b9cd0de2d3fa1faef420bfe791d8c362d765e22700", "OwnershipTransferStarted(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    Paused: event("0x62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258", "Paused(address)", {"account": p.address}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "tokenId": indexed(p.uint256)}),
    Unpaused: event("0x5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa", "Unpaused(address)", {"account": p.address}),
    UpdateMetadataURI: event("0x33c1916d3d29d9f70e7bf4aa4b1dfa0de3098565002f9222104eb9334d4630f0", "UpdateMetadataURI(uint256,string)", {"id": indexed(p.uint256), "metadataURI": p.string}),
    UpdateWhois: event("0xbe77a8b115a254f1e1b86f792116c500e0e5114ac88c1f43bd1c4deb427328cf", "UpdateWhois(uint256,address)", {"id": indexed(p.uint256), "aka": p.address}),
}

export const functions = {
    acceptOwnership: fun("0x79ba5097", "acceptOwnership()", {}, ),
    addressesProvider: viewFun("0xc72c4d10", "addressesProvider()", {}, p.address),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"to": p.address, "tokenId": p.uint256}, ),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"owner": p.address}, p.uint256),
    chars: viewFun("0xea372097", "chars(uint256)", {"id": p.uint256}, p.array(p.string)),
    fundsManager: viewFun("0x0d116652", "fundsManager()", {}, p.address),
    getApproved: viewFun("0x081812fc", "getApproved(uint256)", {"tokenId": p.uint256}, p.address),
    isApprovedForAll: viewFun("0xe985e9c5", "isApprovedForAll(address,address)", {"owner": p.address, "operator": p.address}, p.bool),
    mintNative: fun("0x3d30c7f6", "mintNative(string[],uint256,address,string,address)", {"_chars": p.array(p.string), "duration": p.uint256, "whois": p.address, "metadataURI": p.string, "to": p.address}, p.uint256),
    mintToAuctionHouse: fun("0x7b850843", "mintToAuctionHouse(string[][])", {"singleEmojis": p.array(p.array(p.string))}, ),
    minted: viewFun("0x8ccc5f80", "minted(bytes32)", {"_0": p.bytes32}, p.bool),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    names: viewFun("0x4622ab03", "names(uint256)", {"_0": p.uint256}, {"name": p.bytes32, "expiry": p.uint256, "whois": p.address, "metadataURI": p.string}),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    ownerOf: viewFun("0x6352211e", "ownerOf(uint256)", {"tokenId": p.uint256}, p.address),
    paused: viewFun("0x5c975abb", "paused()", {}, p.bool),
    pendingOwner: viewFun("0xe30c3978", "pendingOwner()", {}, p.address),
    priceOracle: viewFun("0x2630c12f", "priceOracle()", {}, p.address),
    renewNative: fun("0xe7962bb3", "renewNative(string[],uint256)", {"_chars": p.array(p.string), "duration": p.uint256}, ),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    reverseLookup: viewFun("0x09f81a6f", "reverseLookup(address)", {"_whois": p.address}, p.array(p.array(p.string))),
    'safeTransferFrom(address,address,uint256)': fun("0x42842e0e", "safeTransferFrom(address,address,uint256)", {"from": p.address, "to": p.address, "tokenId": p.uint256}, ),
    'safeTransferFrom(address,address,uint256,bytes)': fun("0xb88d4fde", "safeTransferFrom(address,address,uint256,bytes)", {"from": p.address, "to": p.address, "tokenId": p.uint256, "data": p.bytes}, ),
    setApprovalForAll: fun("0xa22cb465", "setApprovalForAll(address,bool)", {"operator": p.address, "approved": p.bool}, ),
    setWhitelisted: fun("0xf3c4b704", "setWhitelisted(address[],bool)", {"accounts": p.array(p.address), "status": p.bool}, ),
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceId": p.bytes4}, p.bool),
    symbol: viewFun("0x95d89b41", "symbol()", {}, p.string),
    togglePause: fun("0xc4ae3168", "togglePause()", {}, ),
    toggleWhitelist: fun("0x7e15144b", "toggleWhitelist()", {}, ),
    tokenByIndex: viewFun("0x4f6ccce7", "tokenByIndex(uint256)", {"index": p.uint256}, p.uint256),
    tokenOfOwnerByIndex: viewFun("0x2f745c59", "tokenOfOwnerByIndex(address,uint256)", {"owner": p.address, "index": p.uint256}, p.uint256),
    tokenURI: viewFun("0xc87b56dd", "tokenURI(uint256)", {"id": p.uint256}, p.string),
    totalSupply: viewFun("0x18160ddd", "totalSupply()", {}, p.uint256),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"from": p.address, "to": p.address, "tokenId": p.uint256}, ),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    updateMetadataURI: fun("0x8fe86b3f", "updateMetadataURI(uint256,string)", {"id": p.uint256, "metadataURI_": p.string}, ),
    updateWhois: fun("0xbfb14ca7", "updateWhois(uint256,address)", {"id": p.uint256, "_aka": p.address}, ),
    whitelistEnabled: viewFun("0x51fb012d", "whitelistEnabled()", {}, p.bool),
}

export class Contract extends ContractBase {

    addressesProvider() {
        return this.eth_call(functions.addressesProvider, {})
    }

    balanceOf(owner: BalanceOfParams["owner"]) {
        return this.eth_call(functions.balanceOf, {owner})
    }

    chars(id: CharsParams["id"]) {
        return this.eth_call(functions.chars, {id})
    }

    fundsManager() {
        return this.eth_call(functions.fundsManager, {})
    }

    getApproved(tokenId: GetApprovedParams["tokenId"]) {
        return this.eth_call(functions.getApproved, {tokenId})
    }

    isApprovedForAll(owner: IsApprovedForAllParams["owner"], operator: IsApprovedForAllParams["operator"]) {
        return this.eth_call(functions.isApprovedForAll, {owner, operator})
    }

    minted(_0: MintedParams["_0"]) {
        return this.eth_call(functions.minted, {_0})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    names(_0: NamesParams["_0"]) {
        return this.eth_call(functions.names, {_0})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    ownerOf(tokenId: OwnerOfParams["tokenId"]) {
        return this.eth_call(functions.ownerOf, {tokenId})
    }

    paused() {
        return this.eth_call(functions.paused, {})
    }

    pendingOwner() {
        return this.eth_call(functions.pendingOwner, {})
    }

    priceOracle() {
        return this.eth_call(functions.priceOracle, {})
    }

    reverseLookup(_whois: ReverseLookupParams["_whois"]) {
        return this.eth_call(functions.reverseLookup, {_whois})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }

    symbol() {
        return this.eth_call(functions.symbol, {})
    }

    tokenByIndex(index: TokenByIndexParams["index"]) {
        return this.eth_call(functions.tokenByIndex, {index})
    }

    tokenOfOwnerByIndex(owner: TokenOfOwnerByIndexParams["owner"], index: TokenOfOwnerByIndexParams["index"]) {
        return this.eth_call(functions.tokenOfOwnerByIndex, {owner, index})
    }

    tokenURI(id: TokenURIParams["id"]) {
        return this.eth_call(functions.tokenURI, {id})
    }

    totalSupply() {
        return this.eth_call(functions.totalSupply, {})
    }

    whitelistEnabled() {
        return this.eth_call(functions.whitelistEnabled, {})
    }
}

/// Event types
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type ApprovalForAllEventArgs = EParams<typeof events.ApprovalForAll>
export type MintEventArgs = EParams<typeof events.Mint>
export type OwnershipTransferStartedEventArgs = EParams<typeof events.OwnershipTransferStarted>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type PausedEventArgs = EParams<typeof events.Paused>
export type TransferEventArgs = EParams<typeof events.Transfer>
export type UnpausedEventArgs = EParams<typeof events.Unpaused>
export type UpdateMetadataURIEventArgs = EParams<typeof events.UpdateMetadataURI>
export type UpdateWhoisEventArgs = EParams<typeof events.UpdateWhois>

/// Function types
export type AcceptOwnershipParams = FunctionArguments<typeof functions.acceptOwnership>
export type AcceptOwnershipReturn = FunctionReturn<typeof functions.acceptOwnership>

export type AddressesProviderParams = FunctionArguments<typeof functions.addressesProvider>
export type AddressesProviderReturn = FunctionReturn<typeof functions.addressesProvider>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type CharsParams = FunctionArguments<typeof functions.chars>
export type CharsReturn = FunctionReturn<typeof functions.chars>

export type FundsManagerParams = FunctionArguments<typeof functions.fundsManager>
export type FundsManagerReturn = FunctionReturn<typeof functions.fundsManager>

export type GetApprovedParams = FunctionArguments<typeof functions.getApproved>
export type GetApprovedReturn = FunctionReturn<typeof functions.getApproved>

export type IsApprovedForAllParams = FunctionArguments<typeof functions.isApprovedForAll>
export type IsApprovedForAllReturn = FunctionReturn<typeof functions.isApprovedForAll>

export type MintNativeParams = FunctionArguments<typeof functions.mintNative>
export type MintNativeReturn = FunctionReturn<typeof functions.mintNative>

export type MintToAuctionHouseParams = FunctionArguments<typeof functions.mintToAuctionHouse>
export type MintToAuctionHouseReturn = FunctionReturn<typeof functions.mintToAuctionHouse>

export type MintedParams = FunctionArguments<typeof functions.minted>
export type MintedReturn = FunctionReturn<typeof functions.minted>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type NamesParams = FunctionArguments<typeof functions.names>
export type NamesReturn = FunctionReturn<typeof functions.names>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type OwnerOfParams = FunctionArguments<typeof functions.ownerOf>
export type OwnerOfReturn = FunctionReturn<typeof functions.ownerOf>

export type PausedParams = FunctionArguments<typeof functions.paused>
export type PausedReturn = FunctionReturn<typeof functions.paused>

export type PendingOwnerParams = FunctionArguments<typeof functions.pendingOwner>
export type PendingOwnerReturn = FunctionReturn<typeof functions.pendingOwner>

export type PriceOracleParams = FunctionArguments<typeof functions.priceOracle>
export type PriceOracleReturn = FunctionReturn<typeof functions.priceOracle>

export type RenewNativeParams = FunctionArguments<typeof functions.renewNative>
export type RenewNativeReturn = FunctionReturn<typeof functions.renewNative>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type ReverseLookupParams = FunctionArguments<typeof functions.reverseLookup>
export type ReverseLookupReturn = FunctionReturn<typeof functions.reverseLookup>

export type SafeTransferFromParams_0 = FunctionArguments<typeof functions['safeTransferFrom(address,address,uint256)']>
export type SafeTransferFromReturn_0 = FunctionReturn<typeof functions['safeTransferFrom(address,address,uint256)']>

export type SafeTransferFromParams_1 = FunctionArguments<typeof functions['safeTransferFrom(address,address,uint256,bytes)']>
export type SafeTransferFromReturn_1 = FunctionReturn<typeof functions['safeTransferFrom(address,address,uint256,bytes)']>

export type SetApprovalForAllParams = FunctionArguments<typeof functions.setApprovalForAll>
export type SetApprovalForAllReturn = FunctionReturn<typeof functions.setApprovalForAll>

export type SetWhitelistedParams = FunctionArguments<typeof functions.setWhitelisted>
export type SetWhitelistedReturn = FunctionReturn<typeof functions.setWhitelisted>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type SymbolParams = FunctionArguments<typeof functions.symbol>
export type SymbolReturn = FunctionReturn<typeof functions.symbol>

export type TogglePauseParams = FunctionArguments<typeof functions.togglePause>
export type TogglePauseReturn = FunctionReturn<typeof functions.togglePause>

export type ToggleWhitelistParams = FunctionArguments<typeof functions.toggleWhitelist>
export type ToggleWhitelistReturn = FunctionReturn<typeof functions.toggleWhitelist>

export type TokenByIndexParams = FunctionArguments<typeof functions.tokenByIndex>
export type TokenByIndexReturn = FunctionReturn<typeof functions.tokenByIndex>

export type TokenOfOwnerByIndexParams = FunctionArguments<typeof functions.tokenOfOwnerByIndex>
export type TokenOfOwnerByIndexReturn = FunctionReturn<typeof functions.tokenOfOwnerByIndex>

export type TokenURIParams = FunctionArguments<typeof functions.tokenURI>
export type TokenURIReturn = FunctionReturn<typeof functions.tokenURI>

export type TotalSupplyParams = FunctionArguments<typeof functions.totalSupply>
export type TotalSupplyReturn = FunctionReturn<typeof functions.totalSupply>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type UpdateMetadataURIParams = FunctionArguments<typeof functions.updateMetadataURI>
export type UpdateMetadataURIReturn = FunctionReturn<typeof functions.updateMetadataURI>

export type UpdateWhoisParams = FunctionArguments<typeof functions.updateWhois>
export type UpdateWhoisReturn = FunctionReturn<typeof functions.updateWhois>

export type WhitelistEnabledParams = FunctionArguments<typeof functions.whitelistEnabled>
export type WhitelistEnabledReturn = FunctionReturn<typeof functions.whitelistEnabled>

