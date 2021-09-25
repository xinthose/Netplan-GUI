import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WifiComponent } from './wifi.component';

describe('WifiComponent', () => {
  let component: WifiComponent;
  let fixture: ComponentFixture<WifiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WifiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WifiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
