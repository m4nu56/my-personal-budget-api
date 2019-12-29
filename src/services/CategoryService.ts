import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import { Category } from '../models/Category';
import PaginatedResult from '../types/PaginatedResult';
import Sequelize from 'sequelize';

@Service()
export default class CategoryService {
  @Inject('logger')
  logger: Logger;

  async getCategories(): Promise<PaginatedResult> {
    try {
      const categories = await Category.findAll();
      return new PaginatedResult(categories);
    } catch (e) {
      this.logger.error(`getCategories() ${e}`);
      throw e;
    }
  }

  getCategoryById(id: number): Promise<Category> {
    try {
      return Category.findByPk<Category>(id);
    } catch (e) {
      this.logger.error(`getCategoryById(${id})`, e);
      throw e;
    }
  }

  create(category): Promise<Category> {
    try {
      return Category.create(category);
    } catch (e) {
      this.logger.error(`create category with ${category} ${e}`);
      throw e;
    }
  }

  async update(id: number, category): Promise<Category> {
    try {
      await Category.update<Category>(
        {
          name: category.name,
          parentId: category.parentId,
        },
        { returning: true, where: { id: id } },
      );
      return this.getCategoryById(id);
    } catch (e) {
      this.logger.error(`update category with ${category} ${e}`);
      throw e;
    }
  }

  delete(id: number): void {
    try {
      Category.destroy({
        where: { id: id },
        cascade: true,
      });
    } catch (e) {
      this.logger.error(`delete category with ${id} ${e}`);
      throw e;
    }
  }

  findCategoryByName(name: string): Promise<Category> {
    try {
      return Category.findOne<Category>({
        where: {
          name: {
            [Sequelize.Op.iLike]: name,
          },
        },
      });
    } catch (e) {
      this.logger.error(`findCategoryByName(${name})`, e);
      throw e;
    }
  }

  findCategoryByNameOrCreate(name: string): Promise<Category> {
    try {
      return Category.findOrCreate<Category>({
        where: { name: name },
      }).then(([category, created]) => {
        if (created) {
          this.logger.info(`new category created: ${name}`);
        }
        return category;
      });
    } catch (e) {
      this.logger.error(`findCategoryByName(${name})`, e);
      throw e;
    }
  }
}
