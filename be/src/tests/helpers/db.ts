import { migrate } from "drizzle-orm/postgres-js/migrator";
import { sql } from "drizzle-orm";
import { db } from "../../3rd-parties/drizzle";

export const runMigrations = async (): Promise<void> => {
  await migrate(db, { migrationsFolder: "drizzle" });
};

export const truncateTables = async (): Promise<void> => {
  await db.execute(sql`TRUNCATE users, recipients CASCADE`);
};
