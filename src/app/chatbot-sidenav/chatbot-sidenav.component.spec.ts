import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotSidenavComponent } from './chatbot-sidenav.component';

describe('ChatbotSidenavComponent', () => {
  let component: ChatbotSidenavComponent;
  let fixture: ComponentFixture<ChatbotSidenavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatbotSidenavComponent]
    });
    fixture = TestBed.createComponent(ChatbotSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
