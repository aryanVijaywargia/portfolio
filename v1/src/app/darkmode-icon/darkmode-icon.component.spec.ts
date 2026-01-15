import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkmodeIconComponent } from './darkmode-icon.component';

describe('DarkmodeIconComponent', () => {
  let component: DarkmodeIconComponent;
  let fixture: ComponentFixture<DarkmodeIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DarkmodeIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DarkmodeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
