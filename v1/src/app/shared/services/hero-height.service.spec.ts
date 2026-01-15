import { TestBed } from '@angular/core/testing';

import { HeroHeightService } from './hero-height.service';

describe('HeroHeightService', () => {
  let service: HeroHeightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroHeightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
