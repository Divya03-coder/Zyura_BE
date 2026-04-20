
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import app from "./app";
import { configs } from "./app/configs";
import { makeDefaultAdmin } from "./app/utils/makeDefaultAdmin";
import { setupSocket } from "./socket";

let io: Server;

const server = http.createServer(app);
io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"],                       
        credentials: true,
    },
});

setupSocket(io);

// async function main() {
//     await mongoose.connect(configs.db_url!);
//     server.listen(Number(configs.port), '0.0.0.0', async () => {
//         console.log(`Server listening on port ${configs.port}`);
//         await makeDefaultAdmin().catch(console.error);
//     });
// }
// main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(configs.db_url!, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        w: 'majority',
        readPreference: 'primaryPreferred',
        heartbeatFrequencyMS: 10000,
        maxPoolSize: 10,
    });

    // Connection events
    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected! Attempting reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected!');
    });

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    server.listen(Number(configs.port), '0.0.0.0', async () => {
        console.log(`Server listening on port ${configs.port}`);
        await makeDefaultAdmin().catch(console.error);
    });
}

main().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
