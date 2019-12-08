import React from 'react'
import { Admin, ListGuesser, Resource } from 'react-admin'
import dataProvider from './providers/dataProvider'
import { MovementCard } from './components/movements/movement.card'
import { CategoryCard } from './components/categories/category.card'
import { MovementList } from './components/movements/movements.list'
import Dashboard from './pages/Dashboard'
import watchAll from './sagas/api-saga'
import rootReducer from './reducers'

const App = () => <Admin dataProvider={dataProvider} dashboard={Dashboard}
                         customSagas={[watchAll]}
                         customReducers={{ rootReducer }}>
  <Resource name="movements" list={MovementList} edit={MovementCard}/>
  <Resource name="categories" list={ListGuesser} edit={CategoryCard}/>
</Admin>

export default App
