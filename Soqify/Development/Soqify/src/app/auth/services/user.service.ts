import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { IUser, UserRole } from '../../model/types'
import { auth } from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class userService {
 
  public user: IUser;
  private userData: any;

  constructor(public fireAuth:AngularFireAuth, public fireStore: AngularFirestore) { 
    this.fireAuth.authState.subscribe(user => {
      console.log ('auth state changed')
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        this.getUserData();

      } else {
        localStorage.setItem('user', null);
      }
    })
  }

  //  Send verification mail
  sendVerificationMail() {
    return this.fireAuth.auth.currentUser.sendEmailVerification()
    .then(()=>{
      console.log ('notification mail sent')
    })
  }


  // Register user into database
  registerUser(user:IUser, password) {
     return this.fireAuth.auth.createUserWithEmailAndPassword(user.email, password)
     .then((auth)=>{
          console.log ('Register successfully ', auth.user)
          this.setUserData(user)
          this.sendVerificationMail();
          return 'success';
    })
    .catch((err)=>{
      return err.code;
    })
    
  }

  // User login 
  signIn(email, password){
    return this.fireAuth.auth.signInWithEmailAndPassword(email, password)
    .then ((auth)=>{
      this.getUserData()
      if (!auth.user.emailVerified) {
       console.log('please verify mail')
       this.getUserData()
       return false;
      }else{
        console.log('sign in successfully ')
        return true;
      }
     })
     .catch ((err)=>{
       console.log(`sign in error:`, err.code)
     })
  }

  // User logout
  SignOut(){
    return this.fireAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      // redirect to required page
    })
  }

  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.emailVerified !== false) ? true : false;
  }

   // Returns true when user is looged in
   get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Store user in localStorage
  setUserData(user:IUser) {
    
    const userRef: AngularFirestoreDocument<IUser> = this.fireStore.doc(`users/${this.userData.uid}`);
    this.user = {
      uid: this.userData.uid,
      email:this.userData.email,
      name: user.name,
      role: user.role,
      tel:user.tel
    }
    console.log('set user:' , this.user)
    return userRef.set(this.user, {
      merge: true
    })
  }

  getUserData(){
    console.log(`users/${this.userData.uid}`)
    const userRef: AngularFirestoreDocument<IUser> = this.fireStore.doc(`users/${this.userData.uid}`);
    userRef.valueChanges().subscribe((user)=>{
      this.user = user;
      console.log('get user:', user)
    })
  }


  // Recover password
  resetPassword(passwordResetEmail) {
    return this.fireAuth.auth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email has been sent, please check your inbox.');
    }).catch((error) => {
      window.alert(error)
    })
  }



  

}
