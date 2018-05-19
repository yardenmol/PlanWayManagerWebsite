import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UsersManagementService} from "../../services/users-management.service";

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  mid: string;
  users: any={};
  newUser: any = {};


  constructor(private route:ActivatedRoute, private usersManagementService:UsersManagementService) {
    this.route.params.subscribe(params => {
      this.mid = params['mid'];
    });
  }


  ngOnInit() {
    this.usersManagementService.getAllUsers({mid: this.mid}).
    subscribe(users=>{
      console.log(users);
      this.users = users;
    });
  }

  saveUser(){
    console.log(this.newUser);
    this.newUser.mid = this.mid;
    this.newUser.password = "Aa123456";

    this.usersManagementService.userRegister(this.newUser).subscribe(data => {
      if (data["success"]) {
        console.log("success");
        //this.router.navigate(['/usermanagement',data["mid"]]);
      }
      else{
        console.log("register failed")
        //this.message = data["message"];
      }
    });
    this.newUser={};
  }
}
