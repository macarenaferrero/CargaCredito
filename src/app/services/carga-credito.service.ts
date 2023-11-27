import { Injectable } from '@angular/core';
import { DocumentData, Firestore, collection, CollectionReference, query, orderBy, getDocs, doc, setDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CargaCreditoService {
  listadoCreditosAMostrar: any;
  allCreditos: CollectionReference<DocumentData> = collection(this.firestore, 'creditos');

  constructor(public firestore: Firestore) { }

  getCreditos() {
    const creditos = collection(this.firestore, 'creditos');
    const order = query(creditos, orderBy('cantidad', 'desc'));
    return getDocs(order);
  }

  cargarCreditoA(cantidad:number, email:string, qrs:string) :Promise<void>{

    return new Promise((resolve, reject) => {
      const credito = doc(this.allCreditos);
      setDoc(credito, {
        id: credito.id,
        cantidad: cantidad,
        email: email,
        qrs: qrs,
      })
        .then(() => {
          resolve(); // Se resuelve la promesa si la operación se completa correctamente
        })
        .catch((error) => {
          reject(error); // Se rechaza la promesa si ocurre un error durante la operación
        });
    });
  }

  updateCredito(id:string, cantidad:number,qrs:string,email:string): Promise<void> {
    return new Promise((resolve, reject) => {
      const credito = doc(this.allCreditos, id);
      updateDoc(credito, {
        cantidad: cantidad,
        qrs: qrs,
        email: email,
      })
        .then(() => {
          resolve(); // Se resuelve la promesa si la operación se completa correctamente
        })
        .catch((error) => {
          reject(error); // Se rechaza la promesa si ocurre un error durante la operación
        });
    });
  }




}
