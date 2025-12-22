import { Injectable, computed, inject, signal } from '@angular/core';
import { TransactionsInterface } from '../../interface/transactions.interface';
import {
  addDoc,
  deleteDoc,
  collection,
  Firestore,
  collectionData,
  doc,
  query,
  orderBy,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class TransactionsServices {
  fireStores = inject(Firestore);
  auth = inject(Auth);
  ref = collection(this.fireStores, 'transactions');

  addTransaction(transaction: TransactionsInterface) {
    return addDoc(this.ref, { transaction });
  }

  getTransactions(): Observable<TransactionsInterface[]> {
    const q = query(this.ref, orderBy('transaction.date', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<TransactionsInterface[]>;
  }

  updateTransaction(id: string, transaction: any) {
    return updateDoc(doc(this.fireStores, 'transactions', id), transaction);
  }

  deleteTransaction(id: string) {
    const ref = doc(this.fireStores, 'transactions', id);
    return deleteDoc(ref);
  }
}
