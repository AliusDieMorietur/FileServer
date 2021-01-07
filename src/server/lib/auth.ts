import * as crypto from 'crypto';

const BYTE  = 256;
const TOKEN_LENGTH = 32;
const ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const ALPHA = ALPHA_UPPER + ALPHA_LOWER;
const DIGIT = '0123456789';
const ALPHA_DIGIT = ALPHA + DIGIT;

export const generateToken = () => {
  const base = ALPHA_DIGIT.length;
  const bytes = crypto.randomBytes(base);
  let key = '';
  for (let i = 0; i < TOKEN_LENGTH; i++) {
    const index = ((bytes[i] * base) / BYTE) | 0;
    key += ALPHA_DIGIT[index];
  }
  return key;
};


const parseCookies = cookie => {
  const values = {};
  const items = cookie.split(';');
  for (const item of items) {
    const parts = item.split('=');
    const key = parts[0].trim();
    const val = parts[1] || '';
    values[key] = val.trim();
  }
  return values;
};

// TODO to save addition info about session
const save = (token, context) => {
  const data = JSON.stringify(context);
  // db.update('Session', { data }, { token });
};

const restore = client => {
  // const cachedSession = cache.get(client.req);
  // if (cachedSession) return cachedSession;
  const { cookie } = client.req.headers;
  if (!cookie) return null;
  const cookies = parseCookies(cookie);
  // const { token } = cookies;
  // if (!token) return null;
  // let session = sessions.get(token);
  // if (!session) {
  //   const [record] = await db.select('Session', ['Data'], { token });
  //   if (record && record.data) {
  //     const data = JSON.parse(record.data);
  //     session = new Session(token, data);
  //     sessions.set(token, session);
  //   }
  // }
  // if (!session) return null;
  // cache.set(client.req, session);
  // return session;
};

const remove = (client, token) => {
  // const host = common.parseHost(client.req.headers.host);
  // client.res.setHeader('Set-Cookie', COOKIE_DELETE + host);
  // sessions.delete(token);
  // db.delete('Session', { token });
};

export const auth = client => {
  client.token = generateToken();
};