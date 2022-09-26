import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Auth from './Auth';
import StoreProductReducer from './CartReducer';
import PaymentReducer from './PaymentReducer';
import TeamsReducer from './TeamsReducer';
import ScheduleReducer from './ScheduleReducer';
import UserReducer from './UserReducer';
import TeammatesReducer from './TeammatesReducer';
import GetUserInfoReducer from './GetUserInfoReducer';
import StoreReducer from './StoreReducer';
import GetFollowingReducer from './GetFollowingReducer';
import GetFollowerReducer from './GetFollowerReducer';
import FollowReducer from './FollowReducer';
import GetCoachesReducer from './GetCoachesReducer';
import PlayerRequestTeamReducer from './PlayerRequestTeamReducer';
import TeamDetailsReducer from './TeamDetailsReducer';
import BookingReducer from './BookingReducer';
import NotificationByUserReducer from './NotificationByUserReducer';
import PostCreateReducer from './PostCreateReducer';
import SearchAllUsersReducer from './SearchAllUsersReducer';


import ChatReducer from './ChatReducer';
import EClassReducer from './EClassReducer';
import PlayerRequestApproveReducer from './PlayerRequestApproveReducer';
import HighlightsReducer from './HighlightsReducer';
import GetFacilityReducer from './GetFacilityReducer';
import PostLikeReducer from './PostLikeReducer';
import MeshCalenderReducer from './MeshCalenderReducer';
import RoomReducer from './RoomReducer'
import PackagesReducer from './PackagesReducer'
import EventReducer from './EventReducer'
import MembershipReducer from './MembershipReducer'


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['storeCart', 'CartTotalPrice'],
};
export default combineReducers({
  Auth,
  CartReducer: persistReducer(persistConfig, StoreProductReducer),
  PaymentReducer,
  ScheduleReducer,
  TeamsReducer,
  UserReducer,
  TeammatesReducer,
  GetUserInfoReducer,
  StoreReducer,
  GetFollowingReducer,
  GetFollowerReducer,
  FollowReducer,
  EClassReducer,
  GetCoachesReducer,
  PlayerRequestTeamReducer,
  TeamDetailsReducer,
  ChatReducer,
  NotificationByUserReducer,
  PlayerRequestApproveReducer,
  PostCreateReducer,
  BookingReducer,
  SearchAllUsersReducer,
  HighlightsReducer,
  GetFacilityReducer,
  PostLikeReducer,
  MeshCalenderReducer,
  RoomReducer,
  PackagesReducer,
  EventReducer,
  MembershipReducer
});

// let PersistStore = createStore(PersistReducer);

// export const persistor = persistStore(PersistStore);
