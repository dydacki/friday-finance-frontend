export interface Transaction {
  id: string;
  account: string;
  category: string;
  reference?: string;
  amount: number;
  currency: string;
  date: string;
};