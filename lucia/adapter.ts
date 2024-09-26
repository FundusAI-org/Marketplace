import { db } from "@/db";
import { sessionsTable, usersTable } from "@/db/schema";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionsTable, usersTable);

export default adapter;
