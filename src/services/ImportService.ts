import 'reflect-metadata';
import Movement from '../models/Movement';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import neatCsv from 'neat-csv';
import moment from 'moment';
import currencyFormatter from 'currency-formatter';
import CategoryService from './CategoryService';
import MovementService from './MovementService';
import * as fs from 'fs';

@Service()
export default class ImportService {
  @Inject('logger')
  private readonly logger: Logger;

  @Inject()
  private readonly categoryService: CategoryService;

  @Inject()
  private readonly movementService: MovementService;

  async fromCsvPath(csvPath: string): Promise<Movement[]> {
    fs.readFile(csvPath, { encoding: 'UTF8' }, (error, data) => {
      if (error) {
        throw error;
      }
      console.log(data);
      return this.fromCsv(data);
    });
    return null;
  }

  async fromCsv(csv: string): Promise<Movement[]> {
    try {
      let rows = await neatCsv(csv, {
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

      return Promise.all(rows.map(row => this.convertCsvRowToMovement(row)));
    } catch (e) {
      this.logger.error(`import fromCsv ${e}`);
      throw e;
    }
  }

  async convertCsvRowToMovement(row: neatCsv.Row): Promise<Movement> {
    const category = await this.categoryService.findCategoryByNameOrCreate(row.category);
    try {
      return await this.movementService.findOrCreate({
        year: parseInt(row.year),
        month: this.monthConverter(row.month),
        date: moment(row.date, 'DD/MM/YYYY').toDate(),
        amount: currencyFormatter.unformat(row.amount, { code: 'EUR' }),
        label: row.label,
        category: category,
        categoryId: category.id,
      });
    } catch (e) {
      this.logger.error(
        `Error findOrCreate movement ${Object.entries(row)
          .map(entry => `[${entry[0]}:${entry[1]}]`)
          .join(',')}: ${e.message}`,
      );
      throw e;
    }
  }

  monthConverter(month: string): number {
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
  }
}
