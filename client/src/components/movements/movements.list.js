import React from 'react'
import { Datagrid, DateField, List, NumberField, ReferenceField, TextField } from 'react-admin'

export const MovementList = props => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id"/>
      <TextField source="year"/>
      <TextField source="month"/>
      <DateField source="date"/>
      <NumberField source="amount"/>
      <TextField source="label"/>
      <ReferenceField source="category_id" reference="categories"><TextField source="name"/></ReferenceField>
      <NumberField source="category.id"/>
    </Datagrid>
  </List>
)
