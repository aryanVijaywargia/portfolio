import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroTerminalComponent } from './hero-terminal.component';

describe('HeroTerminalComponent', () => {
  let component: HeroTerminalComponent;
  let fixture: ComponentFixture<HeroTerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeroTerminalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
