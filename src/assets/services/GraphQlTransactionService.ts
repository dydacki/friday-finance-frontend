import { Transaction } from '../interfaces/model/Transaction';
import { TransactionService } from '../interfaces/services/TransactionService';
import gql from 'graphql-tag';
import { useApolloClient } from '@vue/apollo-composable';

export class GraphQlTransactionService implements TransactionService {
  
  async getAll(): Promise<Transaction[]> {
    const transactionsQuery = gql`
    query {
      getCategories {
        id
        accountId
        transactionId
        reference
        amount
        currency
        date
      }
    }
  `;

  const clientFactory = useApolloClient();
  const apoolloCLient = clientFactory.resolveClient();      
  const result = await apoolloCLient.query({
    query: transactionsQuery
  });

  return result.data?.getTransactions as Transaction[] ?? [];
  }

  getOne(transactionId: string): Promise<Transaction | null> {
    throw new Error('Method not implemented.');
  }
  
  updateTransaction(transaction: Transaction): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }
}
