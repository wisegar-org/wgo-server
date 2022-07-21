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
      const contextOptions: IContextOptions = {
        tokenPayload: (req as any).tokenPayload,
        requestHeaders: req.headers,
      };
      const context = await options.context(contextOptions);
      (req as any).context = context;
      return context;
    },
    typeDefs: options.typeDefs,
    plugins: [
      options.production
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });
};
