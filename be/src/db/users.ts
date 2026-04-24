import { eq } from "drizzle-orm";
import { db } from "../3rd-parties/drizzle";
import { usersTable } from "./schema";
import { User, NewUser } from "../entities/user";

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  return user;
};

export const insertUser = async (user: NewUser): Promise<User> => {
  const [inserted] = await db.insert(usersTable).values(user).returning();

  return inserted;
};
