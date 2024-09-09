import { TypeormDatabase } from "@subsquid/typeorm-store";
import * as badgesAbi from "./abi/badges";
import * as bgtAbi from "./abi/bgt";
import { ActivateBoost, BadgeHolder, QueueBoost } from "./model";
import { processor } from "./processor";

processor.run(new TypeormDatabase(), async (ctx) => {
  const entities = {
    badgeHolders: new Map<string, BadgeHolder>(),
    queueBoosts: new Map<string, QueueBoost>(),
    activateBoosts: new Map<string, ActivateBoost>(),
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
    holder = new BadgeHolder({ id: address, holdings: {} });
  }

  const currentHoldings = holder.holdings || {};
  currentHoldings[tokenId] = (
    BigInt(currentHoldings[tokenId] || 0) + amount
  ).toString();

  // Remove token from holdings if balance is 0
  if (currentHoldings[tokenId] === "0") {
    delete currentHoldings[tokenId];
  }

  holder.holdings = currentHoldings;
  entities.badgeHolders.set(address, holder);
}

async function processQueueBoost(
  log: any,
  ctx: any,
  entities: any,
  header: any
) {
  const { sender, validator, amount } = bgtAbi.events.QueueBoost.decode(log);
  const id = `${log.transactionHash}-${log.logIndex}`;

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
  log: any,
  ctx: any,
  entities: any,
  header: any
) {
  const { sender, validator, amount } = bgtAbi.events.ActivateBoost.decode(log);
  const id = `${log.transactionHash}-${log.logIndex}`;

  const activateBoost = new ActivateBoost({
    id,
    user: sender.toLowerCase(),
    validator: validator.toLowerCase(),
    amount: BigInt(amount),
    timestamp: BigInt(Math.floor(header.timestamp / 1000)), // Convert to unix timestamp
  });

  entities.activateBoosts.set(id, activateBoost);
}

async function saveEntities(ctx: any, entities: any) {
  await ctx.store.upsert(Array.from(entities.badgeHolders.values()));
  await ctx.store.upsert(Array.from(entities.queueBoosts.values()));
  await ctx.store.upsert(Array.from(entities.activateBoosts.values()));
}
