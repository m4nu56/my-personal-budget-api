import { Container } from 'typedi';
import LoggerInstance from '../../src/loaders/logger';
import ImportService from '../../src/services/ImportService';
import fs from 'fs';
import path from 'path';
import moment = require('moment');
import CategoryService from '../../src/services/CategoryService';

Container.set('logger', LoggerInstance);
Container.set(CategoryService, CategoryService);

describe('ImportService', () => {
  test('import a csv', async () => {
    // const csv = 'type,part\nunicorn,horn\nrainbow,pink';
    const filePath = path.join(__dirname, '../assets/bnp.csv');
    const csv = await fs.readFileSync(filePath).toString();
    let movements = await Container.get(ImportService).fromCsv(csv);
    expect(movements.length > 0).toBeTruthy();
    movements.forEach(movement => {
      expect(typeof movement.year).toBe('number');
      expect(typeof movement.month).toBe('number');
      expect(moment(movement.date).isValid()).toBeTruthy();
      expect(typeof movement.label).toBe('string');
      expect(typeof movement.amount).toBe('number');
    });
  }, 30000);
});
