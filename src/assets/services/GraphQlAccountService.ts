import { Account } from '../interfaces/model/Account';
import { AccountService } from '../interfaces/services/AccountService';
import gql from 'graphql-tag';
import { useQuery } from '@vue/apollo-composable';

export class GraphQlAccountService implements AccountService {

  getAll(): Account[] {
    const accountsQuery = gql`
      query {
        getAccounts {
          id
          bank
          name
        }
      }
    `;

    const { result } = useQuery(accountsQuery);
    return result.value?.getAccounts ?? [];
  }
}
