import { TestBed, inject } from '@angular/core/testing';

import { ClusteringService } from './clustering.service';

describe('ClusteringService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClusteringService]
    });
  });

  it('should be created', inject([ClusteringService], (service: ClusteringService) => {
    expect(service).toBeTruthy();
  }));
});
