import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkModeNavComponent } from './dark-mode-nav.component';

describe('DarkModeNavComponent', () => {
  let component: DarkModeNavComponent;
  let fixture: ComponentFixture<DarkModeNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DarkModeNavComponent]
    });
    fixture = TestBed.createComponent(DarkModeNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
