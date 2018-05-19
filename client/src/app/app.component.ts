import { Component } from '@angular/core';
import {TaskService} from "./services/task.service";
import {UserService} from "./services/user.service";
import {AdminService} from "./services/admin.service";
import {ManagerService} from "./services/manager.service";
import {UsersManagementService} from "./services/users-management.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[TaskService, UserService, AdminService, ManagerService, UsersManagementService]
})
export class AppComponent {
}
