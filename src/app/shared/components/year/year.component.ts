import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TransactionsStore } from '../../store/transactions.store';

@Component({
  selector: 'app-year',
  imports: [MatIconModule],
  templateUrl: './year.component.html',
  styleUrl: './year.component.scss',
})
export class YearComponent {

  transactionStore = inject(TransactionsStore);

   prevYear() {
    this.transactionStore.selectedYear.update((y) => y - 1);
  }

  nextYear() {
    this.transactionStore.selectedYear.update((y) => y + 1);
  }
}
