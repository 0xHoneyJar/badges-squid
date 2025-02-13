import {
  Log as _Log,
  Transaction as _Transaction,
  BlockHeader,
  DataHandlerContext,
  EvmBatchProcessor,
  EvmBatchProcessorFields,
} from "@subsquid/evm-processor";
import { assertNotNull } from "@subsquid/util-internal";
import * as badgesAbi from "./abi/badges";
import * as beranameAbi from "./abi/beranameRegistry";
import * as resolverAbi from "./abi/beranameResolver";
import { BERANAME_RESOLVER_ADDRESS, CUB_ADDRESS } from "./addresses";

export const processor = new EvmBatchProcessor()
  // .setGateway("https://v2.archive.subsquid.io/network/berachain-bartio")
  .setRpcEndpoint({
    url: assertNotNull(
      process.env.RPC_BERACHAIN_HTTP,
      "No RPC endpoint supplied"
    ),
  })
  .setFinalityConfirmation(5)
  .setBlockRange({
    from: 80000, // deployment block of factory
  })
  .addLog({
    address: [CUB_ADDRESS], // Factory contract address
    topic0: [
      badgesAbi.events.TransferBatch.topic,
      badgesAbi.events.TransferSingle.topic,
    ],
  })
  // .addLog({
  //   address: [BGT_ADDRESS],
  //   topic0: [
  //     bgtAbi.events.QueueBoost.topic,
  //     bgtAbi.events.ActivateBoost.topic,
  //     bgtAbi.events.CancelBoost.topic,
  //     bgtAbi.events.DropBoost.topic,
  //   ],
  //   topic2: [formatAddressTopic(THJ_VALIDATOR_ADDRESS)],
  //   transaction: true,
  // })
  // .addLog({
  //   address: [DISTRIBUTOR_ADDRESS],
  //   topic0: [distributorAbi.events.Distributed.topic],
  //   topic1: [formatAddressTopic(THJ_VALIDATOR_ADDRESS)],
  //   transactionLogs: true,
  //   transaction: true,
  // })
  .addLog({
    address: [BERANAME_RESOLVER_ADDRESS],
    topic0: [
      beranameAbi.events.NewOwner.topic,
      resolverAbi.events.NameChanged.topic,
    ],
  });

export function formatAddressTopic(address: string): string {
  return "0x" + address.replace("0x", "").padStart(64, "0").toLowerCase();
}

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
