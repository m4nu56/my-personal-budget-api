import { Container } from 'typedi';
import MovementService from './MovementService';
import LoggerInstance from '../loaders/logger';
import Movement from '../models/Movement';

Container.set('logger', LoggerInstance);

async function createMovement() {
  const movement = new Movement();
  movement.amount = 12;
  movement.date = new Date();
  movement.label = 'toto';
  movement.categoryId = 1;
  let movementService = Container.get(MovementService);
  const m = await movementService.create({
    amount: 12,
    date: new Date(),
    label: 'toto',
    categoryId: 1,
  });
  return m;
}

describe('MovementService', () => {
  test('get all movements', async () => {
    let movements = await Container.get(MovementService).getMovements();
    expect(movements.length > 0).toBeTruthy();
  });

  test('get existing movement by id', async () => {
    let movements = await Container.get(MovementService).getMovements();
    let movement = await Container.get(MovementService).getMovementById(movements[0].id);
    expect(movement).not.toBeNull();
  });

  test('get non-existing movement by id should return null', async () => {
    const m = await Container.get(MovementService).getMovementById(0);
    expect(m).toBeNull();
  });

  test('creates a new movement', async () => {
    const movement = new Movement();
    movement.amount = 12;
    movement.date = new Date();
    movement.label = 'toto';
    movement.categoryId = 1;
    const m = await Container.get(MovementService).create({
      amount: 12,
      date: new Date(),
      label: 'toto',
      categoryId: 1,
    });
    console.log('newMovement', m);
    expect(m.amount).toEqual(movement.amount);
  });

  test('updates a movement with a sequelize object', async () => {
    let movement = await createMovement();
    movement.label = 'cool';
    const m2 = await Container.get(MovementService).update(movement.id, movement);
    expect(m2.label).toEqual(movement.label);
  });

  test('updates a movement with an object', async () => {
    const movement = await createMovement();
    const m2 = await Container.get(MovementService).update(movement.id, {
      id: movement.id,
      date: '2019-12-15',
      year: 2019,
      month: 12,
      amount: 15,
      label: 'newLabel',
      categoryId: 2,
    });
    expect(m2.id).toEqual(movement.id);
    expect(m2.date).toEqual('2019-12-15');
    expect(m2.year).toEqual(2019);
    expect(m2.month).toEqual(12);
    expect(m2.amount).toEqual(15);
    expect(m2.label).toEqual('newLabel');
    expect(m2.categoryId).toEqual('2');
  });

  test('deletes a movement', async () => {
    let movement = await createMovement();
    await Container.get(MovementService).delete(movement.id);
    const mDeleted = await Container.get(MovementService).getMovementById(movement.id);
    expect(mDeleted).toBeNull();
  });
});
