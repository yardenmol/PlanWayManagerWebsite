import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ManagerService } from "../../services/manager.service";
import * as io from 'socket.io-client'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  email: string;
  password: string;
  message: string;

  constructor(private managerService: ManagerService, private router: Router) {
  }

  ngOnInit() {
  }

  register(event) {
    event.preventDefault();
    var newManager = {
      email: this.email,
      password: this.password
    }
    this.managerService.managerRegister(newManager).subscribe(data => {
      if (data["success"]) {
        console.log("success");
        this.router.navigate(['/usermanagement',data["mid"]]);
      }
      else{
        console.log("register failed")
        this.message = data["message"];
      }
    });
  }

  login(event) {
    event.preventDefault();
    var manager = {
      email: this.email,
      password: this.password
    }
    this.managerService.managerLogin(manager).subscribe(data => {
      if (data["success"]) {
        console.log("success");
        //this.router.navigate(['/usermanagement(navbar:navbar)',data["mid"]]);
        // this.router.navigateByUrl(`/usermanagement(navbar:navbar)/${data["mid"]}`);
        // this.router.navigate([{ outlets: { navbar: [ 'navbar', data["mid"] ] }}]);
        // this.router.navigate(['/usermanagement(navbar:navbar)'], data["mid"])
        this.router.navigate(['/usermanagement',data["mid"]]);

      }
      else{
        console.log("login failed")
        this.message = data["message"];
      }

    });
  }

  admin(event) {
    //   event.preventDefault();
    //   var newAdmin = {
    //     name: this.name,
    //     password: this.password
    //   }
    //   this.userService.admin(newAdmin).
    //   subscribe(data=>{
    //     if (data["success"]){
    //       this.router.navigate(['/admin']);
    //     }
    //     else
    //       this.message=data["message"];
    //   });
    // }


  }
}
