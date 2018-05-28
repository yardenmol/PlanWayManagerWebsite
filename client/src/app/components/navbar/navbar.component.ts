import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  mid: string;
  constructor(private router: Router, private route:ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.mid = params['mid'];

    });
  }


  ngOnInit() {
  }

  }
