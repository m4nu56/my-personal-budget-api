import { Request, Response, Router } from 'express';
import {
  createMovement,
  deleteMovement,
  getMovementById,
  getMovements,
  updateMovement
} from '../../services/movementQueries';

const route = Router();

export default (app: Router) => {
  app.use('/movements', route);

  route.get('/', getMovements);
  route.get('/:id', getMovementById);
  route.post('/', createMovement);
  route.delete('/:id', deleteMovement);
  route.patch('/:id', updateMovement);
};
