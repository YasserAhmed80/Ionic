import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { UtilityService } from '../../shared/services/utility.service';

import { IUser } from '../../model/identity'
import { take } from 'rxjs/operators'


// Facebool blugin for auth for Android, iOS, Web
import { Plugins } from '@capacitor/core';
import { FacebookLoginResponse } from '@rdlabo/capacitor-facebook-login';


const { FacebookLogin } = Plugins;
const FACEBOOK_PERMISSIONS = ['email', 'user_birthday', 'user_photos', 'user_gender'];
// End Facebook auth

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  public user: IUser={};

  constructor(public fireAuth:AngularFireAuth, 
             public fireStore: AngularFirestore,
             private utilityService:UtilityService
             ) 
  { 
    let user = localStorage.getItem('identity');
    if ( user !== 'undefined'){
      this.user = JSON.parse(user);
      
    }
    
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
          console.log('from register user',user);

          this.addUserData(user);

          localStorage.setItem('identity', JSON.stringify(this.user));
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
        localStorage.setItem('identity', JSON.stringify(this.user));
        return 'success';
      }
     })
     .catch ((err)=>{
       return err.code;
     })
  }

  // User logout
  SignOut(){
    if (this.user.provider=="FB"){
      this.facebook_SignOut().then(()=>{
        // redirect to required page
      })
    }else{
      return this.fireAuth.auth.signOut().then(() => {
        localStorage.removeItem('identity');
        // redirect to required page
      })
    }

   
  }

  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('identity'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  get user_id (){
    return this.user.id;
  }

  // Store user in localStorage
  async addUserData(userData:IUser) {
      let newUSer = this.fireStore.collection('identity').add(userData);
      
      await newUSer
        .then((doc) => {
          return doc;
        })
        .catch((err) => {
          return false;
        });
  }

  // Store user in localStorage
  async updateUserData(userData:IUser) {
    await this.fireStore
      .collection("identity")
      .doc(userData.id)
      .set(userData, { merge: true })
      .then((user) => {
        localStorage.setItem('identity', JSON.stringify(userData));
        return user;
      })
      .catch((err)=>{
        console.log('update user error:', err)
        return err;
      })
  }

  // get user data from database bu auth_id
  async getUserData(auth_id:string){
    console.log('get user data:', auth_id)
    return await this.fireStore.collection('identity', (ref)=> ref.where ('auth_id', '==',auth_id))
                 .valueChanges({idField: 'id'})
                 .pipe(
                   take(1)
                 ).toPromise()
                 .then((user)=>{
                   return user[0]
                 })
                 .catch((err)=>{
                   return err
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
  async facebook_auth(){
    return await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS })
      .then((result: FacebookLoginResponse) => {
        console.log(`Facebook response`, result);
        return this.getFB_userInfo().then((FB_user) => {
          return this.firebase_FB_provider(result.accessToken.token).then(
            (user) => {
              console.log("facebook auth user:", user);
              return user;
            }
          );
        });
      })
      .catch((err) => {
        console.log(`Facebook response: user cancelled`);
      });
  }

  async facebook_SignIn(){
    return await this.facebook_auth().then((user)=>{
      if (user) {
        // get identiy data
        return this.getUserData(user.uid)
        .then((identity)=>{
          if (identity){
            this.user = identity;
            localStorage.setItem('identity', JSON.stringify(this.user));
            return identity
          }else{
            console.log('user not added to DB', user);
            let newUser: IUser ={
              auth_id: user.uid,
              name: user.displayName,
              active_ind:1,
              createdAt: this.utilityService.timestamp
            };

            console.log('user to beadded to DB', newUser);
            return this.addUserData(newUser).then((addedUser)=>{
              console.log('user added to DB');
              localStorage.setItem('identity', JSON.stringify(addedUser));
              return newUser;
            })
            .catch((err)=>{
              console.log('FB sign in add user err:', err)
            })
            
          }
        })
        .catch((err)=>{
          return err
        })
      }else{
        console.log ('facebook auth provider user', user);
      }
      
    })
    .catch((err)=>{
      console.log ('facebook auth provider', err);
    })
  }

  async facebook_SignOut (){
    FacebookLogin.logout( )
      .then(()=>{
        console.log(`Sign out successfully`);
        localStorage.removeItem('identity');
        return true;
      })
      .catch((err)=>{
        console.log(`Sign out error`);
        return false;
      })
  }
  getFB_userInfo(){
     return this.getCurrentAccessToken()
      .then((result)=>{
        let  {userId, token} = result.accessToken;
          return fetch(`https://graph.facebook.com/${userId}?fields=id,name,gender,link,picture&type=large&access_token=${token}`)
          .then((response)=>{
              return response.json()
              .then((FB_user)=>{
                console.log('get inof:', FB_user);
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
    return firebase.auth().signInWithCredential(facebookCredential)
    .then ((auth)=>{
      console.log('sign in with FB/firebase:', auth.user);
      return auth.user;
    })
    .catch((err)=>{
      console.log ('firebase FB auth error', err)
    })

  }
  // >> End of section: Sign in using Facebook---------------------------------


}
