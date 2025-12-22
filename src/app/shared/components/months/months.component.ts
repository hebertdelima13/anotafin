import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TransactionsStore } from '../../store/transactions.store';

@Component({
  selector: 'app-months',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './months.component.html',
  styleUrl: './months.component.scss',
})
export class MonthsComponent {
  transactionStore = inject(TransactionsStore);
  months: string[] = [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ];

  setActive(i:number) {
    this.transactionStore.selectedMonth.set(i);
  }
}
