import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IUser, UserRoleRef} from '../../model/user'



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string='ysrahmed@gmail.com';
  password:string = '';
  loginError:string = '';
  
  constructor(public authService:AuthService) {
    
   }

  ngOnInit() {
  }


  loginUserByMail (){
    this.authService.logInByMail(this.email, this.password).then((res)=>{
      console.log('sign in:', res);
      if (res.err){
        this.loginError = res.err;
      }
    })
  }

  verifyMail (){
    this.authService.sendVerificationMail();
  }

  signOut(){
    this.authService.SignOut();
  }

  resetPassword(){
    this.authService.resetPassword(this.authService.currentUser.email)
  }

  facebook_SignIn(){
    this.authService.facebook_SignIn().then((user)=> console.log('facebook signed user', user))
  }

  facebook_SignOut(){
    this.authService.facebook_SignOut();
  }

}
