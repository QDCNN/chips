export const getFullName = (field) => {
  let path = '';
  if (field.props.basePath) {
    path += field.props.basePath?.entire + '.';
  }
  path += field.props.name;
  return path;
}
