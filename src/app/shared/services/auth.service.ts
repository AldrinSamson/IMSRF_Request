import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { AlertService } from './alert.service';
import { FirebaseService } from './firebase.service';

@Injectable()
export class AuthService {
  public token: any;
  userDetails: Array<any>;
  userUid: any;
  userPosition: any;


  constructor(public afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFirestore,
    private alert: AlertService,
    public fbs: FirebaseService
    ) { }

  async login(email: string, password: string) {
    try {
      this.alert.showToaster('Autheticating ...');
      const result = await this.afAuth.signInWithEmailAndPassword(email, password).then( res => {
        this.userUid = res.user.uid;
        // tslint:disable-next-line: no-shadowed-variable
        this.db.collection('requester', ref => ref.where('uid', '==', res.user.uid).where('isActive', '==', true)).valueChanges({idField: 'id'}).forEach( result => {
          this.userDetails = result;
          if (result.length !== 0) {
            sessionStorage.setItem('session-alive', 'true');
            sessionStorage.setItem('session-user-uid', this.userUid);
            sessionStorage.setItem('session-user-details', JSON.stringify(this.userDetails[0]));
            this.fbs.audit('Authentication' , 'Logged In', email);
            this.alert.showToaster('Logged In!');
            this.router.navigate(['/main']);
          } else {
            this.alert.showToaster('Invalid Account type');
          }
      });
      });
    } catch (err) {
      console.log(err);
      this.alert.showToaster('Email or Password is wrong');
    }
  }

  public logout(): void {
    const userName = JSON.parse(sessionStorage.getItem('session-user-details'));
    this.fbs.audit('Authentication' , 'Logged Out', userName.email);
    sessionStorage.removeItem('session-alive');
    sessionStorage.removeItem('session-user-uid');
    sessionStorage.removeItem('session-user-details');
    this.token = null;
    this.router.navigate(['/']);
  }

  public getIdToken(): string {
   firebase.auth().currentUser.getIdToken()
      .then(
        (token: string) => this.token = token
      );
    return this.token;
  }

  public isAuthenticated(): string {
    return sessionStorage.getItem('session-alive');
  }

  public userName() {
    const userName = JSON.parse(sessionStorage.getItem('session-user-details'));
    return userName.fullName
  }

  public requesterID() {
    const requesterID = JSON.parse(sessionStorage.getItem('session-user-details'));
    return requesterID.requesterID
  }
}
