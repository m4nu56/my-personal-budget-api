import { Container } from 'typedi';
import LoggerInstance from '../../src/loaders/logger';
import ImportService from '../../src/services/ImportService';
import fs from 'fs';
import path from 'path';
import moment = require('moment');
import MovementService from '../../src/services/MovementService';

Container.set('logger', LoggerInstance);

afterAll(async () => {
  await Container.get(MovementService).deleteRange(moment('1900-01-01').toDate(), moment('2900-01-01').toDate());
});

describe('ImportService', () => {
  test('import a csv', async () => {
    // GIVEN
    // const csv = 'type,part\nunicorn,horn\nrainbow,pink';
    const filePath = path.join(__dirname, '../assets/bnp_tests.csv');
    const csv = await fs.readFileSync(filePath).toString();

    // WHEN
    let movements = await Container.get(ImportService).fromCsv(csv);

    // THEN
    expect(movements.length > 0).toBeTruthy();
    movements.forEach(movement => {
      expect(typeof movement.year).toBe('number');
      expect(typeof movement.month).toBe('number');
      expect(moment(movement.date).isValid()).toBeTruthy();
      expect(typeof movement.label).toBe('string');
      expect(typeof movement.amount).toBe('number');
      expect(typeof movement.categoryId).not.toBeNull();
    });
  }, 30000);
});
