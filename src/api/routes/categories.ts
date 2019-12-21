import { Request, Response, Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from '../../services/categoryQueries';

const route = Router();

export default (app: Router) => {
  app.use('/categories', route);

  route.get('/', getCategories);
  route.post('/', createCategory);
  route.delete('/:id', deleteCategory);
  route.patch('/:id', updateCategory);
  route.get('/:id', getCategoryById);
};
