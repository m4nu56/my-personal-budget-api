import { NextFunction, Request, Response, Router } from 'express';
import { analyzeMovementByMonthByCategory } from '../../services/movementQueries';
const route = Router();

export default (app: Router) => {
  app.use('/analyze', route);

  route.get('/', async (request: Request, response: Response, next: NextFunction) => {
    try {
      const result = await analyzeMovementByMonthByCategory();
      response.status(200).send(result.rows);
    } catch (e) {
      next(e);
    }
  });

  route.get('/summary', async (request: Request, response: Response, next: NextFunction) => {
    try {
      const result = await analyzeMovementByMonthByCategory();

      let summary = [];
      result.rows.forEach(row => {
        if (!summary.find(s => s.category === row.id_category)) {
          summary.push({
            category: row.id_category,
            data: [],
          });
        }
        summary.find(s => s.category === row.id_category).data.push(row);
      });

      // let body = JSON.stringify(Array.from(summary.entries()));
      console.log(summary);
      response.status(200).json(summary);
    } catch (e) {
      next(e);
    }
  });
};
