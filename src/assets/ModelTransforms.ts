import { Account as BackendAccount } from './interfaces/backend/Account';
import { Account as FrontendAccount } from './interfaces/frontend/Account';
import { Category as BackendCategory } from './interfaces/backend/Category';
import { Category as FrontendCategory } from './interfaces/frontend/Category';
import { Transaction as BackendTransaction } from './interfaces/backend/Transaction';
import { Transaction as FrontendTransaction } from './interfaces/frontend/Transaction';

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

function toFrontendTransaction(transaction: BackendTransaction, accounts: BackendAccount[], categories: BackendCategory[]): FrontendTransaction {
  const account = accounts.find(a => a.id === transaction.accountId)?.name ?? '';
  const category = categories.find(c => c.id === transaction.categoryId)?.name ?? '';
  return {
    account: account,
    amount: transaction.amount,
    category: category,
    currency: transaction.currency,
    date: transaction.date,
    id: transaction.id,
    reference: transaction.reference
  };
} 

export {
  toFrontendAccount,
  toFrontendCategory,
  toFrontendTransaction
}