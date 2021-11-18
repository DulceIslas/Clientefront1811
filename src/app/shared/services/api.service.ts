import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse,
} from "@angular/common/http";

import { map, catchError, tap } from "rxjs/operators";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private currentTokenSubject: BehaviorSubject<any>;
  public currentToken: Observable<any>;

  secretKey = "4pK3y4WeBM1C1..$";
  encryptedData = "";
  private url = "http://localhost:8080/api/v1";

  constructor(private _http: HttpClient) {

    this.currentTokenSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem("tokenApp"))
    );

    this.currentToken = this.currentTokenSubject.asObservable();

   }

   loginapp() {

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'byapplogin': 'true'
    };
    return this._http.post(`${this.url}/auth/loginapp`,
    {
      "appKey": this.encrypt('4pK3y4WeB..$')
    },
    {headers}
    ).pipe(
      map((data : any) => {
        if (data.idToken) {
          // console.log(data.idToken);
          localStorage.setItem("tokenApp", JSON.stringify(data.idToken));
          this.currentTokenSubject.next(data.idToken);
          // this.startRefreshTokenTimer();
        }
        return data
      }
      ),
      catchError((e) => throwError(e))
    );
  }

  public get currentTokenValue() {
    return this.currentTokenSubject.value;
  }

  getCuestionario(id, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };
    return this._http.get(this.url + "/questionsheet/byid/" + id, {headers}).pipe(
      map((data) => data),
      catchError((e) => throwError(e))
    );
  }

  getPropuesta(curp, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };
    return this._http.get(this.url + "/getPropuesta/" + curp, {headers}).pipe(
      map((data) => data),
      catchError((e) => throwError(e))
    );
  }

  getResumenPropuesta(curp, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };
    return this._http.get(this.url + "/getResumenPropuesta/" + curp, {headers}).pipe(
      map((data) => data),
      catchError((e) => throwError(e))
    );
  }

  getPlan(token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };
    return this._http.get(this.url + "/plan/all/", {headers}).pipe(
      map((data) => data),
      catchError((e) => throwError(e))
    );
  }

  getPais(token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };
    return this._http.get(this.url + "/getCatPais", {headers}).pipe(
      map((data) => data),
      catchError((e) => throwError(e))
    );
  }

  getEstado(idPais, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };
    return this._http.get(this.url + "/getCatEstado/" + idPais, {headers}).pipe(
      map((data) => data),
      catchError((e) => throwError(e))
    );
  }

  getDataBeneficiariosById(id, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };
    return this._http.get(this.url + "/propuesta/alldatabyid/" + id, {headers}).pipe(
      map((data) => data),
      catchError((e) => throwError(e))
    );
  }

  postCuestionario(sendArray, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };


    return this._http.post(`${this.url}/register/create`, sendArray,
    {headers}
    ).pipe(
      map((data : any) => {
        return data
      }
      ),
      catchError((e) => throwError(e))
    );
  }

  postAceptarPropuesta(sendArray, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };


    return this._http.post(`${this.url}/propuesta/aceptar`, sendArray,
    {headers}
    ).pipe(
      map((data : any) => {
        return data
      }
      ),
      catchError((e) => throwError(e))
    );
  }

  addUserTitularPareja(sendArray, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };


    return this._http.post(`${this.url}/user/create`, sendArray,
    {headers}
    ).pipe(
      map((data : any) => {
        return data
      }
      ),
      catchError((e) => throwError(e))
    );
  }

  updateUserTitularPareja(sendArray, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };


    return this._http.put(`${this.url}/user/create`, sendArray,
    {headers}
    ).pipe(
      map((data : any) => {
        return data
      }
      ),
      catchError((e) => throwError(e))
    );
  }

  addUserBeneficiario(sendArray, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };


    return this._http.post(`${this.url}/user/create`, sendArray,
    {headers}
    ).pipe(
      map((data : any) => {
        return data
      }
      ),
      catchError((e) => throwError(e))
    );
  }

  updateUserBeneficiario(sendArray, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };


    return this._http.put(`${this.url}/user/update`, sendArray,
    {headers}
    ).pipe(
      map((data : any) => {
        return data
      }
      ),
      catchError((e) => throwError(e))
    );
  }

  postIntentarPagar(sendArray, token) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token,
      'byapplogin': 'true'
    };


    return this._http.post(`${this.url}/pagoservice/pagar`, sendArray,
    {headers}
    ).pipe(
      map((data : any) => {
        return data
      }
      ),
      catchError((e) => throwError(e))
    );
  }

  encrypt(textToEncrypt) {
    var secretK64 = btoa(this.secretKey);
    var key = CryptoJS.enc.Base64.parse(secretK64);
    var encryptedData = CryptoJS.AES.encrypt(textToEncrypt, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return "" + encryptedData
    // return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  }

  decrypt(textToDecrypt: string) {
    var secretK64 = btoa(this.secretKey);
    var key = CryptoJS.enc.Base64.parse(secretK64);
    var decryptedData = CryptoJS.AES.decrypt(textToDecrypt, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    var decryptedText = decryptedData.toString( CryptoJS.enc.Utf8 );

    return decryptedText
    // return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey).toString(CryptoJS.enc.Utf8);
  }

// helper methods

private refreshTokenTimeout;

private startRefreshTokenTimer() {
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.currentTokenValue.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    // const expires = new Date(jwtToken.exp * 1000);
    // const timeout = expires.getTime() - Date.now() - (60 * 1000);

    this.refreshTokenTimeout = setTimeout(() => this.loginapp().subscribe(), 1500000);
}

private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
}

  test (value) {
    // // var base64Key = "QWJjZGVmZ2hpamtsbW5vcA==";
    // // console.log( "base64Key = " + base64Key );

    // // this is the actual key as a sequence of bytes
    // var secretK64 = btoa(this.secretKey);
    // console.log( "secret64Key = " + secretK64 );

    // var key = CryptoJS.enc.Base64.parse(secretK64);
    // console.log( "key = " + key );

    // // this is the plain text
    // var plaintText = "Thundercats";
    // console.log( "plaintText = " + value );

    // // this is Base64-encoded encrypted data
    // var encryptedData = CryptoJS.AES.encrypt(value, key, {
    //     mode: CryptoJS.mode.ECB,
    //     padding: CryptoJS.pad.Pkcs7
    // });

    // this.encryptedData = encryptedData;

    // console.log( "encryptedData = " + encryptedData );

    // // this is the decrypted data as a sequence of bytes
    // var decryptedData = CryptoJS.AES.decrypt( '8/qd3wBF2d+mNk5T2BkvODIhkro84tfs6m8n3gtUU5k=', key, {
    //     mode: CryptoJS.mode.ECB,
    //     padding: CryptoJS.pad.Pkcs7
    // } );
    // console.log( "decryptedData = " + decryptedData );

    // // this is the decrypted data as a string
    // var decryptedText = decryptedData.toString( CryptoJS.enc.Utf8 );
    // console.log( "decryptedText = " + decryptedText );
  }






}
