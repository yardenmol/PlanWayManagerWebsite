import { Component } from '@angular/core';
import {TaskService} from "./services/task.service";
import {UserService} from "./services/user.service";
import {TwitterService} from "./services/twitter.service";
import {AdminService} from "./services/admin.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[TaskService, UserService,TwitterService,AdminService]
})
export class AppComponent {
}
