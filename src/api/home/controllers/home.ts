// src/controllers/helloController.ts
import { Request, Response } from 'express';

export const sayHello = (req: Request, res: Response): void => {
  res.send('Halo, dunia!');
};

export const sayHelloToName = (req: Request, res: Response): void => {
  const { name } = req.params;
  res.send(`Halo, ${name}!`);
};
