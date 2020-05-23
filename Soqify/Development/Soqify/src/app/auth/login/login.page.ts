import { Component, OnInit } from '@angular/core';
import { userService } from '../services/user.service';
import { IUser, UserRole} from '../../model/types'



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  email : string = 'ysrahmed@gmail.com';
  password: string = '123456';


  constructor(private userService:userService) {
    
   }

  ngOnInit() {
  }

  registerUser(){
    var user:IUser;

    user = {
      email: this.email,
      name:'yasser',
      tel:'01028787773',
      role: UserRole.Admin
    }
    this.userService.registerUser(user,this.password)
    .then((x)=>{
      if (x ==='sucess') {
        console.log('x',x)
      }else{
        console.log('x',x)
      }
      
    })
  }

  
  loginUser (){
    this.userService.signIn(this.email, this.password).then((res)=>{
      console.log('sign in:', res)
    })
  }

  verifyMail (){
    this.userService.sendVerificationMail();
  }

  signOut(){
    this.userService.SignOut();
  }

  resetPassword(){
    this.userService.resetPassword(this.userService.user.email)
  }

  facebook_SignIn(){
    this.userService.facebook_SignIn();
  }

  facebook_SignOut(){
    this.userService.facebook_SignOut();
  }

}
