import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import { IContextOptions } from "../interfaces/IContextOptions";
import { IServerOptions } from "../interfaces/IServerOptions";
import { getGqlSchema } from "./schema";

export const getApolloServer = async (options: IServerOptions) => {
  const schema = await getGqlSchema(options);
  return new ApolloServer({
    introspection: !options.production,
    schema: schema,
    formatError: options.formatError,
    context: async ({ req, res }) => {
      console.log("Running context!");
      const contextOptions: IContextOptions = {
        tokenPayload: (req as any).tokenPayload,
        requestHeaders: req.headers,
      };
      return await options.context(contextOptions);
    },
    typeDefs: options.typeDefs,
    plugins: [
      options.production
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });
};
