import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    env: process.env.NODE_ENV,
    isProd: process.env.NODE_ENV === 'production',
    port: process.env.PORT,
  };
});
