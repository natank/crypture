import { Request, Response } from 'express';
import app from '../src/main';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: Request, res: Response) {
  return app(req, res);
}
