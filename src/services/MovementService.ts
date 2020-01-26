import 'reflect-metadata';
import Movement, { MovementAttributes } from '../models/Movement';
import { Inject, Service } from 'typedi';
import { Category } from '../models/Category';
import { Logger } from 'winston';
import PaginatedResult from '../types/PaginatedResult';
import StandardService from './core/StandardService';
import { IPaginationProps } from './core/IPaginationProps';
import { Op, QueryTypes, Sequelize } from 'sequelize';

import { MovementCategoryMonth } from '../models/MovementCategoryMonth';
import config from '../config';

@Service()
export default class MovementService extends StandardService {
  @Inject('logger')
  logger: Logger;

  async getMovements(params: IPaginationProps): Promise<PaginatedResult> {
    try {
      const { rows, count } = await Movement.findAndCountAll({ ...this.paginateAndSort(params) });
      return new PaginatedResult(rows, count);
    } catch (e) {
      this.logger.error(`getMovements() ${e}`);
      throw e;
    }
  }

  getMovementById(id: number): Promise<Movement> {
    try {
      return Movement.findByPk<Movement>(id, {
        include: [
          {
            model: Category,
            as: 'category',
          },
        ],
      });
    } catch (e) {
      this.logger.error(`getMovementById(${id})`, e);
      throw e;
    }
  }

  create(movement): Promise<Movement> {
    try {
      return Movement.create(movement);
    } catch (e) {
      this.logger.error(`create movement with ${movement} ${e}`);
      throw e;
    }
  }

  async update(id: number, movement): Promise<Movement> {
    try {
      await Movement.update<Movement>(
        {
          date: movement.date,
          year: movement.year,
          month: movement.month,
          amount: movement.amount,
          label: movement.label,
          categoryId: movement.categoryId,
        },
        { returning: true, where: { id: id } },
      );
      return this.getMovementById(id);
    } catch (e) {
      this.logger.error(`update movement with ${movement} ${e}`);
      throw e;
    }
  }

  delete(id: number): void {
    try {
      Movement.destroy({
        where: { id: id },
        cascade: true,
      });
    } catch (e) {
      this.logger.error(`delete movement with ${id} ${e}`);
      throw e;
    }
  }

  deleteRange(start: Date, end: Date): void {
    try {
      Movement.destroy({
        where: {
          date: {
            [Op.gte]: start,
            [Op.lte]: end,
          },
        },
        cascade: true,
      });
    } catch (e) {
      this.logger.error(`deleteRange movements with start=${start}, end=${end} ${e}`);
      throw e;
    }
  }

  findOrCreate(movement: MovementAttributes): Promise<Movement> {
    try {
      return Movement.findOrCreate<Movement>({
        defaults: movement,
        where: {
          [Op.or]: [
            { fitId: movement.fitId ? movement.fitId : 0 },
            {
              date: {
                [Op.eq]: movement.date,
              },
              amount: movement.amount,
              label: movement.label,
            },
          ],
        },
      }).then(([movement, created]) => {
        if (created) {
          this.logger.info(`new movement created`);
        } else {
          this.logger.warn(
            `movement already exists: date: ${movement.date}, amount: ${movement.amount}, label: ${movement.label}. It was not created`,
          );
        }
        return movement;
      });
    } catch (e) {
      this.logger.error(`findOrCreate(${movement}): ${e}`);
      throw e;
    }
  }

  async analyzeMovementByMonthByCategory(): Promise<MovementCategoryMonth[]> {
    const sequelize = new Sequelize(config.database.url, config.database.options);

    const movements = (await sequelize.query(
      `select year, month, id_category as "categoryId", round(sum(amount)::numeric, 2)::numeric as total
           from t_movement
           group by year, month, id_category
           order by year, month, id_category`,
      {
        type: QueryTypes.SELECT,
        model: MovementCategoryMonth,
        mapToModel: false,
      },
    )) as MovementCategoryMonth[];

    // yeah.. had to add an awfull cast here to have my string total returned as number..
    movements.forEach(movement => (movement.total = Number(movement.total)));

    return movements;
  }

  async analyzeMovement(): Promise<any> {
    const movements = await this.analyzeMovementByMonthByCategory();
    // const dictionary = _.groupBy<MovementCategoryMonth>(movements, 'categoryId');

    let summary = [];
    movements.forEach(row => {
      if (!summary.find(s => s.category === row.categoryId)) {
        summary.push({
          category: row.categoryId,
          data: [],
        });
      }
      summary.find(s => s.category === row.categoryId).data.push(row);
    });

    return summary;
  }
}
