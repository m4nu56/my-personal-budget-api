import currencyFormatter from 'currency-formatter';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import { MovementAttributes } from '../../models/Movement';
import * as fs from 'fs';
import neatCsv from 'neat-csv';
import moment from 'moment';
import CategoryService from '../CategoryService';

@Service()
export default class OfxParser {
  @Inject('logger')
  private readonly logger: Logger;

  @Inject()
  private readonly categoryService: CategoryService;

  parseFile = async (csvPath: string): Promise<MovementAttributes[]> =>
    new Promise((resolve, reject) => {
      fs.readFile(csvPath, { encoding: 'UTF8' }, (error, data) => {
        if (error) {
          reject(error);
        }
        resolve(this.fromCsv(data));
      });
    });

  private fromCsv = async (csv: string): Promise<MovementAttributes[]> => {
    try {
      const rows: neatCsv.Row[] = await neatCsv(csv, {
        headers: [
          'year',
          'month',
          'date',
          'category',
          'label',
          'amount',
          'cash',
          'liters',
          'km',
          'ecart_km',
          'consommation',
          'decompte_mutuelle',
          'cpam',
          'mutuelle',
          'reste_a_charge',
        ],
        mapValues: ({ value }) => value.toLowerCase(),
        skipLines: 2,
      });

      return Promise.all(rows.map(row => this.createMovementFromCsvRow(row)));
    } catch (e) {
      this.logger.error(`import fromCsv ${e}`);
      throw e;
    }
  };

  private createMovementFromCsvRow = async (row: neatCsv.Row): Promise<MovementAttributes> => {
    try {
      const category = await this.categoryService.findCategoryByNameOrCreate(row.category);
      return {
        year: parseInt(row.year),
        month: this.monthConverter(row.month),
        date: moment(row.date, 'DD/MM/YYYY').toDate(),
        amount: currencyFormatter.unformat(row.amount, { code: 'EUR' }),
        label: row.label,
        category: category,
        categoryId: category.id,
      };
    } catch (e) {
      this.logger.error(
        `Error mapping a movement from a row of the CSV: ${Object.entries(row)
          .map(entry => `[${entry[0]}:${entry[1]}]`)
          .join(',')}: ${e.message}`,
      );
      throw e;
    }
  };

  private monthConverter = (month: string): number => {
    const months = {
      'janv.': 1,
      'févr.': 2,
      mars: 3,
      'avr.': 4,
      mai: 5,
      juin: 6,
      'juil.': 7,
      août: 8,
      'sept.': 9,
      'oct.': 10,
      'nov.': 11,
      'déc.': 12,
    };
    if (months.hasOwnProperty(month)) {
      return months[month];
    }
    throw new Error(`month: "${month}" not found in associative object: "${Object.keys(months).join(',')}"`);
  };
}
