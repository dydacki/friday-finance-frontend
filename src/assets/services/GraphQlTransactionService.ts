import { Transaction } from '../interfaces/model/Transaction';
import { TransactionService } from '../interfaces/services/TransactionService';
import gql from 'graphql-tag';
import { useQuery } from '@vue/apollo-composable';

export class GraphQlTransactionService implements TransactionService {
  
  getAll(): Transaction[] {
    const categoriesQuery = gql`
      query {
        getCategories {
          id
          color
          name
        }
      }
    `;

    const { result } = useQuery(categoriesQuery);
    return result.value?.getCategories ?? [];
  }

  getOne(transactionId: string): Transaction | null {
    throw new Error('Method not implemented.');
  }
  
  updateTransaction(transaction: Transaction): Transaction {
    throw new Error('Method not implemented.');
  }
}
