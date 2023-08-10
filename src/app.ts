import express from 'express';
import { createSchema, createYoga } from 'graphql-yoga';
import { prisma } from './database/prisma';
import { typeDefs } from './generated/typeDefinitions';
import { FusionQLGenerator } from './lib/generator/generator';
import resolvers from "@generated/resolvers";

const generator = new FusionQLGenerator();

export function buildApp(app: ReturnType<typeof express>) {
  const graphQLServer = createYoga({
    schema: createSchema({
      typeDefs: typeDefs,
      resolvers: generator.resolvers(),
    }),
    logging: true,
  });

  app.use(graphQLServer.graphqlEndpoint, graphQLServer);

  return graphQLServer.graphqlEndpoint;
}