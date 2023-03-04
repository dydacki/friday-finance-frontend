import { Category } from '../model/Category';

export interface CategoryService {
  getAll(): Array<Category>;
}
