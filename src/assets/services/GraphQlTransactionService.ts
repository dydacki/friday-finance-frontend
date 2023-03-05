import { Transaction } from '../interfaces/model/Transaction';
import { TransactionService } from '../interfaces/services/TransactionService';

export class GraphQlTransactionService implements TransactionService {
  
  getAll(): Promise<Transaction[]> {
    throw new Error('Method not implemented.');
  }

  getOne(transactionId: string): Promise<Transaction | null> {
    throw new Error('Method not implemented.');
  }
  
  updateTransaction(transaction: Transaction): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }
}
