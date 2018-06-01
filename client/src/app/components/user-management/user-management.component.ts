import {Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UsersManagementService} from "../../services/users-management.service";
import {FormControl} from "@angular/forms";
import {MapsAPILoader} from "@agm/core";

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
  message: string;

  //New User - address from googlemaps auto-complete
  @Output() notifyLocation: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("search")
  public searchElementRef: ElementRef;

  public searchControl: FormControl;
  private latitude: number;
  private longitude: number;
  private address: string;

  constructor(private route:ActivatedRoute, private usersManagementService:UsersManagementService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
    this.route.params.subscribe(params => {
      this.mid = params['mid'];
    });
  }


  ngOnInit() {
    this.getAllUsersOfManager()

    //create search FormControl
    this.searchControl = new FormControl();


    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {});
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          console.log(autocomplete.getPlace());
          //verify result
          if (place.geometry === undefined || place.geometry === null) {

            return;
          }

          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.address =place.formatted_address
          // this.notifyLocation.emit({lat: this.latitude, lng:this.longitude, address: place.formatted_address});

        });
      });
    });

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
    this.newUser.address = this.address;
    this.newUser.latitude = this.latitude;
    this.newUser.longitude = this.longitude;

    this.usersManagementService.userRegister(this.newUser).subscribe(data => {
      if (data["success"]) {
        console.log("registration success");
        this.getAllUsersOfManager();
      }
      else{
        this.message = data["message"];
       console.log("register failed "+data["message"]);
      }
    });
    this.newUser={};
  }

  setIdToDelete(id){
    this.message="";
    this.uidToDelete = id;
  }

  deleteUser(){
    this.usersManagementService.deleteUser({uid: this.uidToDelete}).subscribe(data=>{
      if (data["success"]) {
        console.log("deletion success");
        this.getAllUsersOfManager();
      }
      else{
        this.message = data["message"];
        console.log("deletion failed "+data["message"]);
      }
    });
    this.uidToDelete = "";
  }

  setUserToEdit(user){
    this.message="";
    this.userToEdit = user;
    this.address = user.address;
    this.latitude = user.latitude;
    this.longitude = user.longitude;
  }

  editUser(){
    console.log(this.userToEdit);
    this.userToEdit.address = this.address;
    this.userToEdit.latitude = this.latitude;
    this.userToEdit.longitude = this.longitude;

    this.usersManagementService.editUser(this.userToEdit).subscribe(data=>{
      if (data["success"]) {
        console.log("edition success");
        this.getAllUsersOfManager();
      }
      else{
        this.message = data["message"];
        console.log("edition failed "+data["message"]);
      }
    });
  }

  clearUserToEdit(){
    this.userToEdit = {};
  }

  deleteMessage(){
    this.message = "";
  }
}
