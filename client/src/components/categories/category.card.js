import React from 'react'
import {
  Edit, SimpleForm, TextInput, NumberInput, DisabledInput,
  required
} from 'react-admin'

import withStyles from '@material-ui/core/styles/withStyles'

const styles = {
  // flexWrap: 'wrap', flexFlow: 'row wrap', justifyContent: 'space-around'
  // flexContainer: { display: 'flex', flexWrap: 'wrap' },
  flexContainer: { },
  flexItem: { display: 'inline-flex', marginRight: '1rem', flex: '1 1 40%' }
}

export const CategoryCard = withStyles(styles)(({ classes, ...props }) => (
  <Edit title={<ItemTitle title='Collectivité' subItems='libelle' />} {...props}>
    <SimpleForm>
      <NumberInput source='id' label='ID' />
      <TextInput source='name' validate={required()} />
    </SimpleForm>
  </Edit>
))

export const ItemTitle = ({ record, title, subItems }) => {
  subItems = Array.isArray(subItems) ? subItems : Array(subItems)
  const itemsAsString = subItems.map(i => record[i]).join(' ')
  return <span>{`${title}: ${itemsAsString}`}</span>
}
