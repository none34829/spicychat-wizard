// Character data interface
export interface ConversationExchange {
  user: string;
  character: string;
}

export interface CharacterData {
  name: string;
  title: string;
  persona: string;
  greeting: string;
  scenario: string;
  exampleConversation: ConversationExchange[];
  [key: string]: string | ConversationExchange[];
}

// Response structure for API endpoints
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: any;
}