import { Router } from 'express';
import analyze from './routes/analyze';
import movements from './routes/movements';
import categories from './routes/categories';
import imports from './routes/imports';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  analyze(app);
  movements(app);
  categories(app);
  imports(app);

  return app;
};
