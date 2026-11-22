import express from 'express'
// index.ts
import {handlerReadiness} from './api/readiness.js';
import {handlerMetrics, handlerReset} from './api/admin.js';
import {errorHandler, middlewareLogResponses, middlewareMetricsInc} from './middleware.js';
import {config} from "./config.js";
import postgres from "postgres";
import {migrate} from "drizzle-orm/postgres-js/migrator";
import {drizzle} from "drizzle-orm/postgres-js";
import {
    createUserHandler,
    getAllUsersHandler,
    loginUserHandler,
    setChirpyToRed,
    updateUserHandler
} from "./api/users.js";
import {createChirpHandler, deleteChirpHandler, getAllChirpsHandler, getChirpHandler} from "./api/chirps.js";
import {refreshTokenHandler, revokeTokenHandler} from "./api/auth.js";

const app = express()
const port = 8080
app.use(express.json());

const migrationClient = postgres(config.db.url, {max: 1});
await migrate(drizzle(migrationClient), config.db.migrationConfig);


app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses)

app.get("/api/healthz", handlerReadiness)
app.post('/admin/reset', handlerReset)
app.get('/admin/metrics', handlerMetrics)
app.get('/api/users', getAllUsersHandler)
app.post('/api/users', createUserHandler)
app.put('/api/users', updateUserHandler)
app.post('/api/login', loginUserHandler)
app.post('/api/refresh', refreshTokenHandler)
app.post('/api/revoke', revokeTokenHandler)
app.post('/api/chirps', createChirpHandler)
app.delete('/api/chirps/:id', deleteChirpHandler)
app.get('/api/chirps', getAllChirpsHandler)
app.get('/api/chirps/:id', getChirpHandler)
app.post('/api/polka/webhooks', setChirpyToRed)

app.use(errorHandler);

app.listen(port, () => console.log('I am listening!'))
