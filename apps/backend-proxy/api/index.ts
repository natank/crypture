import app from '../src/main';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: any, res: any) {
  return (app as any)(req, res);
}
