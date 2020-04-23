import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = transactions.reduce((incomePartial, transaction) => {
      return transaction.type === 'income'
        ? incomePartial + transaction.value
        : incomePartial;
    }, 0);

    const outcome = transactions.reduce((outcomePartial, transaction) => {
      return transaction.type === 'outcome'
        ? outcomePartial + transaction.value
        : outcomePartial;
    }, 0);

    const balance: Balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
