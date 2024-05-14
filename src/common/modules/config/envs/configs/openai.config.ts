import { registerAs } from '@nestjs/config';

export default registerAs('openai', () => {
  return {
    secretKey: process.env.OPENAI_SECRET_KEY,
  };
});
