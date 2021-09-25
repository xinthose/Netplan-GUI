import { TestBed } from '@angular/core/testing';

import { NetplanGUIService } from './netplan-gui.service';

describe('NetplanGUIService', () => {
  let service: NetplanGUIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetplanGUIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
