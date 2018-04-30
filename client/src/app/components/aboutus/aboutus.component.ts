import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TwitterService} from "../../services/twitter.service";

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {

  id: string;
  text:string;
  private sub: any;


  constructor(private route:ActivatedRoute, private twitterService:TwitterService) {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log(this.id);
    });
  }

  ngOnInit() {
  }

  postTweet($event){
    $event.preventDefault();
    console.log(this.text);
    if(this.text){
      this.twitterService.postTweet(this.text).subscribe(data =>{
          this.text='';
        });
    }
  }

}


