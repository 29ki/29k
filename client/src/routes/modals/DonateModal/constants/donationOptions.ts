import {CURRENCIES} from '../../../../../../shared/src/constants/i18n';

export const ONE_TIME_AMOUNTS = {
  [CURRENCIES.USD]: [100, 50, 30, 20, 10, 5],
  [CURRENCIES.EUR]: [100, 50, 30, 20, 10, 5],
  [CURRENCIES.SEK]: [1000, 500, 300, 200, 100, 50],
};

export type RECURRING_OPTION = {
  id: string;
  amount: number;
};

export type RECURRING_OPTIONS = {[currency: string]: RECURRING_OPTION[]};

export const RECURRING_OPTIONS: RECURRING_OPTIONS = {
  [CURRENCIES.USD]: [
    {id: 'price_1NLoU9AMQcdtMIVyOUJFbvt3', amount: 20},
    {id: 'price_1NLoUGAMQcdtMIVyqQ48TK2A', amount: 15},
    {id: 'price_1NLoUPAMQcdtMIVynCDHIzeY', amount: 10},
  ],
  [CURRENCIES.EUR]: [
    {id: 'price_1NLoUbAMQcdtMIVyJ3h6Srgh', amount: 20},
    {id: 'price_1NLoUhAMQcdtMIVyPYQMlbTS', amount: 15},
    {id: 'price_1NLoUnAMQcdtMIVyH8gcdkR2', amount: 10},
  ],
  [CURRENCIES.SEK]: [
    {id: 'price_1NP06aAMQcdtMIVyVHQED9Kl', amount: 200},
    {id: 'price_1NP06TAMQcdtMIVy9F9Qeic0', amount: 150},
    {id: 'price_1NP06MAMQcdtMIVyR0vX1iDh', amount: 100},
  ],
};

export const DEV_RECURRING_OPTIONS: RECURRING_OPTIONS = {
  [CURRENCIES.USD]: [
    {id: 'price_1NLoU9AMQcdtMIVyOUJFbvt3', amount: 20},
    {id: 'price_1NLoUGAMQcdtMIVyqQ48TK2A', amount: 15},
    {id: 'price_1NLoUPAMQcdtMIVynCDHIzeY', amount: 10},
  ],
  [CURRENCIES.EUR]: [
    {id: 'price_1NLoUbAMQcdtMIVyJ3h6Srgh', amount: 20},
    {id: 'price_1NLoUhAMQcdtMIVyPYQMlbTS', amount: 15},
    {id: 'price_1NLoUnAMQcdtMIVyH8gcdkR2', amount: 10},
  ],
  [CURRENCIES.SEK]: [
    {id: 'price_1NLod7AMQcdtMIVyaP5F0IiS', amount: 200},
    {id: 'price_1NLod7AMQcdtMIVydRhnDd6u', amount: 150},
    {id: 'price_1NLod7AMQcdtMIVyraKwmV8y', amount: 100},
  ],
};
