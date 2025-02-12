import { RootController } from './controllers/RootController.js';
import { Server } from './Server.js';

Server.registerControllers([
    RootController,
]);

Server.run({
    port: 3046,
});
