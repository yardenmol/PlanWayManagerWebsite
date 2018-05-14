import {Component, EventEmitter, Input, Output} from '@angular/core';
import { ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core'
import {} from '@types/googlemaps'
import {TaskService} from "../../services/task.service";

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html',
  styleUrls: ['./google-maps.component.css']
})

export class GoogleMapsComponent implements OnInit {
  @Input() uid: Array<any>

  @Input() public latitude: number;
  @Input() public longitude: number;
  @Input() address:string;

  @Output() notifyLocation: EventEmitter<any> = new EventEmitter<any>();

  public searchControl: FormControl;
  public zoom: number;
  public locations;


  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private taskService:TaskService
  ) {}

  ngOnInit() {
    //console.log(this.uid);
    //this.getLocationsOfTasks(this.uid);

    //set google maps defaults
    this.zoom = 10;

    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

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

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();

          this.notifyLocation.emit({lat: this.latitude, lng:this.longitude, address: place.formatted_address});
          this.zoom = 12;

        });
      });
    });

  }

  getLocationsOfTasks(id){
    this.taskService.getLocationsOfTasks(id).
    subscribe(locations=>{
      this.locations=locations;
    });
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 10;
      });
    }
  }


}


