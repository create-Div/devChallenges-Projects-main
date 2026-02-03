import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./backend/drizzle",
	schema: "./backend/src/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: process.env.DB_FILE_NAME ?? "file:backend/data/app.sqlite",
	},
});
