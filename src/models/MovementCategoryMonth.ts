require('pg').defaults.parseInt8 = true; // to force pg bigint to be returned as number by sequelize
import { DataTypes, Model, Sequelize } from 'sequelize';
import config from '../config';

export class MovementCategoryMonth extends Model {
  public year: number;
  public month: number;
  public categoryId: number;
  public total: number;
}

const sequelize = new Sequelize(config.database.url, config.database.options);

MovementCategoryMonth.init(
  {
    year: {
      type: DataTypes.INTEGER,
    },
    month: {
      type: DataTypes.INTEGER,
    },
    categoryId: {
      type: DataTypes.BIGINT,
      field: 'id_category',
    },
    total: {
      type: DataTypes.NUMBER,
    },
  },
  {
    sequelize: sequelize,
  },
);
