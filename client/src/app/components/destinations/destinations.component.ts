import { Component, OnInit,NgZone,ElementRef,EventEmitter, ViewChild, Output} from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import {ActivatedRoute} from "@angular/router";
import { FormControl } from '@angular/forms';
import {DestinationService} from "../../services/destination.service";


@Component({
  selector: 'app-destinations',
  templateUrl: './destinations.component.html',
  styleUrls: ['./destinations.component.css']
})
export class DestinationsComponent implements OnInit {

  @Output() notifyLocation: EventEmitter<any> = new EventEmitter<any>();


  @ViewChild("search")
  public searchElementRef: ElementRef;

  public searchControl: FormControl;
  private latitude: number;
  private longitude: number;
  private address: string;
  mid: string;
  public destinations:any;

  constructor(private destinationService:DestinationService,private route:ActivatedRoute, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {
    this.route.params.subscribe(params => {
      this.mid = params['mid'];
    });

  }


  ngOnInit() {

    //create search FormControl
    this.searchControl = new FormControl();
   //
    this.destinationService.getDestinations(this.mid).subscribe(data => {
      if (data) {
        console.log("getDestinations success");
        this.destinations = data;
        console.log(this.destinations);
      }
      else{
        console.log("getDestinations failed");
        this.destinations = {}
      }
    });


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


saveAddress(){

    // console.log(this.address);
    // console.log(this.latitude);
    // console.log(this.longitude);
    // console.log(this.mid);
   this.destinationService.addAddress({mid:this.mid,address:this.address,latitude:this.latitude, longitude: this.longitude }).subscribe(data => {
     if (data["success"]) {
       console.log("success");
       //this.router.navigate(['/usermanagement',data["mid"]]);
     }
     else{
       console.log("register failed")
       //this.message = data["message"];
     }
   });


}




}
