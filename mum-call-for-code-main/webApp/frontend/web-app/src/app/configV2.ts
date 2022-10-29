import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// The HttpClient service makes use of observables for all transactions. You must import the RxJS observable and operator symbols that appear in the example snippets.
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { User, Token, HouseholdEnergyData, BuyEnergyRequest, ProdForecastRequest, SellEnergyRequest, Validator } from './classes';

/** This file will allow the frontend to communicate with the backend
* using Angular's HTTP Client
*/


@Injectable({
  providedIn: 'root'
})
export class ConfigServiceV2 {

  private _configUrl: string = "http://localhost:8989/";
  private _getEnergyRequests: string = this._configUrl + "EnergyRequest/GetEnergyRequest";
  
  // get sell requests for the user

  TOKEN_KEY = 'token';


  //inject the HttpClient service as a dependency 
  constructor(private http: HttpClient) { }



  // get open energy requests
  getOpenEnergyRequests()  {
    let data = "Data"
    return this.http.post(this._getEnergyRequests, data)
  }

}