import { prisma } from "@database/prisma";

default const resolvers = {
Query: {
allUsers: async () => {
      return prisma.user.findMany();

}},

}