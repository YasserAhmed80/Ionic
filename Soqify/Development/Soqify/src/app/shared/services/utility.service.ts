import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  get serverTimeStamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  };
}
