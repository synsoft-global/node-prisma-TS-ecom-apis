// import { port } from "./config";
// import app from "./app";

// app
//   .listen(port, () => {
//     console.info(`server running on port : ${port}`);
//   })
//   .on("error", (e) => console.error(e));


import { PrismaClient } from '@prisma/client';
import { port } from "./config";
import app from "./app";

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    app.listen(port, () => {
      console.info(`Server running on port: ${port}`);
    }).on("error", (e) => console.error(e));
  } catch (error) {
    throw error;
  }

}

main();
