import { Injectable, inject } from '@angular/core';
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
  where,
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
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');

    return addDoc(this.ref, {
      uid: user.uid,
      transaction,
    });
  }

  getTransactionsByUid(uid: string): Observable<TransactionsInterface[]> {
    const q = query(this.ref, where('uid', '==', uid), orderBy('transaction.date', 'asc'));

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
