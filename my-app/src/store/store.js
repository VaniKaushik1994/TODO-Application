import { createStore } from 'redux';
import todoReducer from './Reducer';

const store = createStore(todoReducer);

export default store;

