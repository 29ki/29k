import Stripe from 'stripe';
import * as yup from 'yup';
import {createApiPreAuthRouter} from '../../lib/routers';
import validation from '../lib/validation';
import {CURRENCY_CODES} from '../../lib/i18n';
import config from '../../lib/config';

const {STRIPE_API_KEY} = config;

const stripeRouter = createApiPreAuthRouter();

const stripe = new Stripe(STRIPE_API_KEY, {
  apiVersion: '2022-11-15',
});

const PaymentIntentResponse = yup.object({
  id: yup.string().required(),
  clientSecret: yup.string().required(),
  receiptEmail: yup.string().email().nullable(),
});

const OneTimePaymentIntentBodySchema = yup.object({
  amount: yup.number().positive().integer().required(),
  currency: yup.string().oneOf(CURRENCY_CODES).required(),
});

stripeRouter.post(
  '/paymentIntent/oneTime',
  validation({
    body: OneTimePaymentIntentBodySchema,
    response: PaymentIntentResponse,
  }),
  async ({request, response}) => {
    const {amount, currency} = request.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    response.body = {
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      receiptEmail: paymentIntent.receipt_email,
    };
  },
);

const RecurringPaymentIntentBodySchema = yup.object({
  email: yup.string().email().required(),
  priceId: yup.string().required(),
});

stripeRouter.post(
  '/paymentIntent/recurring',
  validation({
    body: RecurringPaymentIntentBodySchema,
    response: PaymentIntentResponse,
  }),
  async ({request, response}) => {
    const {email, priceId} = request.body;

    const customer = await stripe.customers.create({
      email,
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    const latestInvoice = subscription.latest_invoice;
    const paymentIntent =
      typeof latestInvoice !== 'string' &&
      typeof latestInvoice?.payment_intent !== 'string'
        ? latestInvoice?.payment_intent
        : null;

    response.body = {
      id: paymentIntent?.id,
      clientSecret: paymentIntent?.client_secret,
      receiptEmail: paymentIntent?.receipt_email,
    };
  },
);

const UpdatePaymentIntentParamsSchema = yup.object({
  id: yup.string().required(),
});
const UpdatePaymentIntentBodySchema = yup.object({
  email: yup.string().email().required(),
});

stripeRouter.put(
  '/paymentIntent/:id',
  validation({
    params: UpdatePaymentIntentParamsSchema,
    body: UpdatePaymentIntentBodySchema,
    response: PaymentIntentResponse,
  }),
  async ({params, request, response}) => {
    const {id} = params;
    const {email} = request.body;

    const paymentIntent = await stripe.paymentIntents.update(id, {
      receipt_email: email,
    });

    response.body = {
      id: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      receiptEmail: paymentIntent.receipt_email,
    };
  },
);

export {stripeRouter};
