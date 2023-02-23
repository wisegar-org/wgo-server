import { IsNull, IsNullOrUndefined } from "@wisegar-org/wgo-object-extensions";
import { contextHandler, getApolloServer } from "../graphql/server";
import { IServerOptions } from "../interfaces/IServerOptions";
import { Express } from "express";
import { ApolloServer, BaseContext } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { json } from "body-parser";
import { option } from "yargs";

export const UseGqlServer = async (
  options: IServerOptions,
  onCreated?: (server: ApolloServer<BaseContext>, app: Express) => void,
  onStarted?: (server: ApolloServer<BaseContext>, app: Express) => void
) => {
  if (IsNullOrUndefined(options)) throw new Error("Invalid options parameter");
  if (!options.app || IsNull(options.app))
    throw new Error("Invalid options app parameter");

  const server = await getApolloServer(options);
  if (onCreated && !IsNull(options.app)) {
    onCreated(server, options.app);
  }
  await server.start();
  options.app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => contextHandler(options, req, res),
    })
  );

  if (onStarted && !IsNull(options.app)) {
    onStarted(server, options.app);
  }
};
