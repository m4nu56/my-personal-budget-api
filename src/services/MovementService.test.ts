import { Container } from 'typedi';
import MovementService from './MovementService';
import LoggerInstance from '../loaders/logger';
import Movement from '../models/Movement';
import { create } from 'domain';
import { createCategory } from './CategoryService.test';

Container.set('logger', LoggerInstance);

let category;
beforeAll(async () => {
  category = await createCategory();
});

async function createMovement() {
  let movementService = Container.get(MovementService);
  return await movementService.create({
    amount: 12,
    date: new Date(),
    label: 'toto',
    categoryId: category.id,
  });
}

describe('MovementService', () => {
  test('get all movements', async () => {
    let m = await createMovement();
    const paginatedResult = await Container.get(MovementService).getMovements();
    const movements = paginatedResult.data;
    expect(movements.length > 0).toBeTruthy();
  });

  test('get existing movement by id', async () => {
    const m = await createMovement();
    let movement = await Container.get(MovementService).getMovementById(m.id);
    expect(movement).not.toBeNull();
  });

  test('get non-existing movement by id should return null', async () => {
    const m = await Container.get(MovementService).getMovementById(0);
    expect(m).toBeNull();
  });

  test('creates a new movement', async () => {
    const movement = await createMovement();
    expect(movement.amount).toEqual(12);
  });

  test('updates a movement with a sequelize object', async () => {
    let movement = await createMovement();
    movement.label = 'cool';
    const m2 = await Container.get(MovementService).update(movement.id, movement);
    expect(m2.label).toEqual(movement.label);
  });

  test('updates a movement with an object', async () => {
    const movement = await createMovement();
    const categoryB = await createCategory();
    const m2 = await Container.get(MovementService).update(movement.id, {
      id: movement.id,
      date: '2019-12-15',
      year: 2019,
      month: 12,
      amount: 15,
      label: 'newLabel',
      categoryId: categoryB.id,
    });
    expect(m2.id).toEqual(movement.id);
    expect(m2.date).toEqual('2019-12-15');
    expect(m2.year).toEqual(2019);
    expect(m2.month).toEqual(12);
    expect(m2.amount).toEqual(15);
    expect(m2.label).toEqual('newLabel');
    expect(m2.categoryId).toEqual(categoryB.id);
  });

  test('deletes a movement', async () => {
    let movement = await createMovement();
    await Container.get(MovementService).delete(movement.id);
    const mDeleted = await Container.get(MovementService).getMovementById(movement.id);
    expect(mDeleted).toBeNull();
  });
});
