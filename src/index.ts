import express from 'express';
import { buildApp } from './app';
import { makeExecutableSchema } from '@graphql-tools/schema'
import { FusionQLGenerator } from './lib/generator/generator';
// import { resolvers } from "@generated/resolvers";

const app = express();

const endpoint = buildApp(app);
const generator = new FusionQLGenerator();

app.listen(4000, () => {
  // console.log(resolvers);
  console.log(`GraphQL API located at http://localhost:4000${endpoint}`);
});




// const schema = makeExecutableSchema({
//   typeDefs: [generator.typeDefs()],
//   resolvers: [resolvers],
// });