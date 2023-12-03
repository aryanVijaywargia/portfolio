import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSubmitButtonComponent } from './card-submit-button.component';

describe('CardSubmitButtonComponent', () => {
  let component: CardSubmitButtonComponent;
  let fixture: ComponentFixture<CardSubmitButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardSubmitButtonComponent]
    });
    fixture = TestBed.createComponent(CardSubmitButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
