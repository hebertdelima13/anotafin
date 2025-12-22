import { Injectable, inject, signal, computed } from '@angular/core';
import { TransactionsServices } from '../services/transactions/transactions.services';
import { TransactionRow, TransactionsInterface } from '../interface/transactions.interface';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth/auth.service';
import { of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionsStore {
  monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  private service = inject(TransactionsServices);
  private authService = inject(AuthService);

  private _transactions = signal<TransactionsInterface[]>([]);
  transactions = this._transactions.asReadonly();
  public isLoading = signal<boolean>(true);
  public rowLoading = signal<string | 'new' | null>(null);
  public paidRowLoading = signal<string | null>(null);

  selectedYear = signal(new Date().getFullYear());
  selectedMonth = signal(new Date().getMonth());

  editingRow = signal<TransactionRow | null>(null);

  constructor() {
    toObservable(this.authService.user)
      .pipe(
        takeUntilDestroyed(),
        switchMap((user) => {
          if (!user) {
            this._transactions.set([]);
            this.isLoading.set(false);
            return of([]);
          }

          this.isLoading.set(true);
          return this.service.getTransactionsByUid(user.uid);
        })
      )
      .subscribe((data) => {
        this._transactions.set(data);
        this.isLoading.set(false);
      });
  }

  selectedMonthLabel = computed(() => this.monthNames[this.selectedMonth()]);

  orderedTransactions = computed(() =>
    [...this.transactions()].sort(
      (a: any, b: any) =>
        new Date(a.transaction.date).getTime() - new Date(b.transaction.date).getTime()
    )
  );

  monthlyTransactions = computed(() => {
    const year = this.selectedYear();
    const month = this.selectedMonth();

    return this.orderedTransactions().filter((t: any) => {
      const d = new Date(t.transaction.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  });

  previousBalance = computed(() => {
    const year = this.selectedYear();
    const month = this.selectedMonth();

    return this.orderedTransactions()
      .filter((t: any) => {
        const d = new Date(t.transaction.date);
        return d.getFullYear() < year || (d.getFullYear() === year && d.getMonth() < month);
      })
      .reduce((total, t: any) => total + t.transaction.entry - t.transaction.exit, 0);
  });

  monthEntries = computed(() =>
    this.monthlyTransactions().reduce((t, i: any) => t + i.transaction.entry, 0)
  );

  monthExits = computed(() =>
    this.monthlyTransactions().reduce((t, i: any) => t + i.transaction.exit, 0)
  );

  finalBalance = computed(() => this.previousBalance() + this.monthEntries() - this.monthExits());

  tableData = computed(() => {
    const editing = this.editingRow();

    if (editing && editing.isNew) {
      return [
        {
          ...editing,
          balance: null,
          isEditing: true,
        },
      ];
    }

    let runningBalance = this.previousBalance();

    return this.monthlyTransactions().map((t: any) => {
      if (editing && !editing.isNew && editing.id === t.id) {
        return {
          ...editing,
          balance: null,
          isEditing: true,
        };
      }

      runningBalance += t.transaction.entry - t.transaction.exit;

      return {
        ...t,
        balance: runningBalance,
        isEditing: false,
      };
    });
  });

  startNewTransaction() {
    if (this.editingRow()) return;
    this.editingRow.set({
      transaction: {
        date: '',
        description: '',
        entry: null,
        exit: null,
      },
      isEditing: true,
      isNew: true,
    });
  }

  cancelEdit() {
    this.editingRow.set(null);
  }

  async saveEditing() {
    try {
      const row = this.editingRow();
      if (!row) return;

      this.rowLoading.set(row.isNew ? 'new' : row.id ?? null);

      const payload = {
        transaction: {
          ...row.transaction,
          entry: row.transaction.entry ?? null,
          exit: row.transaction.exit ?? null,
          date: new Date(row.transaction.date).toISOString(),
        },
      };

      if (row.isNew) {
        await this.service.addTransaction(payload.transaction);
      } else if (row.id) {
        await this.service.updateTransaction(row.id, payload);
      }

      this.editingRow.set(null);
    } catch (error) {
      console.log(error);
    } finally {
      this.rowLoading.set(null);
    }
  }

  editTransaction(row: TransactionRow) {
    this.editingRow.set({
      id: row.id,
      transaction: { ...row.transaction },
      isEditing: true,
      isNew: false,
    });
  }

  delete(id: string) {
    return this.service.deleteTransaction(id);
  }

  isRowSaving(row: any) {
    return this.rowLoading() === (row.isNew ? 'new' : row.id);
  }

  async togglePaid(row: TransactionRow) {
    if (!row.id) return;

    this.paidRowLoading.set(row.id);

    try {
      await this.service.updateTransaction(row.id, {
        transaction: {
          ...row.transaction,
          paid: !row.transaction.paid,
        },
      });
    } finally {
      this.paidRowLoading.set(null);
    }
  }
}
