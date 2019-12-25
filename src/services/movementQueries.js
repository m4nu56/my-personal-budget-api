import { getPool } from './db-config';

/**
 * Retourne les totaux par année/mois/category de tous les mouvements en base
 */
export const analyzeMovementByMonthByCategory = () => {
  const query =
    'select year, month, id_category, round(sum(amount)::numeric, 2) as total\n' +
    'from t_movement\n' +
    'group by year, month, id_category\n' +
    'order by year, month, id_category\n';

  return getPool().query(query);
};
