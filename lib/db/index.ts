import { drizzle } from "drizzle-orm/node-postgres"
import { verifyFull } from "@/lib/db/ssl"
import { Pool } from "pg"
import * as schema from "./schema"

export const pool = new Pool({ connectionString: verifyFull(process.env.DATABASE_URL || "") })
export const db = drizzle(pool, { schema })
