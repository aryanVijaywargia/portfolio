import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoTerminalComponent } from './demo-terminal.component';

describe('DemoTerminalComponent', () => {
  let component: DemoTerminalComponent;
  let fixture: ComponentFixture<DemoTerminalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoTerminalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
