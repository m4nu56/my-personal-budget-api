import { Container } from 'typedi';
import LoggerInstance from '../../../src/loaders/logger';
import path from 'path';
import OFXParser from '../../../src/services/parser/OFXParser';
import moment = require('moment');

Container.set('logger', LoggerInstance);

afterAll(async () => {});

describe('OFXParser', () => {
  test('parse a .ofx file', async () => {
    // GIVEN
    const filePath = path.join(__dirname, '../../assets/ca_ofx_export_test.ofx');
    // WHEN
    let movements = await Container.get(OFXParser).parseFile(filePath);
    // THEN
    expect(movements.length).toEqual(3);
    movements.forEach(movement => {
      expect(movement.fitId).not.toBeNull();
      expect(movement.label).not.toBeNull();
      expect(typeof movement.amount).toBe('number');
      expect(moment(movement.date).isValid()).toBeTruthy();
    });

    expect(movements[0].fitId).toEqual('1234560390186');
    expect(movements[0].label).toEqual('XXXX  25/01 15H27');
    expect(movements[0].amount).toEqual(-50.0);
    expect(movements[0].date).toEqual(new Date(2020, 0, 25));
  });
});
