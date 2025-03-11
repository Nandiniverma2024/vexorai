import { PrismaClient } from "@prisma/client";

export const db = globalThis.prisma || new PrismaClient();

if( process.env.NODE_ENV !== "production" ){
    globalThis.prisma = db;
}

// globalThis.prisma -> Ensure that prisma client instance is reused
// during hot reloads during development , without this 
// whenever application reloads , it will create new prismaclient ,
// which creates connection issues

