const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    const { prompt } = JSON.parse(event.body);
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, response: data.choices[0].message.content })
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false, error: 'Nessuna risposta generata' })
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
