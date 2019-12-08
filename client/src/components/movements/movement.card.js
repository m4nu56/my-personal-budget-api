import React from 'react'
import {
  Edit, SimpleForm, TextInput, NumberInput, ReferenceField, TextField,
  required, Datagrid, ReferenceInput, SelectInput
} from 'react-admin'

import withStyles from '@material-ui/core/styles/withStyles'

const styles = {
  // flexWrap: 'wrap', flexFlow: 'row wrap', justifyContent: 'space-around'
  // flexContainer: { display: 'flex', flexWrap: 'wrap' },
  flexContainer: { },
  flexItem: { display: 'inline-flex', marginRight: '1rem', flex: '1 1 40%' }
}

export const MovementCard = withStyles(styles)(({ classes, ...props }) => (
  <Edit title={<ItemTitle title='Collectivité' subItems='libelle' />} {...props}>
    <SimpleForm>
      <NumberInput source='id' label='ID' />
      <TextInput source='year' validate={required()} />
      <TextInput source='month' validate={required()} />
      <TextInput source='date' validate={required()} />
      <TextInput source='amount' validate={required()} />
      <TextInput source='label' />
      <ReferenceInput label='Catégorie' source='category_id' reference='categories'>
        <SelectInput optionText='name' />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
))

export const ItemTitle = ({ record, title, subItems }) => {
  subItems = Array.isArray(subItems) ? subItems : Array(subItems)
  const itemsAsString = subItems.map(i => record[i]).join(' ')
  return <span>{`${title}: ${itemsAsString}`}</span>
}
