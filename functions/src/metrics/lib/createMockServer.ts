import Koa, {Middleware} from 'koa';
import bodyParser from 'koa-bodyparser';

const createMockServer = (...middlewares: unknown[]) => {
  const app = new Koa();
  app.use(bodyParser());
  middlewares.forEach(middleware => {
    app.use(middleware as Middleware);
  });
  return app.listen();
};

export default createMockServer;
