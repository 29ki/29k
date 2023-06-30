import {CURRENCIES} from '../../../../../../shared/src/constants/i18n';

export const ONE_TIME_AMOUNTS = {
  [CURRENCIES.USD]: [100, 50, 30, 20, 10, 5],
  [CURRENCIES.EUR]: [100, 50, 30, 20, 10, 5],
  [CURRENCIES.SEK]: [1000, 500, 300, 200, 100, 50],
};

export const RECURRING_AMOUNTS = {
  [CURRENCIES.USD]: [
    {id: 'price_1NKzOWAMQcdtMIVyMELfHkV8', amount: 2000},
    {id: 'price_1NKzOPAMQcdtMIVyhhCDTh1M', amount: 1000},
    {id: 'price_1NKzOGAMQcdtMIVysH6ALQ5G', amount: 500},
  ],
  [CURRENCIES.EUR]: [
    {id: 'price_1NKzKQAMQcdtMIVyNUxQ36Q4', amount: 2000},
    {id: 'price_1NKzKIAMQcdtMIVylBVLrIcH', amount: 1000},
    {id: 'price_1NKzK8AMQcdtMIVycfYaYB2w', amount: 500},
  ],
  [CURRENCIES.SEK]: [
    {id: 'price_1NKo4EAMQcdtMIVyK7kAhIPn', amount: 20000},
    {id: 'price_1NKo4EAMQcdtMIVyhfpaDag2', amount: 10000},
    {id: 'price_1NKo4EAMQcdtMIVyBfW0pwys', amount: 5000},
  ],
};

export const TEST_RECURRING_AMOUNTS = {
  [CURRENCIES.USD]: [
    {id: 'price_1NKzOWAMQcdtMIVyMELfHkV8', amount: 2000},
    {id: 'price_1NKzOPAMQcdtMIVyhhCDTh1M', amount: 1000},
    {id: 'price_1NKzOGAMQcdtMIVysH6ALQ5G', amount: 500},
  ],
  [CURRENCIES.EUR]: [
    {id: 'price_1NKzKQAMQcdtMIVyNUxQ36Q4', amount: 2000},
    {id: 'price_1NKzKIAMQcdtMIVylBVLrIcH', amount: 1000},
    {id: 'price_1NKzK8AMQcdtMIVycfYaYB2w', amount: 500},
  ],
  [CURRENCIES.SEK]: [
    {id: 'price_1NKo4EAMQcdtMIVyK7kAhIPn', amount: 20000},
    {id: 'price_1NKo4EAMQcdtMIVyhfpaDag2', amount: 10000},
    {id: 'price_1NKo4EAMQcdtMIVyBfW0pwys', amount: 5000},
  ],
};
