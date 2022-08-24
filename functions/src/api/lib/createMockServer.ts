import Koa, {Middleware} from 'koa';
import bodyParser from 'koa-bodyparser';
import i18nResolver from './i18nResolver';

const createMockServer = (...middlewares: unknown[]) => {
  const app = new Koa();
  app.use(bodyParser());
  app.use(i18nResolver());
  middlewares.forEach(middleware => {
    app.use(middleware as Middleware);
  });
  return app.listen();
};

export default createMockServer;
