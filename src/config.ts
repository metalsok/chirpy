import type {MigrationConfig} from "drizzle-orm/migrator";

process.loadEnvFile()


const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations",
};
type APIConfig = {
    fileserverHits: number;
    port: string
    platform: string
}

type DBConfig = {
    url: string,
    migrationConfig: MigrationConfig
}

type Config = {
    api: APIConfig
    db: DBConfig
}


export const config: Config = {
    api: {
        fileserverHits: 0,
        port: process.env.PORT ?? "",
        platform: process.env.PLATFORM ?? "dev"
    },
    db: {
        migrationConfig,
        url: process.env.DB_URL ?? ""
    }

}
