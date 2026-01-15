import { TestBed } from '@angular/core/testing';

import { ChatbotToggleService } from './chatbot-toggle.service';

describe('ChatbotToggleService', () => {
  let service: ChatbotToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatbotToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
