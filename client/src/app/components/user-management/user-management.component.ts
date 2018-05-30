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
  users: any=[];
  newUser: any = {};
  userToEdit: any = {};
  uidToDelete: string;


  constructor(private route:ActivatedRoute, private usersManagementService:UsersManagementService) {
    this.route.params.subscribe(params => {
      this.mid = params['mid'];
    });
  }


  ngOnInit() {
    console.log("blabla "+this.mid);
    this.getAllUsersOfManager()
  }

  getAllUsersOfManager(){
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

    console.log(this.newUser);

    this.usersManagementService.userRegister(this.newUser).subscribe(data => {
      if (data["success"]) {
        console.log("registration success");
        this.getAllUsersOfManager();
      }
      else{
        console.log("register failed "+data["message"]);
      }
    });
    this.newUser={};
  }

  setIdToDelete(id){
    this.uidToDelete = id;
  }

  deleteUser(){
    this.usersManagementService.deleteUser({uid: this.uidToDelete}).subscribe(data=>{
      if (data["success"]) {
        console.log("deletion success");
        this.getAllUsersOfManager();
      }
      else{
        console.log("deletion failed "+data["message"]);
      }
    });
  }

  setUserToEdit(user){
    this.userToEdit = user;
  }

  editUser(){
    // console.log(this.userToEdit);
    this.usersManagementService.editUser(this.userToEdit).subscribe(data=>{
      if (data["success"]) {
        console.log("edition success");
        this.getAllUsersOfManager();
      }
      else{
        console.log("edition failed "+data["message"]);
      }
    });
  }
}
