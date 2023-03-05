import { Transaction } from '../model/Transaction';

export interface TransactionService {
  getAll(): Promise<Array<Transaction>>;
  getOne(transactionId: string): Promise<Transaction | null>;
  updateTransaction(transaction: Transaction): Promise<Transaction>;
};