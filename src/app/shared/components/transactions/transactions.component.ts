import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TransactionsStore } from '../../store/transactions.store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MoneyInputDirective } from '../../directive/money-input.directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TransactionRow } from '../../interface/transactions.interface';

@Component({
  selector: 'app-transactions',
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MoneyInputDirective,
    MatProgressSpinnerModule,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  transactionStore = inject(TransactionsStore);
  displayedColumns: string[] = ['date', 'description', 'entry', 'exit', 'balance', 'actions'];

  addTransaction() {
    this.transactionStore.startNewTransaction();
  }

  editTransaction(row: any) {
    this.transactionStore.editTransaction(row);
  }

  deleteTransaction(id?: string) {
    if (!id) return;
    this.transactionStore.delete(id);
  }

  togglePaid(row: TransactionRow) {
  this.transactionStore.togglePaid(row);
}
}
