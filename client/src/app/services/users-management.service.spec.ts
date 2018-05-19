import { TestBed, inject } from '@angular/core/testing';

import { UsersManagementService } from './users-management.service';

describe('UsersManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsersManagementService]
    });
  });

  it('should be created', inject([UsersManagementService], (service: UsersManagementService) => {
    expect(service).toBeTruthy();
  }));
});
