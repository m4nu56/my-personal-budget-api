import { Container } from 'typedi';
import LoggerInstance from '../../../src/loaders/logger';
import path from 'path';
import CSVParser from '../../../src/services/parser/CSVParser';
import moment = require('moment');

Container.set('logger', LoggerInstance);

describe('CSVParser', () => {
  test('import a csv', async () => {
    // GIVEN
    // const csv = 'type,part\nunicorn,horn\nrainbow,pink';
    const filePath = path.join(__dirname, '../../assets/bnp_tests.csv');

    // WHEN
    let movements = await Container.get(CSVParser).parseFile(filePath);

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
  });
});
