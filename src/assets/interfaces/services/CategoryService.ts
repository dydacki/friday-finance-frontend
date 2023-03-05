import { Category } from '../model/Category';

export interface CategoryService {
  getAll(): Promise<Array<Category>>;
}
