import express from "express";
import { IServerOptions } from "../interfaces/IServerOptions";
import { getApolloServer } from "./server";
import { graphqlUploadExpress } from "graphql-upload";

export const startServer = async (options: IServerOptions) => {
  const app = express();
  const server = await getApolloServer(options);
  app.use(graphqlUploadExpress());
  server.applyMiddleware({ app: app });
  console.log(`GraphQL Path: ${server.graphqlPath}`);
};
