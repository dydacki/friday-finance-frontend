import { Account as BackendAccount } from './interfaces/backend/Account';
import { Account as FrontendAccount } from './interfaces/frontend/Account';
import { Category as BackendCategory } from './interfaces/backend/Category';
import { Category as FrontendCategory } from './interfaces/frontend/Category';
import { TransactionPage as BackendTransactionPage } from './interfaces/backend/Transaction';

function toFrontendAccount(account: BackendAccount): FrontendAccount {
  return {
    id: account.id,
    description: account.bank ? `${account.name} (${account.bank})` : account.name
  };
} 

function toFrontendCategory(category: BackendCategory): FrontendCategory {
  return {
    id: category.id,
    description: category.color ? `${category.name} (${category.color})` : category.name
  };
}

export {
  toFrontendAccount,
  toFrontendCategory
};