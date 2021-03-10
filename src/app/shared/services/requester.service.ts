import { Injectable } from '@angular/core';
import { Requester } from '../model';
import { FirebaseService  } from './firebase.service';
import { IdGeneratorService } from './id-generator.service';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class RequesterService {

  constructor( public firebase: FirebaseService,
    public db: AngularFirestore,
    public authService: AuthService,
    public genService: IdGeneratorService,
    public alertService: AlertService,
    public afAuth: AngularFireAuth) { }

  getOne(id){
    return this.firebase.getOne<Requester>(Requester , id);
  }

  addOne(values) {
    return new Promise(resolve => {
      this.afAuth.createUserWithEmailAndPassword(values.email, values.password)
        .then((authData) => {
          this.genService.generateID(Requester).then(val => {
            this.db.collection<Requester>(Requester.collectionName).add({
            uid: authData.user.uid,
            requesterID: val.newID,
            num: val.newNum,
            contactNumber: values.contactNumber,
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            fullName: values.fullName,
            mailingAddress: values.mailingAddress,
            birthday: values.birthday,
            sex: values.sex,
            requesterPhotoUrl: values.requesterPhotoUrl,
            isActive: true,
            dateCreated: new Date(),
            dateLastModified: new Date(),
            createdBy: values.fullName,
            lastModifiedBy: values.fullName
          });
          this.alertService.showToaster('User Create Success'  , { classname: 'bg-success text-light', delay: 10000 });
          }).catch(error => {
            throw new Error('Error: Creating document:' + error);
          }).then( () => {
            //this.alertService.showToaster(values.fullName+' Requester Added' , { classname: 'bg-success text-light', delay: 10000 })
          });
        })
        .catch((_error) => {
          this.alertService.showToaster('User Create Failed' + _error.message  , { classname: 'bg-warning text-light', delay: 10000 });
          console.log('User Create Failed!', _error);
        });
    });
  }

  updateOne(id, values) {
    this.db.collection<Requester>(Requester.collectionName).doc(id).update({
      firstName: values.firstName,
      lastName: values.lastName,
      fullName: values.fullName,
      mailingAddress: values.mailingAddress,
      birthday: values.birthday,
      sex: values.sex,
      dateLastModified: new Date(),
      lastModifiedBy:  this.authService.userName()
    }).catch(error => {
      throw new Error('Error: Updating document:' + error);
    }).then( () => {
      this.alertService.showToaster(values.fullName+' Requester Modified' , { classname: 'bg-success text-light', delay: 10000 })
    });
  }
}
