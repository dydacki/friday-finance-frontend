import {Transaction} from '../backend/Transaction'

export interface TransactionPage {
  transactions: Transaction[];
  totalTransactions: number;
  displayedTransactions: number;
  start: number;
  end: number;
}