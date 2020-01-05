import 'reflect-metadata';
import Movement, { MovementAttributes } from '../models/Movement';
import { Inject, Service } from 'typedi';
import { Category } from '../models/Category';
import { Logger } from 'winston';
import PaginatedResult from '../types/PaginatedResult';
import StandardService from './core/StandardService';
import { IPaginationProps } from './core/IPaginationProps';
import Sequelize from 'sequelize';

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
            [Sequelize.Op.gte]: start,
            [Sequelize.Op.lte]: end,
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
          date: {
            [Sequelize.Op.eq]: movement.date,
          },
          amount: movement.amount,
          label: movement.label,
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
}
