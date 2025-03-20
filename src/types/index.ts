// Character data interface
export interface CharacterData {
    name: string;
    title: string;
    persona: string;
    greeting: string;
    scenario: string;
    exampleConversation: string;
    [key: string]: string;
  }
  
  // Response structure for API endpoints
  export interface ApiResponse<T = any> {
    status: 'success' | 'error';
    message?: string;
    data?: T;
    errors?: any;
  }