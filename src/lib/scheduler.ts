import cron from "node-cron";
import { deactivateExpiredPresences } from "./action";
import logger from "./logger";

export function startPresenceScheduler() {
  logger.info("Scheduler dimulai...");

  // Setiap 5 menit
  cron.schedule("*/5 * * * *", async () => {
    logger.info("Menjalankan scheduler...")
    // console.log("🚀 Menjalankan cron...");
    await deactivateExpiredPresences();
  });
};