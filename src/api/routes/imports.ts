import { NextFunction, Response, Router } from 'express';
import { Container } from 'typedi';
import ImportService from '../../services/ImportService';
import multer from 'multer';
import MulterRequest from '../../types/MulterRequest';

const upload = multer({ dest: 'tmp/csv/' });

const route = Router();

export default (app: Router) => {
  app.use('/imports', route);

  route.post('/', upload.single('file'), async (req: MulterRequest, res: Response, next: NextFunction) => {
    try {
      const movements = await Container.get(ImportService).fromCsvPath(req.file.path);
      return res.status(201).send(movements);
    } catch (e) {
      console.error(e);
      next(e);
    }
  });
};
