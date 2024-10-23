import { Log } from "@subsquid/evm-processor";
import { TypeormDatabase } from "@subsquid/typeorm-store";
import * as badgesAbi from "./abi/badges";
import * as beranameAbi from "./abi/beranameRegistry";
import * as bgtAbi from "./abi/bgt";
import * as distributorAbi from "./abi/distributor";
import * as erc20Abi from "./abi/erc20";
import {
  ActivateBoost,
  BadgeAmount,
  BadgeHolder,
  Beraname,
  CancelBoost,
  Distribution,
  DistributionReward,
  DropBoost,
  QueueBoost,
} from "./model";
import { processor } from "./processor";

const COINBASE_ADDRESS =
  "0x40495A781095932e2FC8dccA69F5e358711Fdd41".toLowerCase();
const DISTRIBUTOR_ADDRESS =
  "0x2C1F148Ee973a4cdA4aBEce2241DF3D3337b7319".toLowerCase();

processor.run(new TypeormDatabase(), async (ctx) => {
  const entities = {
    badgeHolders: new Map<string, BadgeHolder>(),
    badgeAmounts: new Map<string, BadgeAmount>(),
    queueBoosts: new Map<string, QueueBoost>(),
    activateBoosts: new Map<string, ActivateBoost>(),
    cancelBoosts: new Map<string, CancelBoost>(),
    dropBoosts: new Map<string, DropBoost>(),
    beranames: new Map<string, Beraname>(),
    distributions: new Map<string, Distribution>(),
    distributionRewards: new Map<string, DistributionReward>(),
  };

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      await processLog(log, ctx, entities, block.header);
    }
  }

  await saveEntities(ctx, entities);
});

async function processLog(log: any, ctx: any, entities: any, header: any) {
  if (badgesAbi.events.TransferSingle.is(log)) {
    await processBadgeTransferSingle(log, ctx, entities);
  } else if (badgesAbi.events.TransferBatch.is(log)) {
    await processBadgeTransferBatch(log, ctx, entities);
  } else if (bgtAbi.events.QueueBoost.is(log)) {
    await processQueueBoost(log, ctx, entities, header);
  } else if (bgtAbi.events.ActivateBoost.is(log)) {
    await processActivateBoost(log, ctx, entities, header);
  } else if (bgtAbi.events.CancelBoost.is(log)) {
    await processCancelBoost(log, ctx, entities, header);
  } else if (bgtAbi.events.DropBoost.is(log)) {
    await processDropBoost(log, ctx, entities, header);
  } else if (beranameAbi.events.Mint.is(log)) {
    await processBeranameMint(log, ctx, entities);
  } else if (beranameAbi.events.UpdateWhois.is(log)) {
    await processBeranameUpdateWhois(log, ctx, entities);
  } else if (
    log.address === DISTRIBUTOR_ADDRESS &&
    distributorAbi.events.Distributed.is(log)
  ) {
    await processDistribution(log, ctx, entities, header);
  }
}

async function processBadgeTransferSingle(log: any, ctx: any, entities: any) {
  const { from, to, id, amount } = badgesAbi.events.TransferSingle.decode(log);
  const isAMint = from === "0x0000000000000000000000000000000000000000";
  const tokenId = id.toString();

  // Update recipient's badge holdings
  await updateBadgeHoldings(
    to.toLowerCase(),
    tokenId,
    BigInt(amount),
    entities,
    ctx
  );

  // Update sender's badge holdings if not a mint
  if (!isAMint) {
    await updateBadgeHoldings(
      from.toLowerCase(),
      tokenId,
      -BigInt(amount),
      entities,
      ctx
    );
  }
}

async function processBadgeTransferBatch(log: any, ctx: any, entities: any) {
  const { from, to, ids, amounts } = badgesAbi.events.TransferBatch.decode(log);
  const isAMint = from === "0x0000000000000000000000000000000000000000";

  // Update recipient's badge holdings
  for (let i = 0; i < ids.length; i++) {
    await updateBadgeHoldings(
      to.toLowerCase(),
      ids[i].toString(),
      BigInt(amounts[i]),
      entities,
      ctx
    );
  }

  // Update sender's badge holdings if not a mint
  if (!isAMint) {
    for (let i = 0; i < ids.length; i++) {
      await updateBadgeHoldings(
        from.toLowerCase(),
        ids[i].toString(),
        -BigInt(amounts[i]),
        entities,
        ctx
      );
    }
  }
}

async function updateBadgeHoldings(
  address: string,
  tokenId: string,
  amount: bigint,
  entities: any,
  ctx: any
) {
  let holder =
    entities.badgeHolders.get(address) ||
    (await ctx.store.get(BadgeHolder, address));

  if (!holder) {
    holder = new BadgeHolder({
      id: address,
      holdings: {},
      totalAmount: BigInt(0),
    });
  }

  const currentHoldings = holder.holdings || {};
  const oldAmount = BigInt(currentHoldings[tokenId] || 0);
  const newAmount = oldAmount + amount;

  if (newAmount === BigInt(0)) {
    delete currentHoldings[tokenId];
  } else {
    currentHoldings[tokenId] = newAmount.toString();
  }

  // Update totalAmount
  holder.totalAmount = (holder.totalAmount || BigInt(0)) + amount;

  holder.holdings = currentHoldings;
  entities.badgeHolders.set(address, holder);

  // Create or update BadgeAmount entity
  const badgeAmountId = `${address}-${tokenId}`;
  let badgeAmount = entities.badgeAmounts.get(badgeAmountId);
  if (!badgeAmount) {
    badgeAmount = new BadgeAmount({
      id: badgeAmountId,
      badgeId: tokenId,
      amount: BigInt(0),
      holder: holder,
    });
  }
  badgeAmount.amount = newAmount;
  entities.badgeAmounts.set(badgeAmountId, badgeAmount);
}

async function processQueueBoost(
  log: Log,
  ctx: any,
  entities: any,
  header: any
) {
  const { sender, validator, amount } = bgtAbi.events.QueueBoost.decode(log);
  const id = `${log.transaction?.hash}-${log.logIndex}`;

  const queueBoost = new QueueBoost({
    id,
    user: sender.toLowerCase(),
    validator: validator.toLowerCase(),
    amount: BigInt(amount),
    timestamp: BigInt(Math.floor(header.timestamp / 1000)), // Convert to unix timestamp
  });

  entities.queueBoosts.set(id, queueBoost);
}

async function processActivateBoost(
  log: Log,
  ctx: any,
  entities: any,
  header: any
) {
  const { sender, validator, amount } = bgtAbi.events.ActivateBoost.decode(log);
  const id = `${log.transaction?.hash}-${log.logIndex}`;

  const activateBoost = new ActivateBoost({
    id,
    user: sender.toLowerCase(),
    validator: validator.toLowerCase(),
    amount: BigInt(amount),
    timestamp: BigInt(Math.floor(header.timestamp / 1000)), // Convert to unix timestamp
  });

  entities.activateBoosts.set(id, activateBoost);
}

async function processBeranameMint(log: Log, ctx: any, entities: any) {
  const { id, chars, to } = beranameAbi.events.Mint.decode(log);
  const beranameId = id.toString();
  const name = chars.join("");
  const ownerAddress = to.toLowerCase();

  // Get or create the BadgeHolder
  let holder =
    entities.badgeHolders.get(ownerAddress) ||
    (await ctx.store.get(BadgeHolder, ownerAddress));
  if (!holder) {
    holder = new BadgeHolder({
      id: ownerAddress,
      holdings: {},
      totalAmount: BigInt(0),
    });
    entities.badgeHolders.set(ownerAddress, holder);
  }

  let beraname = entities.beranames.get(beranameId);
  if (!beraname) {
    beraname = new Beraname({
      id: beranameId,
      name: name,
      owner: holder, // Now we're assigning the BadgeHolder object
      whois: ownerAddress,
      expiry: BigInt(0), // We'll need to update this with the actual expiry
      metadataURI: "",
    });
    entities.beranames.set(beranameId, beraname);
  }
}

async function processBeranameUpdateWhois(log: Log, ctx: any, entities: any) {
  const { id, aka } = beranameAbi.events.UpdateWhois.decode(log);
  const beranameId = id.toString();
  const newWhois = aka.toLowerCase();

  let beraname =
    entities.beranames.get(beranameId) ||
    (await ctx.store.get(Beraname, beranameId));
  if (beraname) {
    beraname.whois = newWhois;
    entities.beranames.set(beranameId, beraname);
  }
}

async function processCancelBoost(
  log: Log,
  ctx: any,
  entities: any,
  header: any
) {
  const { sender, validator, amount } = bgtAbi.events.CancelBoost.decode(log);
  const id = `${log.transaction?.hash}-${log.logIndex}`;

  const cancelBoost = new CancelBoost({
    id,
    user: sender.toLowerCase(),
    validator: validator.toLowerCase(),
    amount: BigInt(amount),
    timestamp: BigInt(Math.floor(header.timestamp / 1000)), // Convert to unix timestamp
  });

  entities.cancelBoosts.set(id, cancelBoost);
}

async function processDropBoost(
  log: Log,
  ctx: any,
  entities: any,
  header: any
) {
  const { sender, validator, amount } = bgtAbi.events.DropBoost.decode(log);
  const id = `${log.transaction?.hash}-${log.logIndex}`;

  const dropBoost = new DropBoost({
    id,
    user: sender.toLowerCase(),
    validator: validator.toLowerCase(),
    amount: BigInt(amount),
    timestamp: BigInt(Math.floor(header.timestamp / 1000)), // Convert to unix timestamp
  });

  entities.dropBoosts.set(id, dropBoost);
}

async function processDistribution(
  log: Log,
  ctx: any,
  entities: any,
  header: any
) {
  const { valCoinbase, blockNumber, receiver, amount } =
    distributorAbi.events.Distributed.decode(log);
  const id = `${log.transaction?.hash}-${log.logIndex}`;

  // Create Distribution entity
  const distribution = new Distribution({
    id,
    valCoinbase: valCoinbase.toLowerCase(),
    blockNumber: BigInt(blockNumber),
    receiver: receiver.toLowerCase(),
    amount: BigInt(amount),
    timestamp: BigInt(Math.floor(header.timestamp / 1000)),
  });

  // Find all ERC20 Transfer events in the same transaction
  if (log.transaction) {
    const transferLogs = log.transaction.logs.filter((txLog) =>
      erc20Abi.events.Transfer.is(txLog)
    );

    console.log(transferLogs);

    for (const transferLog of transferLogs) {
      const { from, to, value } = erc20Abi.events.Transfer.decode(transferLog);

      // Only process transfers to the coinbase address
      if (to.toLowerCase() === COINBASE_ADDRESS) {
        const rewardId = `${id}-${transferLog.logIndex}`;
        const token = transferLog.address.toLowerCase();

        const distributionReward = new DistributionReward({
          id: rewardId,
          distribution,
          token,
          amount: BigInt(value),
        });

        entities.distributionRewards.set(rewardId, distributionReward);
      }
    }
  }

  entities.distributions.set(id, distribution);
}

async function saveEntities(ctx: any, entities: any) {
  await ctx.store.upsert(Array.from(entities.badgeHolders.values()));
  await ctx.store.upsert(Array.from(entities.badgeAmounts.values()));
  await ctx.store.upsert(Array.from(entities.queueBoosts.values()));
  await ctx.store.upsert(Array.from(entities.activateBoosts.values()));
  await ctx.store.upsert(Array.from(entities.cancelBoosts.values()));
  await ctx.store.upsert(Array.from(entities.dropBoosts.values()));
  await ctx.store.upsert(Array.from(entities.beranames.values()));
  await ctx.store.upsert(Array.from(entities.distributions.values()));
  await ctx.store.upsert(Array.from(entities.distributionRewards.values()));
}
