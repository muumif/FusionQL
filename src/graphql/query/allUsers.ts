import { prisma } from "@database/prisma";


module.exports = {
      execution: execute(),
}

async function execute() {
      return prisma.user.findMany();
}