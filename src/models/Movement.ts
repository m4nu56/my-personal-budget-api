import { DataTypes, Model, Sequelize } from 'sequelize';
import config from '../config';
import { Category } from './Category';

export interface MovementAttributes {
  id?: number;
  year?: number;
  month?: number;
  date: Date;
  amount: number;
  label?: string;
  categoryId: number;
  createdAt?: Date;
  updatedAt?: Date;
  category?: Category;
}

export default class Movement extends Model implements MovementAttributes {
  public id!: number;
  public year!: number;
  public month!: number;
  public date!: Date;
  public amount!: number;
  public label?: string;
  public categoryId!: number;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  public category?: Category;
}

const sequelize = new Sequelize(config.database.url, config.database.options);
Movement.init(
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    year: {
      type: DataTypes.INTEGER,
    },
    month: {
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.DATE,
    },
    amount: {
      type: DataTypes.NUMBER,
    },
    label: {
      type: DataTypes.STRING,
    },
    categoryId: {
      type: DataTypes.BIGINT,
      field: 'id_category',
    },
  },
  {
    sequelize: sequelize,
    tableName: 't_movement',
    underscored: true,
    // defaultScope: {
    //   include: [
    //     {
    //       model: Category,
    //       as: 'category',
    //     },
    //   ],
    // },
  },
);

Movement.belongsTo(Category, {
  foreignKey: 'id_category',
  as: 'category',
});
