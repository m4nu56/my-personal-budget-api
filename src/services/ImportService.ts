import 'reflect-metadata';
import Movement, { MovementAttributes } from '../models/Movement';
import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import CategoryService from './CategoryService';
import MovementService from './MovementService';
import CSVParser from './parser/CSVParser';
import OFXParser from './parser/OFXParser';

@Service()
export default class ImportService {
  @Inject('logger')
  private readonly logger: Logger;

  @Inject()
  private readonly categoryService: CategoryService;

  @Inject()
  private readonly CSVParser: CSVParser;

  @Inject()
  private readonly OFXParser: OFXParser;

  @Inject()
  private readonly movementService: MovementService;

  import = async ({ mimetype, path, originalname }): Promise<Movement[]> => {
    if (mimetype === 'text/csv') {
      return this.fromCSV(path);
    }
    if (mimetype === 'text/ofx') {
      return this.fromOFX(path);
    } else if (mimetype === 'application/octet-stream') {
      if (originalname.endsWith('.ofx')) {
        return this.fromOFX(path);
      }
    }
    throw new Error(`Error file format unkown for file: ${originalname} with mimetype: ${mimetype}`);
  };

  fromCSV = async (path: string): Promise<Movement[]> => {
    const movements = await this.CSVParser.parseFile(path);
    return this.findOrCreateMovements(movements);
  };

  fromOFX = async (path: string): Promise<Movement[]> => {
    const movements = await this.OFXParser.parseFile(path);
    return this.findOrCreateMovements(movements);
  };

  findOrCreateMovements = (movements: MovementAttributes[]): Promise<Movement[]> =>
    Promise.all(
      movements.map(movement => {
        return this.movementService.findOrCreate(movement).catch(e => {
          this.logger.error(
            `Error findOrCreateMovements with movement =
            ${Object.entries(movement)
              .map(entry => `[${entry[0]}:${entry[1]}]`)
              .join(',')}: ${e.message}`,
          );
          throw e;
        });
      }),
    );
}
