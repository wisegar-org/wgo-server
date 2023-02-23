import { ApolloServer, BaseContext } from "@apollo/server";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";
import { IContextOptions } from "../interfaces/IContextOptions";
import { IServerOptions } from "../interfaces/IServerOptions";
import { getGqlSchema } from "./schema";

export const contextHandler = async (
  options: IServerOptions,
  req: any,
  res: any
): Promise<any> => {
  const authorizationRefreshToken = res.get("authorization-refresh") || "";

  const authorizationRefreshHeader = {
    "Access-Control-Expose-Headers": "authorization-refresh",
    "authorization-refresh": authorizationRefreshToken,
  };

  res.set(authorizationRefreshHeader);

  const contextOptions: IContextOptions = {
    tokenPayload: (req as any).tokenPayload,
    requestHeaders: req.headers,
    responseHeaders: res.getHeaders(),
  };

  const context = await options.context(contextOptions);
  (req as any).context = context;
  return context;
};

export const getApolloServer = async (options: IServerOptions) => {
  const schema = await getGqlSchema(options);
  return new ApolloServer<BaseContext>({
    schema: schema,
    plugins: [
      options.production
        ? ApolloServerPluginLandingPageLocalDefault()
        : ApolloServerPluginLandingPageProductionDefault(),
    ],
  });
};
