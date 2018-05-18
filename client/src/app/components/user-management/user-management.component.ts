import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  mid: string;

  constructor(private route:ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.mid = params['mid'];
    });
  }


  ngOnInit() {
  }

}
