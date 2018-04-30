import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map'


@Injectable()
export class TaskService {

  domain = "http://localhost:8080";
  constructor(private http:HttpClient) {
  }

  getTasks(){
    return this.http.get(this.domain + '/api/tasks').
      map(res=>res);
  }

  getTasksOfUser(id){
    return this.http.get(this.domain + '/api/usertasks/'+id).
    map(res=>res);
  }

  getSingleTask(uid,tid){
    var data={
      uid: uid,
      tid: tid
    };
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post(this.domain+'/api/task/single',data,{headers:headers}).
    map(res=>res);
  }

  getLocationsOfTasks(id){
    return this.http.get(this.domain + '/api/taskslocations/'+id).
    map(res=>res);
  }

  addTask(newTask,id){
    var data={
      id: id,
      task: newTask
    }
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post(this.domain+'/api/task',data,{headers:headers}).
    map(res=>res);
  }

  deleteTask(tid,uid){
    console.log("tid: "+tid);
    console.log("uid: "+uid);
    var data={
      uid: uid,
      tid: tid
    };
    return this.http.post(this.domain+'/api/task/delete',data).
    map(res=>res);
  }

  updateStatus(uid,task){
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.put(this.domain+'/api/task/'+uid ,task,{headers:headers}).
    map(res=>res);
  }

  editTask(data){
    var headers = new HttpHeaders();
    headers.append('Content-Type','application/json');
    return this.http.post(this.domain+'/api/task/edit',data,{headers:headers}).
    map(res=>res);
  }

  maxTask(id){
      return this.http.get(this.domain + '/api/maxtask/'+id).
      map(res=>res);
  }

  getPieDataOfUser(id){
    return this.http.get(this.domain + '/api/userpiedata/'+id).
    map(res=>res);

  }
}
