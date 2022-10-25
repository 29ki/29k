import Koa, {Middleware} from 'koa';
import bodyParser from 'koa-bodyparser';
import languageResolver from './languageResolver';

const createMockServer = (...middlewares: unknown[]) => {
  const app = new Koa();
  app.use(bodyParser());
  app.use(languageResolver());
  middlewares.forEach(middleware => {
    app.use(middleware as Middleware);
  });
  return app.listen();
};

export default createMockServer;
