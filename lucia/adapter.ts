import { db } from "@/db";
import { sessionsTable, accountsTable } from "@/db/schema";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionsTable, accountsTable);

export default adapter;
