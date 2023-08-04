import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalNewComponent } from './terminal-new.component';

describe('TerminalNewComponent', () => {
  let component: TerminalNewComponent;
  let fixture: ComponentFixture<TerminalNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminalNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
