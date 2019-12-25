import { DataTypes, Model, Sequelize } from 'sequelize';
import config from '../config';

export class Category extends Model {
  public id!: number;
  public name: string;
  public idParent!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const sequelize = new Sequelize(config.databaseURL);

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parentId: {
      type: DataTypes.INTEGER,
      field: 'id_parent',
    },
  },
  {
    sequelize: sequelize,
    tableName: 't_category',
    underscored: true,
  },
);
