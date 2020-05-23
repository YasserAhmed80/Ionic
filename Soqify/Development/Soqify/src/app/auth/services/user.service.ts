import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

import { IUser } from '../../model/types'


// Facebool blugin for auth for Android, iOS, Web
import { Plugins } from '@capacitor/core';
import { FacebookLoginResponse } from '@rdlabo/capacitor-facebook-login';
const { FacebookLogin } = Plugins;
const FACEBOOK_PERMISSIONS = ['email', 'user_birthday', 'user_photos', 'user_gender'];
// End Facebook auth

@Injectable({
  providedIn: 'root'
})
export class userService {
 
  public user: IUser;
  private userData: any;
  private FB_res :any;

  constructor(public fireAuth:AngularFireAuth, 
             public fireStore: AngularFirestore
             ) 
  { 
    // subscripe for auth changes
    this.fireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        this.getUserData();

      } else {
        localStorage.setItem('user', null);
      }
    })

  }

  // >> Sign in using mail and password <<-------------------------------------

  //  Send verification mail to confirm new registeration 
  sendVerificationMail() {
    return this.fireAuth.auth.currentUser.sendEmailVerification()
    .then(()=>{
      return 'success'
    })
    .catch ((err)=>{
      return err.code;
    })
  }


  // Register user into database
  registerUser(user:IUser, password) {
     return this.fireAuth.auth.createUserWithEmailAndPassword(user.email, password)
     .then((auth)=>{
          console.log ('Register successfully ', auth.user);
          // Save user data into database
          this.setUserData(user, auth.user.uid)
          // send verification mail
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
      if (!auth.user.emailVerified) {
       return 'verify';
      }else{
        // reterive user data after sign in
        this.getUserData();
        return 'success';
      }
     })
     .catch ((err)=>{
       return err.code;
     })
  }

  // User logout
  SignOut(){
    return this.fireAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      // redirect to required page
    })
  }

  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Store user in localStorage
  setUserData(user:IUser, uid) {
    
    const userRef: AngularFirestoreDocument<IUser> = this.fireStore.doc(`users/${uid}`);
    this.user = {
      uid: uid,
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

  // get user data from database
  getUserData(){
    const userRef: AngularFirestoreDocument<IUser> = this.fireStore.doc(`users/${this.userData.uid}`);
    userRef.valueChanges().subscribe((user)=>{
      this.user = user;
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

  // >> End section of sign in using mail and password ------------------------

  // >> Sign in using Facebook <<----------------------------------------------
  facebook_SignIn(){
    FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS })
      .then((result: FacebookLoginResponse)=>{
        console.log(`Facebook response`, result);

        this.getFB_userInfo ();
        this.firebase_FB_provider(result.accessToken.token);

      })
      .catch ((err)=>{
        console.log(`Facebook response: user cancelled`);
      })
  }

  async facebook_SignOut (){
    FacebookLogin.logout( )
      .then(()=>{
        console.log(`Sign out successfully`);
      })
      .catch((err)=>{
        console.log(`Sign out error`);
      })
  }
  getFB_userInfo(){
    this.getCurrentAccessToken()
      .then((result)=>{
       let  {userId, token} = result.accessToken;
        fetch(`https://graph.facebook.com/${userId}?fields=id,name,gender,link,picture&type=large&access_token=${token}`)
          .then((response)=>{
            response.json().then((FB_user)=>{
              console.log( FB_user);
              return FB_user;
            });
           
          })
      })
  }

  getCurrentAccessToken(){
    return FacebookLogin.getCurrentAccessToken();
  }

  firebase_FB_provider(FB_Token){
  
    const facebookCredential = firebase.auth.FacebookAuthProvider.credential(FB_Token);
    
    firebase.auth().signInWithCredential(facebookCredential)
    .then ((user)=>{
      console.log('sign in with FB/firebase:', user);
      return user;
    })

  }
  // >> End of section: Sign in using Facebook---------------------------------


}
