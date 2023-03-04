import { Account } from '../model/Account';

export interface AccountService {
  getAll(): Array<Account>;
}
