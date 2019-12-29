import { NextFunction, Request, Response, Router } from 'express';
import MovementService from '../../services/MovementService';
import { Container } from 'typedi';

const route = Router();

export default (app: Router) => {
  app.use('/movements', route);

  route.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, pageSize } = req.query;
      let movements = await Container.get(MovementService).getMovements({ page, pageSize });
      return res.send(movements);
    } catch (e) {
      console.error(e);
      next(e);
    }
  });

  route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movement = await Container.get(MovementService).getMovementById(req.params.id);
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
      await Container.get(MovementService).delete(req.params.id);
      return res.status(200).send();
    } catch (e) {
      console.error(e);
      next(e);
    }
  });

  route.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const movement = await Container.get(MovementService).update(req.params.id, req.body);
      return res.status(200).send(movement);
    } catch (e) {
      console.error(e);
      next(e);
    }
  });
};
