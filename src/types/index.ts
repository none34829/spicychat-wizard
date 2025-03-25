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
  relationship: string;
  exampleConversation: ConversationExchange[];
  originalDescription: string;
  [key: string]: string | ConversationExchange[];
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: any;
}