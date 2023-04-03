const baseURL = process.env.WHATSAPP_API_BASE_URL || 'https://whatsapp-nodejs-api.onrender.com';
const instanceKey = process.env.WHATSAPP_API_INSTANCE || 'iran_teste';

export const sendTextMessageURL = `${baseURL}/message/text?key=${instanceKey}`;

export const initInstanceURL = `${baseURL}/instance/init?key=${instanceKey}&token=COYOTE_DEV`;
export const instanceInfoURL = `${baseURL}/instance/info?key=${instanceKey}`;
export const logoutInstanceURL = `${baseURL}/instance/logout?key=${instanceKey}`;
export const deleteInstanceURL = `${baseURL}/instance/delete?key=${instanceKey}`;

export const generateQrcodeURL = `${baseURL}/instance/qrbase64?key=${instanceKey}`;
