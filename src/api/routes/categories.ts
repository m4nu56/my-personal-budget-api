import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import CategoryService from '../../services/CategoryService';

const route = Router();

export default (app: Router) => {
  app.use('/categories', route);

  route.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, pageSize = 100, sort } = req.query;
      let categories = await Container.get(CategoryService).getCategories({ page, pageSize, sort });
      return res.send(categories);
    } catch (e) {
      console.error(e);
      next(e);
    }
  });

  route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await Container.get(CategoryService).getCategoryById(Number.parseInt(req.params.id));
      return res.status(200).send(category);
    } catch (e) {
      console.error(e);
      next(e);
    }
  });

  route.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await Container.get(CategoryService).create(req.body);
      return res.status(201).send(category);
    } catch (e) {
      console.error(e);
      next(e);
    }
  });

  route.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Container.get(CategoryService).delete(Number.parseInt(req.params.id));
      return res.status(200).send();
    } catch (e) {
      console.error(e);
      next(e);
    }
  });

  route.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await Container.get(CategoryService).update(Number.parseInt(req.params.id), req.body);
      return res.status(200).send(category);
    } catch (e) {
      console.error(e);
      next(e);
    }
  });
};
