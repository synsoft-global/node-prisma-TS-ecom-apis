import { PrismaClient as PrismaClientMongo } from '@prisma/client';

const MongoPrisma = new PrismaClientMongo();

export default MongoPrisma;