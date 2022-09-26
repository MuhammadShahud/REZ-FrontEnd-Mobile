import {applyMiddleware, createStore} from 'redux';
import {persistStore} from 'redux-persist';
import thunk from 'redux-thunk';
import {getHeaders} from '../Utils';
import Reducers from './Reducers';

const store = createStore(Reducers, applyMiddleware(thunk));
const persistor = persistStore(store);

persistor.subscribe(() => {
  console.log('Persistor=>', persistor.getState());
});
store.subscribe(async () => {
  // console.log('STATE=>', JSON.stringify(store.getState()));
});
export {persistor, store};
