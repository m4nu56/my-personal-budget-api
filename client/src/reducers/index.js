import { DASHBOARD_DATA } from '../constants/actions'

const initialState = {
  dashboardData: []
}

// Redux reducer added to the react-admin project.
// On peut ajouter nos propres reducer pour nos propres actions métier synchrones ici
// Pour les asynchrones on utilisera les sagas
function rootReducer (previousState = initialState, action) {
  if (action.type === DASHBOARD_DATA) {
    let newState = Object.assign({}, previousState, {
      dashboardData: action.payload
    })
    console.log('DASHBOARD_DATA from, to', previousState, newState)
    return newState
  }

  return previousState
}

export default rootReducer
