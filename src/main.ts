import { TypeormDatabase } from "@subsquid/typeorm-store";
import * as badgesAbi from "./abi/badges";
import { BadgeHolder } from "./model";
import { processor } from "./processor";

processor.run(new TypeormDatabase(), async (ctx) => {
  const entities = {
    badgeHolders: new Map<string, BadgeHolder>(),
  };

  for (const block of ctx.blocks) {
    for (const log of block.logs) {
      await processLog(log, ctx, entities);
    }
  }

  await saveEntities(ctx, entities);
});

async function processLog(log: any, ctx: any, entities: any) {
  if (badgesAbi.events.TransferSingle.is(log)) {
    await processBadgeTransferSingle(log, ctx, entities);
  } else if (badgesAbi.events.TransferBatch.is(log)) {
    await processBadgeTransferBatch(log, ctx, entities);
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

async function saveEntities(ctx: any, entities: any) {
  await ctx.store.upsert(Array.from(entities.badgeHolders.values()));
}
