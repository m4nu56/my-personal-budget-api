import Movement from '../models/Movement';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import neatCsv from 'neat-csv';
import moment from 'moment';
import currencyFormatter from 'currency-formatter';
import { Category } from '../models/Category';
import CategoryService from './CategoryService';

@Service()
export default class ImportService {
  @Inject('logger')
  logger: Logger;

  categoryService: CategoryService = new CategoryService();

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
        // mapHeaders: ({ header, index }) => header.toLowerCase(),
        mapValues: ({ header, index, value }) => value.toLowerCase(),
        skipLines: 2,
      });
      this.logger.info(rows);
      //=> [{type: 'unicorn', part: 'horn'}, {type: 'rainbow', part: 'pink'}]

      return Promise.all(rows.map(row => this.convertCsvRowToMovement(row)));
    } catch (e) {
      this.logger.error(`import fromCsv ${e}`);
      throw e;
    }
  }

  async convertCsvRowToMovement(row: neatCsv.Row): Promise<Movement> {
    const category = await this.findCategoryByName(row.category);
    return new Movement({
      year: parseInt(row.year),
      month: this.monthConverter(row.month),
      date: moment(row.date, 'DD/MM/YYYY'),
      amount: currencyFormatter.unformat(row.amount, { code: 'EUR' }),
      label: row.label,
      category: category,
      categoryId: category.id,
    }).save();
  }

  async findCategoryByName(name: string): Promise<Category> {
    return await this.categoryService.findCategoryByNameOrCreate(name);
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
    throw new Error(`month: ${month} not found in associative array: ${months}`);
  }
}
