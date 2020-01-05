import 'reflect-metadata';
import Movement from '../models/Movement';
import { Inject, Service } from 'typedi';
import { Category } from '../models/Category';
import { Logger } from 'winston';
import PaginatedResult from '../types/PaginatedResult';
import StandardService from './core/StandardService';
import { IPaginationProps } from './core/IPaginationProps';

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
}
