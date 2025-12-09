const OpenAI = require('openai');

// Initialize OpenAI client
// Note: In a real scenario, you would use process.env.OPENAI_API_KEY and process.env.OPENAI_BASE_URL
// For this demo, we'll assume these are set in .env
const client = new OpenAI({
  apiKey: process.env.ARK_API_KEY,
  baseURL: process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3',
});

// Helper to strip HTML tags
const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
};

exports.analyzeTags = async (content) => {
  try {
    const cleanContent = stripHtml(content);
    const completion = await client.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant that extracts tags from text. Return only a JSON array of strings, e.g. ["tag1", "tag2"]. Max 3 tags.' },
        { role: 'user', content: `Extract tags from this content: ${cleanContent}` }
      ],
      model: process.env.ARK_MODEL_ID,
    });

    const tagsString = completion.choices[0].message.content;
    // Simple parsing, might need more robustness in production
    try {
        // Find the first '[' and last ']' to extract JSON array
        const start = tagsString.indexOf('[');
        const end = tagsString.lastIndexOf(']');
        if (start !== -1 && end !== -1) {
            return JSON.parse(tagsString.substring(start, end + 1));
        }
        return [];
    } catch (e) {
        console.error('Error parsing tags:', e);
        return [];
    }
  } catch (error) {
    console.error('AI Error:', error);
    return []; // Return empty tags on error to not block posting
  }
};

exports.recommendTopic = async (req, res) => {
    try {
        const { content } = req.body;
        const cleanContent = stripHtml(content);
        
        if (!cleanContent) {
            return res.json({ topic: '' });
        }

        const completion = await client.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a helpful assistant. Recommend a relevant topic (hashtag) for the given content. Return only the topic string without #.' },
                { role: 'user', content: `Recommend a topic for: ${cleanContent}` }
            ],
            model: process.env.ARK_MODEL_ID,
        });
        
        res.json({ topic: completion.choices[0].message.content.trim() });
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ message: 'AI service unavailable' });
    }
}
