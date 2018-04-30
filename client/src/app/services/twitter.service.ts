import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map'

@Injectable()
export class TwitterService {

  domain = "http://localhost:8080";
  constructor(private http:HttpClient) { }

  postTweet(text){
    var data={text: text};
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post(this.domain+'/twitter/tweet',data,{headers:headers}).
    map(res=>res);
  }
}
