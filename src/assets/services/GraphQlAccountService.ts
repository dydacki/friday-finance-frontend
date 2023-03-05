import { Account } from '../interfaces/model/Account';
import { AccountService } from '../interfaces/services/AccountService';
import gql from 'graphql-tag';
import { useApolloClient } from '@vue/apollo-composable';

export class GraphQlAccountService implements AccountService {

  async getAll(): Promise<Account[]> {
    const accountsQuery = gql`
      query {
        getAccounts {
          id
          bank
          name
        }
      }
    `;

      const clientFactory = useApolloClient();
      const apoolloCLient = clientFactory.resolveClient();      
      const result = await apoolloCLient.query({
        query: accountsQuery
      });

    return result.data?.getAccounts as Account[] ?? [];
  }
}
