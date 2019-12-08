import { all, call, put, takeEvery } from 'redux-saga/effects'
import { SHOW_NOTIFICATION } from 'react-admin'
import { DASHBOARD, DASHBOARD_DATA } from '../constants/actions'
import { makeRequest } from '../api'

/**
 * Le default export du js qui permet de lancer la surveillance de toutes les actions liées aux appels API
 *
 * @returns {IterableIterator<AllEffect<SimpleEffect<"FORK", ForkEffectDescriptor>> | AllEffect<any> | *>}
 */
export default function * watchAll () {
  yield all([
    takeEvery(DASHBOARD, dashboardSaga)
  ])
}

/**
 * Appel API
 *
 * @returns {IterableIterator<*>}
 */
function * dashboardSaga () {
  try {
    const payload = yield call(makeRequest, 'analyze')
    yield put({ type: DASHBOARD_DATA, payload: payload })
  } catch (e) {
    // en cas d'erreur on affiche un message
    yield put({ type: SHOW_NOTIFICATION, payload: { message: `Erreur lors de la récupération du dashboard: ${e.message}`, type: 'error' } })
  }
}
