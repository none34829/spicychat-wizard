import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import { extractContentFromUrl, extractContentFromUrls } from '../services/exaService';

async function testExaService() {
  try {
    console.log('Testing Exa Service...');
    
    // Test single URL extraction
    console.log('Testing single URL extraction...');
    const url = 'https://en.wikipedia.org/wiki/Artificial_intelligence';
    const content = await extractContentFromUrl(url);
    console.log('Successfully extracted content length:', content.length);
    console.log('Content preview:', content.substring(0, 200) + '...');
    
    // Test multiple URL extraction
    console.log('\nTesting multiple URL extraction...');
    const urls = [
      'https://en.wikipedia.org/wiki/Artificial_intelligence',
      'https://en.wikipedia.org/wiki/Machine_learning'
    ];
    const results = await extractContentFromUrls(urls);
    console.log('Successfully extracted content from', results.length, 'URLs');
    
    for (const result of results) {
      console.log('- Title:', result.title);
      console.log('  URL:', result.url);
      console.log('  Content length:', result.text.length);
      if (result.summary) {
        console.log('  Summary length:', result.summary.length);
      }
      if (result.highlights && result.highlights.length > 0) {
        console.log('  First highlight:', result.highlights[0]);
      }
      console.log('');
    }
    
    console.log('Exa Service test completed successfully!');
  } catch (error) {
    console.error('Error testing Exa service:', error);
  }
}

// Run the test
testExaService(); 