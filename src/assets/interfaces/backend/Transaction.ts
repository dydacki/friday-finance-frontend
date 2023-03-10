import { AccountBrief } from './Account';
import { CategoryBrief } from './Category';

export interface Transaction {
  id: string;
  account: AccountBrief;
  category: CategoryBrief;
  reference?: string;
  amount: number;
  currency: string;
  date: string;
};

export interface TransactionPage {
  transactions: Transaction[];
  totalTransactions: number;
  fromTransaction: number;
  toTransaction: number;
}