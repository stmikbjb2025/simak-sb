import * as dotenv from 'dotenv';
import { startPresenceScheduler } from "../src/lib/scheduler";

dotenv.config();

startPresenceScheduler();