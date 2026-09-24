import { app } from "./app"
import { env } from "./config/env"
import { prisma } from "./config/prisma"
import { connectRedis, redis } from "./config/redis"



const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect()

    await connectRedis()

    const server = app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`)
    })

    const shutdown = async (
         signal: string,
       ) => {
         console.log(
           `${signal} received. Shutting down...`,
         );

         server.close(async () => {
           await prisma.$disconnect();

           if (redis.isOpen) {
             await redis.quit();
           }

           process.exit(0);
         });
       };

       process.on(
         "SIGTERM",
         () => shutdown("SIGTERM"),
       );

       process.on(
         "SIGINT",
         () => shutdown("SIGINT"),
       );
  } catch (error) {
    console.error(
          "Failed to start server:",
          error,
        );

        process.exit(1);
  }
}


void startServer()
