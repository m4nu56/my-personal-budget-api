import { NextFunction, Request, Response, Router } from 'express';
import MovementService from '../../services/MovementService';
import { Container } from 'typedi';

const route = Router();

export default (app: Router) => {
  app.use('/movements', route);

  route.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, pageSize = 100, sort } = req.query;
      let movements = await Container.get(MovementService).getMovements({ page, pageSize, sort });
      return res.send(movements);
    } catch (e) {
      console.error(e);
      next(e);
    }
  });

  route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movement = await Container.get(MovementService).getMovementById(Number.parseInt(req.params.id));
      return res.status(200).send(movement);
    } catch (e) {
      console.error(e);
      next(e);
    }
  });

  route.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movement = await Container.get(MovementService).create(req.body);
      return res.status(201).send(movement);
    } catch (e) {
      console.error(e);
      next(e);
    }
  });

  route.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Container.get(MovementService).delete(Number.parseInt(req.params.id));
      return res.status(200).send();
    } catch (e) {
      console.error(e);
      next(e);
    }
  });

  route.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movement = await Container.get(MovementService).update(Number.parseInt(req.params.id), req.body);
      return res.status(200).send(movement);
    } catch (e) {
      console.error(e);
      next(e);
    }
  });
};
