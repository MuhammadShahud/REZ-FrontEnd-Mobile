import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { connect } from 'react-redux';
import {
  ActivePreviousEvents,
  AddEClass,
  AddEvent,
  AddPaymentCard,
  AddProduct,
  AddScheduler,
  AppointmentDetail,
  Appointments,
  BookAppointment,
  Chat,
  GroupChat,
  CreateGroup,
  GroupInfo,
  Coach,
  CoachParticipant,
  CoachTraining,
  ContactUs,
  CreateLeague,
  EClass,
  EClassDetails,
  EditProfile,
  EnterReview,
  Event,
  EventDetails,
  EventDetailsAccept,
  FacilitiesTypes,
  Follow,
  GamesList,
  Help,
  HighlightsUpload,
  History,
  Home,
  HomeSearch,
  Inbox,
  InviteFriends,
  LeagueDetails,
  LeagueHistory,
  Leagues,
  MemberShip,
  MeshCalendar,
  MeshCalendarList,
  MyInvites,
  Newsfeed,
  Notifications,
  OrderSuccessfull,
  Payment,
  PrivacyPolicy,
  ProductDetail,
  ProductList,
  Profile,
  ProfileMenu,
  RatingReviews,
  Schedule,
  ScheduleList,
  SelectBookAppointment,
  ShowCart,
  Store,
  TeamsTypes,
  TermsCondition,
  TrackCoach,
  Upload,
  UserProfile,
  TeammatesList,
  TeamDetail,
  TeamRoster,
  UploadLeagueStats,
  FacilityDetails,
  FacilityEvents,
  OthersProfile,
  Following,
  Follower,
  EditProduct,
  ModifyBooking,
  OrderDetails,
  Post,
  SearchAllUsers,
  MyHighlights,
  StoreOrders,
  StoreOrderDetails,
  RoleLoader,
  MyStaff,
  AddStaff,
  StaffDetail,
  FacilityBookingHistory,
  PaymentReceivingAccount,
  AddRoom,
  RoomList,
  RoomDetails,
  SubRoomList,
  SubRoomDetails,
  AddSubRoom,
  EditRoom,
  EditSubRoom,
  Packages,
  CreateContracts,
  CreatePackage,
  CreatePasses,
  BlockList
} from '../Screens';
import BottomTabs from './BottomTabs';
import StoreBottomTabs from './StoreBottomTabs';

const App = ({ role }) => {
  const AppStack = createNativeStackNavigator();

  let screenName = 'BottomTab';
  role == 'store' && (screenName = 'StoreBottomTabs');

  return (
    <AppStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={'RoleLoader'}>
      <AppStack.Screen name="RoleLoader" component={RoleLoader} />
      <AppStack.Screen name="BottomTab" component={BottomTabs} />
      <AppStack.Screen name="StoreBottomTabs" component={StoreBottomTabs} />
      <AppStack.Screen name="StoreOrders" component={StoreOrders} />
      <AppStack.Screen name="StoreOrderDetails" component={StoreOrderDetails} />
      <AppStack.Screen name="Schedule" component={Schedule} />
      <AppStack.Screen name="ScheduleList" component={ScheduleList} />
      <AppStack.Screen name="AddScheduler" component={AddScheduler} />
      <AppStack.Screen name="InviteFriends" component={InviteFriends} />
      <AppStack.Screen name="MyInvites" component={MyInvites} />
      <AppStack.Screen name="Home" component={Home} />
      <AppStack.Screen name="Newsfeed" component={Newsfeed} />
      <AppStack.Screen name="Upload" component={Upload} />
      <AppStack.Screen name="Profile" component={Profile} />
      <AppStack.Screen name="EditProfile" component={EditProfile} />
      <AppStack.Screen name="ProfileMenu" component={ProfileMenu} />
      <AppStack.Screen name="HomeSearch" component={HomeSearch} />
      <AppStack.Screen name="HighlightsUpload" component={HighlightsUpload} />
      <AppStack.Screen name="TermsCondition" component={TermsCondition} />
      <AppStack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <AppStack.Screen name="Coach" component={Coach} />
      <AppStack.Screen name="CoachParticipant" component={CoachParticipant} />
      <AppStack.Screen name="CoachTraining" component={CoachTraining} />
      <AppStack.Screen name="TrackCoach" component={TrackCoach} />
      <AppStack.Screen name="RatingReviews" component={RatingReviews} />
      <AppStack.Screen name="EnterReview" component={EnterReview} />
      <AppStack.Screen name="Inbox" component={Inbox} />
      <AppStack.Screen name="Chat" component={Chat} />
      <AppStack.Screen name="GroupChat" component={GroupChat} />

      <AppStack.Screen name="CreateGroup" component={CreateGroup} />
      <AppStack.Screen name="GroupInfo" component={GroupInfo} />
      <AppStack.Screen name="MemberShip" component={MemberShip} />
      <AppStack.Screen name="Notifications" component={Notifications} />
      <AppStack.Screen name="ContactUs" component={ContactUs} />
      <AppStack.Screen name="Store" component={Store} />
      <AppStack.Screen name="EditProduct" component={EditProduct} />
      <AppStack.Screen name="Payment" component={Payment} />
      <AppStack.Screen name="AddPaymentCard" component={AddPaymentCard} />
      <AppStack.Screen name="OrderSuccessfull" component={OrderSuccessfull} />
      <AppStack.Screen name="Appointments" component={Appointments} />
      <AppStack.Screen name="AppointmentDetail" component={AppointmentDetail} />
      <AppStack.Screen name="BookAppointment" component={BookAppointment} />
      <AppStack.Screen name="OrderDetails" component={OrderDetails} />
      <AppStack.Screen
        name="SelectBookAppointment"
        component={SelectBookAppointment}
      />
      <AppStack.Screen name="Follower" component={Follower} />
      <AppStack.Screen name="Following" component={Following} />
      <AppStack.Screen name="UserProfile" component={UserProfile} />
      <AppStack.Screen name="OthersProfile" component={OthersProfile} />
      <AppStack.Screen name="Event" component={Event} />
      <AppStack.Screen name="EventDetails" component={EventDetails} />
      <AppStack.Screen name="AddEvent" component={AddEvent} />
      <AppStack.Screen
        name="ActivePreviousEvents"
        component={ActivePreviousEvents}
      />
      <AppStack.Screen name="Leagues" component={Leagues} />
      <AppStack.Screen name="LeagueDetails" component={LeagueDetails} />
      <AppStack.Screen
        name="EventDetailsAccept"
        component={EventDetailsAccept}
      />
      <AppStack.Screen name="ProductDetail" component={ProductDetail} />
      <AppStack.Screen name="ProductList" component={ProductList} />
      <AppStack.Screen name="AddProduct" component={AddProduct} />
      <AppStack.Screen name="ShowCart" component={ShowCart} />
      <AppStack.Screen name="LeagueHistory" component={LeagueHistory} />
      <AppStack.Screen name="CreateLeague" component={CreateLeague} />
      <AppStack.Screen name="EClass" component={EClass} />
      <AppStack.Screen name="AddEClass" component={AddEClass} />
      <AppStack.Screen name="EClassDetails" component={EClassDetails} />
      <AppStack.Screen name="GamesList" component={GamesList} />
      <AppStack.Screen name="FacilitiesTypes" component={FacilitiesTypes} />
      <AppStack.Screen name="FacilityEvents" component={FacilityEvents} />
      <AppStack.Screen name="FacilityDetails" component={FacilityDetails} />
      <AppStack.Screen name="Help" component={Help} />
      <AppStack.Screen name="TeamsTypes" component={TeamsTypes} />
      <AppStack.Screen name="TeamDetail" component={TeamDetail} />
      <AppStack.Screen name="TeammatesList" component={TeammatesList} />
      <AppStack.Screen name="TeamRoster" component={TeamRoster} />


      <AppStack.Screen name="History" component={History} />
      <AppStack.Screen
        name="FacilityBookingHistory"
        component={FacilityBookingHistory}
      />
      <AppStack.Screen name="MeshCalendar" component={MeshCalendar} />
      <AppStack.Screen name="MeshCalendarList" component={MeshCalendarList} />
      <AppStack.Screen name="UploadLeagueStats" component={UploadLeagueStats} />
      <AppStack.Screen name="ModifyBooking" component={ModifyBooking} />
      <AppStack.Screen name="Post" component={Post} />
      <AppStack.Screen name="SearchAllUsers" component={SearchAllUsers} />
      <AppStack.Screen name="MyHighlights" component={MyHighlights} />
      <AppStack.Screen name="MyStaff" component={MyStaff} />
      <AppStack.Screen name="AddStaff" component={AddStaff} />
      <AppStack.Screen name="StaffDetail" component={StaffDetail} />
      <AppStack.Screen
        name="PaymentReceivingAccount"
        component={PaymentReceivingAccount}
      />
      <AppStack.Screen name="AddRoom" component={AddRoom} />
      <AppStack.Screen name="RoomList" component={RoomList} />
      <AppStack.Screen name="RoomDetails" component={RoomDetails} />
      <AppStack.Screen name="EditRoom" component={EditRoom} />

      <AppStack.Screen name="SubRoomList" component={SubRoomList} />
      <AppStack.Screen name="AddSubRoom" component={AddSubRoom} />
      <AppStack.Screen name="SubRoomDetails" component={SubRoomDetails} />
      <AppStack.Screen name="EditSubRoom" component={EditSubRoom} />

      <AppStack.Screen name="Packages" component={Packages} />
      <AppStack.Screen name="CreateContract" component={CreateContracts} />
      <AppStack.Screen name="CreatePackage" component={CreatePackage} />
      <AppStack.Screen name="CreatePasses" component={CreatePasses} />

      <AppStack.Screen name="BlockList" component={BlockList} />






    </AppStack.Navigator>
  );
};

const mapStateToProps = state => {
  return {
    role: state.Auth.role,
  };
};
const mapsDispatchToProps = dispatch => {
  return {};
};
export default connect(mapStateToProps, null)(App);
