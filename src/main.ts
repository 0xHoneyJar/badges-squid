import { Log } from "@subsquid/evm-processor";
import { TypeormDatabase } from "@subsquid/typeorm-store";
import * as badgesAbi from "./abi/badges";
import * as beranameAbi from "./abi/beranameRegistry";
import * as bgtAbi from "./abi/bgt";
import {
  ActivateBoost,
  BadgeAmount,
  BadgeHolder,
  Beraname,
  QueueBoost,
} from "./model";
import { processor } from "./processor";

processor.run(new TypeormDatabase(), async (ctx) => {
  const entities = {
    badgeHolders: new Map<string, BadgeHolder>(),
    badgeAmounts: new Map<string, BadgeAmount>(),
    queueBoosts: new Map<string, QueueBoost>(),
    activateBoosts: new Map<string, ActivateBoost>(),
    beranames: new Map<string, Beraname>(),
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
  } else if (beranameAbi.events.Mint.is(log)) {
    await processBeranameMint(log, ctx, entities);
  } else if (beranameAbi.events.UpdateWhois.is(log)) {
    await processBeranameUpdateWhois(log, ctx, entities);
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

async function saveEntities(ctx: any, entities: any) {
  await ctx.store.upsert(Array.from(entities.badgeHolders.values()));
  await ctx.store.upsert(Array.from(entities.badgeAmounts.values()));
  await ctx.store.upsert(Array.from(entities.queueBoosts.values()));
  await ctx.store.upsert(Array.from(entities.activateBoosts.values()));
  await ctx.store.upsert(Array.from(entities.beranames.values()));
}
