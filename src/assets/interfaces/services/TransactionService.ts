import { Transaction } from '../model/Transaction';

export interface TransactionService {
  getAll(): Array<Transaction>;
  getOne(transactionId: string): Transaction | null;
  updateTransaction(transaction: Transaction): Transaction;
};