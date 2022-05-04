import { IsNull, IsNullOrUndefined } from "@wisegar-org/wgo-object-extensions";
import { ApolloServer, ExpressContext } from "apollo-server-express";
import { getApolloServer } from "../graphql/server";
import { IServerOptions } from "../interfaces/IServerOptions";
import { Express } from "express";

export const UseGqlServer = async (
  options: IServerOptions,
  onCreated?: (server: ApolloServer<ExpressContext>, app: Express) => void,
  onStarted?: (server: ApolloServer<ExpressContext>, app: Express) => void
) => {
  if (IsNullOrUndefined(options)) throw new Error("Invalid options parameter");
  if (!options.app || IsNull(options.app))
    throw new Error("Invalid options app parameter");

  const server = await getApolloServer(options);
  if (onCreated && !IsNull(options.app)) {
    onCreated(server, options.app);
  }
  await server.start();
  if (onStarted && !IsNull(options.app)) {
    onStarted(server, options.app);
  }
  server.applyMiddleware({ app: options.app });
};
