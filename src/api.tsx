import axios from 'axios';

export async function fetchEmails(query = '', account = '', to = '', from = '') {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (account) params.append('account', account);
  if (to) params.append('to', to);
  if (from) params.append('from', from);

  const res = await axios.get(`http://localhost:3000/api/search?${params.toString()}`);
  return res.data;
}
export async function classifyEmail(emailText: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:3000/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ emailText })
    });

    if (!response.ok) {
      console.error('Classification API error:', await response.text());
      return 'Uncategorized';
    }

    const data = await response.json();
    return data.classification || 'Uncategorized';
  } catch (error) {
    console.error('Error calling classify API:', error);
    return 'Uncategorized';
  }
}
export async function generateReply(emailText: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:3000/generate-reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emailText }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    // assuming API returns { reply: string }
    return data.reply || '';
  } catch (error) {
    console.error('Failed to generate reply:', error);
    return 'Error generating reply';
  }
}
