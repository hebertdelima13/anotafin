import { Component, inject, input } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { YearComponent } from '../../shared/components/year/year.component';
import { MonthsComponent } from '../../shared/components/months/months.component';
import { CardsComponent } from '../../shared/components/cards/cards.component';
import { TransactionsComponent } from '../../shared/components/transactions/transactions.component';
import { TransactionsStore } from '../../shared/store/transactions.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    HeaderComponent,
    YearComponent,
    MonthsComponent,
    CardsComponent,
    TransactionsComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage {
  transactionStore = inject(TransactionsStore);

  iconSaldos = 'wallet';
  iconEntrada = 'trending_up';
  iconSaida = 'trending_down';

  cardTitleSaldoAnterior = 'Saldo Anterior';
  cardTitleEntrada = 'Entradas do Mês';
  cardTitleSaida = 'Saídas do Mês';
  cardTitleSaldoFinal = 'Saldo Final';

  cardValueSaldoAnterior = this.transactionStore.previousBalance;
  cardValueEntrada = this.transactionStore.monthEntries;
  cardValueSaida = this.transactionStore.monthExits;
  carValueSaldoFinal = this.transactionStore.finalBalance;

  get isLoading() {
    return this.transactionStore.isLoading;
  }
}
