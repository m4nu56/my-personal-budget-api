import { Container } from 'typedi';
import LoggerInstance from '../../src/loaders/logger';
import ImportService from '../../src/services/ImportService';
import MovementService from '../../src/services/MovementService';
import PaginatedResult from '../../src/types/PaginatedResult';
import moment = require('moment');

Container.set('logger', LoggerInstance);

afterAll(async () => {
  await Container.get(MovementService).deleteRange(moment('1900-01-01').toDate(), moment('2900-01-01').toDate());
});

describe('ImportService', () => {
  test('Save a MovementAttribute to database', async () => {
    // WHEN
    let movements = await Container.get(ImportService).findOrCreateMovements([
      {
        year: 2019,
        month: 1,
        date: new Date(2019, 0, 15),
        label: 'Coco',
        amount: 15.55,
        categoryId: 1,
      },
      {
        year: 2020,
        month: 12,
        date: new Date(2020, 10, 15),
        label: 'Byebye',
        amount: 17,
        categoryId: 1,
      },
    ]);

    // THEN
    expect(movements.length).toEqual(2);
    movements.forEach(movement => {
      expect(typeof movement.year).toBe('number');
      expect(typeof movement.month).toBe('number');
      expect(moment(movement.date).isValid()).toBeTruthy();
      expect(typeof movement.label).toBe('string');
      expect(typeof movement.amount).toBe('number');
      expect(typeof movement.categoryId).not.toBeNull();
    });
    const movementsDB: PaginatedResult = await Container.get(MovementService).getMovements({ page: 1, pageSize: 2 });
    expect(movementsDB.data.length).toEqual(2);
    expect(movementsDB.total).toEqual(2);
    expect(movementsDB.data[0].year).toEqual(2019);
    expect(movementsDB.data[0].month).toEqual(1);
    expect(movementsDB.data[0].date).toEqual('2019-01-15');
    expect(movementsDB.data[0].label).toEqual('Coco');
    expect(movementsDB.data[0].amount).toEqual(15.55);
    expect(movementsDB.data[0].categoryId).toEqual(1);
  });
});
