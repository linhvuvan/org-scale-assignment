import "dotenv/config";
import { count } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { db } from "../3rd-parties/drizzle";
import {
  campaignRecipientsTable,
  campaignsTable,
  recipientsTable,
  usersTable,
} from "../db/schema";

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

async function seed() {
  const [{ value: userCount }] = await db
    .select({ value: count() })
    .from(usersTable);

  if (userCount > 0) {
    console.log("Database already seeded, skipping.");
    process.exit(0);
  }

  console.log("Seeding database...");

  const [user] = await db
    .insert(usersTable)
    .values({
      id: uuidv4(),
      email: "demo@example.com",
      name: "Demo User",
      passwordHash: await bcrypt.hash("12345679", 10),
    })
    .returning();

  const [alice, bob, carol, dave, eve, frank, grace, henry, iris, jack] =
    await db
      .insert(recipientsTable)
      .values([
        {
          id: uuidv4(),
          email: "alice@example.com",
          name: "Alice Johnson",
        },
        {
          id: uuidv4(),
          email: "bob@example.com",
          name: "Bob Smith",
        },
        {
          id: uuidv4(),
          email: "carol@example.com",
          name: "Carol Williams",
        },
        {
          id: uuidv4(),
          email: "dave@example.com",
          name: "Dave Brown",
        },
        {
          id: uuidv4(),
          email: "eve@example.com",
          name: "Eve Davis",
        },
        {
          id: uuidv4(),
          email: "frank@example.com",
          name: "Frank Miller",
        },
        {
          id: uuidv4(),
          email: "grace@example.com",
          name: "Grace Wilson",
        },
        {
          id: uuidv4(),
          email: "henry@example.com",
          name: "Henry Moore",
        },
        {
          id: uuidv4(),
          email: "iris@example.com",
          name: "Iris Taylor",
        },
        {
          id: uuidv4(),
          email: "jack@example.com",
          name: "Jack Anderson",
        },
      ])
      .returning();

  // Campaign 1: draft, no recipients
  await db.insert(campaignsTable).values({
    id: uuidv4(),
    name: "Welcome Series",
    subject: "Welcome to our newsletter!",
    body: "Hi, welcome aboard!",
    status: "draft",
    createdBy: user.id,
  });

  // Campaign 2: draft, 5 recipients
  const [draft2] = await db
    .insert(campaignsTable)
    .values({
      id: uuidv4(),
      name: "Summer Promo",
      subject: "Summer deals inside",
      body: "Check out our summer collection.",
      status: "draft",
      createdBy: user.id,
    })
    .returning();
  await db.insert(campaignRecipientsTable).values(
    [alice, bob, carol, dave, eve].map((r) => ({
      campaignId: draft2.id,
      recipientId: r.id,
    })),
  );

  // Campaign 3: scheduled 7 days out, 8 recipients
  const [scheduled] = await db
    .insert(campaignsTable)
    .values({
      id: uuidv4(),
      name: "Product Launch",
      subject: "Introducing our new product",
      body: "We're excited to announce...",
      status: "scheduled",
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdBy: user.id,
    })
    .returning();
  await db.insert(campaignRecipientsTable).values(
    [alice, bob, carol, dave, eve, frank, grace, henry].map((r) => ({
      campaignId: scheduled.id,
      recipientId: r.id,
    })),
  );

  // Campaign 4: sent, 10 recipients (8 sent/4 opened, 2 failed)
  const [sent1] = await db
    .insert(campaignsTable)
    .values({
      id: uuidv4(),
      name: "Newsletter #1",
      subject: "Monthly update — April 2026",
      body: "Here's what happened this month...",
      status: "sent",
      createdBy: user.id,
    })
    .returning();
  await db.insert(campaignRecipientsTable).values([
    {
      campaignId: sent1.id,
      recipientId: alice.id,
      status: "sent",
      sentAt: daysAgo(5),
      openedAt: daysAgo(4),
    },
    {
      campaignId: sent1.id,
      recipientId: bob.id,
      status: "sent",
      sentAt: daysAgo(5),
      openedAt: daysAgo(4),
    },
    {
      campaignId: sent1.id,
      recipientId: carol.id,
      status: "sent",
      sentAt: daysAgo(5),
      openedAt: daysAgo(3),
    },
    {
      campaignId: sent1.id,
      recipientId: dave.id,
      status: "sent",
      sentAt: daysAgo(5),
      openedAt: daysAgo(3),
    },
    {
      campaignId: sent1.id,
      recipientId: eve.id,
      status: "sent",
      sentAt: daysAgo(5),
    },
    {
      campaignId: sent1.id,
      recipientId: frank.id,
      status: "sent",
      sentAt: daysAgo(5),
    },
    {
      campaignId: sent1.id,
      recipientId: grace.id,
      status: "sent",
      sentAt: daysAgo(5),
    },
    {
      campaignId: sent1.id,
      recipientId: henry.id,
      status: "sent",
      sentAt: daysAgo(5),
    },
    {
      campaignId: sent1.id,
      recipientId: iris.id,
      status: "failed",
      sentAt: daysAgo(5),
    },
    {
      campaignId: sent1.id,
      recipientId: jack.id,
      status: "failed",
      sentAt: daysAgo(5),
    },
  ]);

  // Campaign 5: sent, 6 recipients (5 sent/2 opened, 1 failed)
  const [sent2] = await db
    .insert(campaignsTable)
    .values({
      id: uuidv4(),
      name: "Flash Sale",
      subject: "48-hour flash sale — ends tonight",
      body: "Don't miss out on these deals...",
      status: "sent",
      createdBy: user.id,
    })
    .returning();
  await db.insert(campaignRecipientsTable).values([
    {
      campaignId: sent2.id,
      recipientId: alice.id,
      status: "sent",
      sentAt: daysAgo(10),
      openedAt: daysAgo(10),
    },
    {
      campaignId: sent2.id,
      recipientId: bob.id,
      status: "sent",
      sentAt: daysAgo(10),
      openedAt: daysAgo(9),
    },
    {
      campaignId: sent2.id,
      recipientId: carol.id,
      status: "sent",
      sentAt: daysAgo(10),
    },
    {
      campaignId: sent2.id,
      recipientId: dave.id,
      status: "sent",
      sentAt: daysAgo(10),
    },
    {
      campaignId: sent2.id,
      recipientId: eve.id,
      status: "sent",
      sentAt: daysAgo(10),
    },
    {
      campaignId: sent2.id,
      recipientId: frank.id,
      status: "failed",
      sentAt: daysAgo(10),
    },
  ]);

  console.log("Seed complete: 1 user, 10 recipients, 5 campaigns.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
