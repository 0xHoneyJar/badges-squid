import {
  BlockHeader,
  DataHandlerContext,
  EvmBatchProcessor,
  EvmBatchProcessorFields,
  Log as _Log,
  Transaction as _Transaction,
} from "@subsquid/evm-processor";
import { assertNotNull } from "@subsquid/util-internal";
import * as badgesAbi from "./abi/badges";
import * as bgtAbi from "./abi/bgt";
import { BGT_ADDRESS, CUB_ADDRESS, THJ_VALIDATOR_ADDRESS } from "./addresses";

export const processor = new EvmBatchProcessor()
  .setGateway("https://v2.archive.subsquid.io/network/berachain-bartio")
  .setRpcEndpoint({
    url: assertNotNull(process.env.RPC_BERA_HTTP, "No RPC endpoint supplied"),
  })
  .setFinalityConfirmation(5)
  .setFields({
    transaction: {
      from: true,
      to: true,
      hash: true,
    },
  })
  .setBlockRange({
    from: 92754, // deployment block of factory
  })
  .addLog({
    address: [CUB_ADDRESS], // Factory contract address
    topic0: [
      badgesAbi.events.TransferBatch.topic,
      badgesAbi.events.TransferSingle.topic,
    ],
  })
  .addLog({
    address: [BGT_ADDRESS],
    topic0: [bgtAbi.events.QueueBoost.topic, bgtAbi.events.ActivateBoost.topic],
    topic2: [formatAddressTopic(THJ_VALIDATOR_ADDRESS)],
  });

function formatAddressTopic(address: string): string {
  return "0x" + address.replace("0x", "").padStart(64, "0").toLowerCase();
}

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
