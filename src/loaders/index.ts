import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import Logger from './logger';

require('pg').defaults.parseInt8 = true; // to force pg bigint to be returned as number by sequelize

export default async ({ expressApp }) => {
  const dbConnection = {};
  Logger.info('✌️ DB not yet loaded and connected!');

  /**
   * WTF is going on here?
   *
   * We are injecting the mongoose models into the DI container.
   * I know this is controversial but will provide a lot of flexibility at the time
   * of writing unit tests, just go and check how beautiful they are!
   */

  const movementModel = {
    name: 'movementModel',
    model: require('../models/Movement').default,
  };

  // It returns the agenda instance because it's needed in the subsequent loaders
  await dependencyInjectorLoader({
    mongoConnection: dbConnection,
    models: [
      movementModel,
      // salaryModel,
      // whateverModel
    ],
  });
  Logger.info('✌️ Dependency Injector loaded');

  // await jobsLoader({ agenda });
  // Logger.info('✌️ Jobs loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
