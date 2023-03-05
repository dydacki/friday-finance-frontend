import { Category } from '../interfaces/model/Category';
import { CategoryService } from '../interfaces/services/CategoryService';
import gql from 'graphql-tag';
import { useQuery } from '@vue/apollo-composable';

export class GraphQlCategoryService implements CategoryService {

  getAll(): Promise<Category[]> {
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
}
