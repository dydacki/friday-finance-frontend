import { Account } from '../model/Account';

export interface AccountService {
  getAll(): Promise<Array<Account>>;
}
