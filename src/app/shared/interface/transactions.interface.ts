export interface TransactionsInterface {
  id?: string;
  date: Date | string;
  description: string;
  entry?: number | null;
  exit?: number | null;
  paid?: boolean;
}

export interface TransactionRow {
  id?: string;
  transaction: TransactionsInterface;
  isEditing?: boolean; 
  isNew?: boolean;
}