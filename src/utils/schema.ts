const defaultFilter = (item) => {
  return ['LinkCell', 'Picker'].includes(item['x-component']);
}

export function specialHandleProperties({ properties, filter = defaultFilter, payload }) {
  return Object.keys(properties).reduce((initial, key) => {
    if (filter(properties[key])) {
      properties[key][payload.key] = payload.value;
    }
    initial[key] = properties[key];
    if (initial[key].properties) initial[key].properties = specialHandleProperties({ properties: initial[key].properties, filter, payload });
    return initial;
  }, {}) as any;
}
