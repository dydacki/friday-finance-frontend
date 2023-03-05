import { Category } from '../interfaces/model/Category';
import { CategoryService } from '../interfaces/services/CategoryService';
import gql from 'graphql-tag';
import { useApolloClient } from '@vue/apollo-composable';

export class GraphQlCategoryService implements CategoryService {

  async getAll(): Promise<Category[]> {
    const categoriesQuery = gql`
      query {
        getCategories {
          id
          color
          name
        }
      }
    `;

  const clientFactory = useApolloClient();
  const apoolloCLient = clientFactory.resolveClient();      
  const result = await apoolloCLient.query({
    query: categoriesQuery
  });

  return result.data?.getCategories as Category[] ?? [];
  }
}
