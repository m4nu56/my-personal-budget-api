import Movement from '../../src/models/Movement';
import { Category } from '../../src/models/Category';

const buildRandomString = () => {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
};

describe('Sequilize basic testing', () => {
  test('can create a category then a movement ', async () => {
    let s = buildRandomString();
    const category = await Category.create({
      name: 'category ' + s,
      parentId: null,
    });
    const newMovement = await Movement.create({
      date: new Date(),
      amount: 12,
      label: 'toto',
      categoryId: category.id,
    });
    const movement = await Movement.findByPk(newMovement.id, {
      include: [
        {
          model: Category,
          as: 'category',
        },
      ],
    });
    console.log(movement.id);
    console.log(movement.category.id);
  });
});
