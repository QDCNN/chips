import _ from 'lodash';

const defaultFilter = (item) => {
  return ['LinkCell', 'OriginPicker', 'Radio.Group', 'ArrayItems', 'Switch', 'Uploader'].includes(item['x-component']);
}

export function specialHandleProperties({ properties, filter = defaultFilter, payload }) {
  return Object.keys(properties).reduce((initial, key) => {
    if (filter(properties[key])) {
      for (const item of payload) {
        _.set(properties[key], item.key, item.value);
      }
    }
    initial[key] = properties[key];
    if (initial[key].properties) initial[key].properties = specialHandleProperties({ properties: initial[key].properties, filter, payload });
    if (initial[key].items) initial[key].items.properties = specialHandleProperties({ properties: initial[key].items.properties, filter, payload });
    return initial;
  }, {}) as any;
}
