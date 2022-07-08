// Angular
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
// RxJS
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// NGRX
import { select, Store } from '@ngrx/store';
// Auth reducers and selectors
import { AppState} from '../../../core/reducers/';
import { isLoggedIn } from '../_selectors/auth.selectors';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../views/pages/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router, private cookieService:CookieService, private apiService:AuthService) {
  }

  /* canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store
      .pipe(
        select(isLoggedIn),
        tap(loggedIn => {
          if (!loggedIn) {
            this.router.navigateByUrl('/auth/login');
          }
        })
      );
  } */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    if(this.apiService.isLoggedIn()){
      return true;
    }else{
      this.router.navigateByUrl('/auth/login');
    }
  }
}


export class ResetPasswordGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router, private cookieService:CookieService, private apiService:AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    if(JSON.parse(localStorage.getItem("otp-validated"))){
      return true;
    }else{
      this.router.navigateByUrl('/auth/login');
    }
  }

}

export class ForgotPasswordGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router, private cookieService:CookieService, private apiService:AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    if(JSON.parse(localStorage.getItem("forgot-pass"))){
      return true;
    }else{
      this.router.navigateByUrl('/auth/login');
    }
  }

}
