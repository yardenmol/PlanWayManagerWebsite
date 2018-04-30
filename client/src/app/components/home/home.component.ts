import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService} from "../../services/user.service";
import * as io from 'socket.io-client'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  name: string;
  password: string;
  message: string;

  constructor(private userService:UserService, private router: Router) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    var canvas = <HTMLCanvasElement> document.getElementById("myCanvas");
    var ctx= canvas.getContext("2d");
    ctx.font="bold 40px Segoe Print";
    ctx.fillText("To Do List", 40, 40);
  }

  register(event){
    event.preventDefault();
    var newUser = {
      name: this.name,
      password: this.password
    }
    this.userService.addUser(newUser).
    subscribe(data=>{
      if (data["success"]){
        this.router.navigate(['/tasks',data["id"]]);
      }
      else
        this.message=data["message"];
    });
  }

  login(event){
    event.preventDefault();
    var newUser = {
      name: this.name,
      password: this.password
    }
    this.userService.login(newUser).
    subscribe(data=>{
      if (data["success"]){
        this.router.navigate(['/tasks',data["id"]]);
      }
      else
        this.message=data["message"];
    });
  }

  admin(event){
    event.preventDefault();
    var newAdmin = {
      name: this.name,
      password: this.password
    }
    this.userService.admin(newAdmin).
    subscribe(data=>{
      if (data["success"]){
        this.router.navigate(['/admin']);
      }
      else
        this.message=data["message"];
    });
  }


}
