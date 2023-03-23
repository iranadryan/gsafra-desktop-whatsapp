const baseURL = process.env.WHATSAPP_API_BASE_URL || 'http://localhost:3333';
const instanceKey = process.env.WHATSAPP_API_INSTANCE || 'iran';

export const sendTextMessageURL = `${baseURL}/message/text?key=${instanceKey}`;
