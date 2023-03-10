export interface Transaction {
  sequenceNo: number;
  id: string;
  account: string;
  category: string;
  reference?: string;
  amount: number;
  currency: string;
  date: string;
};