import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map'

@Injectable()
export class DestinationService {

  domain = "http://localhost:8080";
  constructor(private http:HttpClient) {
  }

  addAddress(newDestination){
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post(this.domain+'/destinations/add-destination',newDestination,{headers:headers}).
    map(res=>res);

  }

  getDestinations(mid){
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post(this.domain+'/destinations/get-destinations',{mid:mid},{headers:headers}).
    map(res=>res);

  }
  deleteDestination(uid){
    console.log(uid);
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post(this.domain+'/destinations/delete-destination',uid,{headers:headers}).
    map(res=>res);
  }
  editDestination(user){
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post(this.domain+'/destinations/edit-destinations',user,{headers:headers}).
    map(res=>res);
  }
}
