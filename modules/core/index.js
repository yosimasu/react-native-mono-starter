export { connect } from 'react-redux';

export { default as dva } from './dva';

export const createAction = (namespace, action) => payload => {
  let type = namespace;
  if (action) {
    type = `${namespace}/${action}`;
  }
  return { type, payload };
};
