import Router from '@koa/router';
import * as yup from 'yup';
import validator from 'koa-yup-validator';
import {firestore} from 'firebase-admin';
import 'firebase-functions';

import {Temple} from '../../../../shared/src/types/Temple';
import * as dailyApi from '../../lib/dailyApi';

const TEMPLES_COLLECTION = 'temples';

const templesRouter = new Router();

templesRouter.get('/', async ctx => {
  const {response} = ctx;

  const snapshot = await firestore().collection(TEMPLES_COLLECTION).get();
  const temples = snapshot.docs.map(doc => doc.data()) as Temple[];

  response.status = 200;
  ctx.body = temples;
});

const Temple = yup.object().shape({
  name: yup.string().required(),
});

templesRouter.post('/', validator({body: Temple}), async ctx => {
  const {name} = ctx.request.body;

  const data = await dailyApi.createRoom();
  const temple: Temple = {
    id: data.id,
    name,
    url: data.url,
    active: false,
  };

  await firestore().collection(TEMPLES_COLLECTION).doc(data.id).set(temple);

  ctx.body = temple;
});

export {templesRouter};
