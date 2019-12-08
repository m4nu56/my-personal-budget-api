import React, { useEffect, useState } from 'react'
import { Title } from 'react-admin'
import { useDispatch, useSelector } from 'react-redux'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import { DASHBOARD } from '../constants/actions'

const Dashboard = () => {

  const [count, setCount] = useState(0)
  // const ui = useSelector(state => state.ui)
  const dispatch = useDispatch()
  const dashboardData = useSelector(state => state.rootReducer.dashboardData)

  useEffect(() => {
    // Met à jour le titre du document via l’API du navigateur
    document.title = `Vous avez cliqué ${count} fois`
  })

  useEffect(() => dispatch({ type: DASHBOARD }), [])

  return (
    <Card>
      <Title title='Bienvenue'/>
      <CardHeader title='Tableau de bord'/>
      <CardContent>

        <p>Vous avez cliqué {count} fois</p>
        <button onClick={() => {
          setCount(count + 1)
        }}>
          Cliquez ici
        </button>

        <pre>{dashboardData.map(data => <li>{data.year} - {data.month} - {data.id_category} - {data.total}</li>)}</pre>

      </CardContent>
    </Card>
  )
}

export default Dashboard
