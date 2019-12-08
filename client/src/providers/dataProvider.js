import { CREATE, DELETE, DELETE_MANY, fetchUtils, GET_LIST, GET_MANY, GET_MANY_REFERENCE, GET_ONE, UPDATE, UPDATE_MANY } from 'react-admin'

import { each, get } from 'lodash'
import { stringify } from 'query-string'

const API_URL = process.env.REACT_APP_API_URL

/**
 * @param {String} verb One of the constants appearing at the top of this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The Data Provider request params, depending on the verb
 * @returns {Object} { url, options } The HTTP request parameters
 */
const convertDataProviderRequestToHTTP = (verb, resource, params) => {
  switch (verb) {
    case GET_LIST: {
      const { page, perPage } = params.pagination
      const { field, order } = params.sort
      const sortedField = order === 'ASC' ? field : '-' + field

      let query = {
        sort: sortedField,
        page: page,
        pageSize: perPage,
      }

      // * Query filters setup *

      // In some edge cases, we are in GET_LIST mode but only need 1 object
      // We search for 'id' in params.filter subObjects to detect those cases:
      const getResourceId = get(params.filter, resource + '.id')
      if (getResourceId) {
        return {
          url: `${API_URL}/${resource}/${getResourceId}`,
        }
      }

      // Main case:
      // k is the columns/fields that we need to search into:
      // /!\ We used a little hack (the '__&&__' stuff) to allow to search to multiple fields at once
      //
      // *TODO API*: Allow us to do some OR in WHEREs...
      // For now it's only AND which is not that great for search
      // *TODO API*: Allow us to query FK from API (entite.id__in=xyz, idEntite exists ?)
      //
      // v.searchMode is related to how we query our APIs -> (in, contains, startsWith, ...)
      // -> default searchMode is contains - just in case
      //
      // v.searchText is self-explanatory
      each(params.filter, (v, k) => {
        const searchText = v.searchText ? v.searchText : v

        const searchFields = k.includes('__&&__') ? k.split('__&&__') : Array(k)

        searchFields.forEach(searchField => {
          let searchMode
          if (v.searchMode) {
            searchMode = v.searchMode
          } else {
            searchMode = searchField.includes('__')
              ? searchField.slice(searchField.lastIndexOf('_') + 1)
              : 'contains'
          }

          query[`${searchField}__${searchMode}`] = searchText
        })
      })

      return {
        url: `${API_URL}/${resource}?${stringify(query)}`,
      }
    }
    case GET_ONE:
      return {
        url: `${API_URL}/${resource}/${params.id}`,
      }
    case GET_MANY: {
      const query = {
        id__in: params.ids.join(','),
      }
      return {
        url: `${API_URL}/${resource}?${stringify(query)}`,
      }
    }
    case GET_MANY_REFERENCE: {
      const { page, perPage } = params.pagination
      const { field, order } = params.sort
      const sortedField = order === 'ASC' ? field : '-' + field

      const query = {
        sort: sortedField,
        page: page,
        pageSize: perPage,
        filter: JSON.stringify({
          ...params.filter,
          [params.target]: params.id,
        }),
      }
      return {
        url: `${API_URL}/${resource}?${stringify(query)}`,
      }
    }
    case UPDATE:
    case UPDATE_MANY:
      return {
        url: `${API_URL}/${resource}/${params.id}`,
        options: {
          method: 'PATCH',
          body: JSON.stringify(params.data),
        },
      }
    case CREATE:
      return {
        url: `${API_URL}/${resource}`,
        options: {
          method: 'POST',
          body: JSON.stringify(params.data),
        },
      }
    case DELETE:
      return {
        url: `${API_URL}/${resource}/${params.id}`,
        options: {
          method: 'DELETE',
        },
      }
    case DELETE_MANY:
      console.log(params.ids)
      return {
        url: `${API_URL}/${resource}`,
        options: {
          method: 'DELETE',
          body: JSON.stringify(params.ids),
        },
      }
    default:
      throw new Error(`Unsupported fetch action verb ${verb}`)
  }
}

/**
 * @param {Object} response HTTP response from fetch()
 * @param {String} verb One of the constants appearing at the top of this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The Data Provider request params, depending on the verb
 * @returns {Object} Data Provider response
 */
const convertHTTPResponseToDataProvider = (response, verb, resource, params) => {
  const { json } = response

  switch (verb) {
    case GET_LIST:
    case GET_MANY:
    case GET_MANY_REFERENCE:
      return {
        data: json.data,
        total: json.total,
      }
    case CREATE:
      return {
        data: {
          ...params.data,
          id: json.id,
        },
      }
    default:
      return {
        data: json,
      }
  }
}

/**
 * @param {string} verb Request verb, e.g GET_LIST
 * @param {string} resource Resource name, e.g. "posts"
 * @param {Object} payload Request parameters. Depends on the request verb
 * @returns {Promise} the Promise for response
 */
const dataProvider = (verb, resource, params) => {
  const { url, options } = convertDataProviderRequestToHTTP(verb, resource, params)

  const httpClient = (url, options = {}) => {
    if (!options.headers) {
      options.headers = new window.Headers({ Accept: 'application/json' })
    }
    return fetchUtils.fetchJson(url, options)
  }

  return httpClient(url, options).then(
    response => convertHTTPResponseToDataProvider(response, verb, resource, params),
  )
}

export default dataProvider
