// The options are hardcoded, because I cannot load them from env.
// eslint-disable-next-line import/prefer-default-export
export const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:4173', 'http://localhost:3000', 'https://meishi.fly.dev'], // TODO
  credentials: true,
};
