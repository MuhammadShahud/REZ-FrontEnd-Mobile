// const base_url = `https://rezsched.com`;
// export const img_url = `https://rezsched.com/public/uploads/`;

const base_url = `http://192.168.0.162/rez`;
export const img_url = `http://192.168.0.162/rez/public/uploads/`;

// const base_url = 'https://rezsched.com/staging';

const Apis = {
  sign_up: `${base_url}/api/register`,
  getUser: `${base_url}/api/getUser`,
  login: `${base_url}/api/login`,
  deleteAccount: `${base_url}/api/deleteUserAccount`,
  staffPermission: `${base_url}/api/staffPermission`,
  forget_password: `${base_url}/api/forget_password`,
  verifyCode: `${base_url}/api/verifyCode`,
  update_password: `${base_url}/api/update_password `,
  updatefcmtoken: `${base_url}/api/updatefcmtoken`,
  socialLogin: `${base_url}/api/socialLogin`,
  getSportTypes: `${base_url}/api/getSportType`,

  getColors: `${base_url}/api/colors`,

  checkChildEmail: `${base_url}/api/findPlayer`,
  getUserData: `${base_url}/api/getUserInfo`,
  getScheduleTypes: `${base_url}/api/getScheduleTypes`,
  updateSportType: `${base_url}/api/updateSporttype`,
  getTeamsBysport: `${base_url}/api/getTeamsBysport`,
  updateUser: `${base_url}/api/updateUser`,
  getPrivacyPolicy: `${base_url}/api/getPrivacyPolicy`,
  getTermsCondition: `${base_url}/api/getTermsCondition`,
  contactUs: `${base_url}/api/contactUs`,
  sendHelp: `${base_url}/api/sendHelp`,
  ActiveEvents: (next_page_url) =>
    next_page_url ? next_page_url : `${base_url}/api/allEvents/active`,
  PastEvents: (next_page_url) =>
    next_page_url ? next_page_url : `${base_url}/api/allEvents/past`,
  EventDetails: `${base_url}/api/eventDetails/`,
  orderHistory: `${base_url}/api/orderHistory`,
  getScheduleList: `${base_url}/api/getScheduleList`,
  getFilterScheduleList: `${base_url}/api/getFilterScheduleList`,
  getSchedulesByRole: `${base_url}/api/getSchedulesByRole`,
  getReviews: `${base_url}/api/getReviews`,
  setReview: `${base_url}/api/setReview`,

  getSchedulesOther: next_page_url =>
    next_page_url ? next_page_url : `${base_url}/api/getSchedules/other`,

  getUsersByType: next_page_url =>
    next_page_url ? next_page_url : `${base_url}/api/getUserByType`,
  getMyTeammates: `${base_url}/api/getMyTeammates`,
  getUserInfoById: `${base_url}/api/getUserInfoById`,
  getTeamdetails: `${base_url}/api/getTeamdetails`,
  getFollowUser: `${base_url}/api/getFollowUser`,
  playerRequestApproved: `${base_url}/api/playerRequestApproved`,
  cancelInvite: `${base_url}/api/cancelEvent`,
  uploadStoreProduct: `${base_url}/api/productStore`,
  getAllStoreProductsForUsers: `${base_url}/api/allProduct`,
  getAllUsedProductsForUsers: `${base_url}/api/oldProducts`,
  getProductsWithoutCategory: `${base_url}/api/getproductWithoutCategory`,
  getStoreProducts: `${base_url}/api/productsList`,
  getProductCategories: `${base_url}/api/productCategory`,
  AddProductCategories: `${base_url}/api/createProductCategory`,
  getProductSizes: `${base_url}/api/getProductSizes`,


  updateStoreProduct: `${base_url}/api/productupdatedata`,
  productDelete: id => `${base_url}/api/productDelete/${id}`,
  followUser: `${base_url}/api/followUser`,
  postLike: `${base_url}/api/postLike`,
  playerRequestToTeam: `${base_url}/api/playerRequestToTeam`,
  getUserPaymentCardList: `${base_url}/api/cardList`,
  addPaymentCard: `${base_url}/api/storeCard`,
  deletePaymentCard: id => `${base_url}/api/deleteCard/${id}`,
  orderProducts: `${base_url}/api/saveOrder`,
  createLeague: `${base_url}/api/storeLeague`,
  updateLeague: `${base_url}/api/updateLeague`,
  deleteLeague: `${base_url}/api/deleteLeague`,
  leagueDetail: id => `${base_url}/api/leaguesDetails/${id}`,
  bookingLeague: `${base_url}/api/bookingLeagues`,
  inviteTeams: `${base_url}/api/joinLeagueByCoach`,
  acceptLeague: `${base_url}/api/inviteLeagueApprovedByteam`,
  updateLeagueScore: `${base_url}/api/leaguesScoreUpdate`,

  getAllSubscription: (next_page_url) =>
    next_page_url ? next_page_url : `${base_url}/api/getAllSubscription`,
  bookSubscription: `${base_url}/api/bookSubscription`,
  getFollowingUser: (next_page_url, id) =>
    next_page_url ? next_page_url : `${base_url}/api/getFollowingUser/${id}`,
  getFollowerUser: (next_page_url, id) =>
    next_page_url ? next_page_url : `${base_url}/api/getFollowerUser/${id}`,

  getNotificationByUser: next_page_url =>
    next_page_url ? next_page_url : `${base_url}/api/getNotificationByUser`,

  getInvitationByUser: next_page_url =>
    next_page_url ? next_page_url : `${base_url}/api/getInvitationByUser`,

  getInvitationOfUser: next_page_url =>
    next_page_url ? next_page_url : `${base_url}/api/getInvitationOfUser`,

  addSchedule: `${base_url}/api/addSchedule`,
  createEClass: `${base_url}/api/saveEclass`,
  orderEClass: `${base_url}/api/bookEclass `,
  getEClass: eclass_id => `${base_url}/api/getEclassDetail/${eclass_id}`,
  getChatHeads: `${base_url}/api/allChats`,
  getGroupChatHeads: `${base_url}/api/getAllChatGroups`,
  leaguesHistory: `${base_url}/api/leaguesHistory`,
  sendMessage: `${base_url}/api/send`,
  sendGroupMessage: `${base_url}/api/sendGroupMessage`,

  createGroupChat: `${base_url}/api/storeChatGroup`,
  createSession: `${base_url}/api/createSession`,
  postCreate: `${base_url}/api/postCreate`,
  postComment: `${base_url}/api/postComment`,
  postReport: `${base_url}/api/postFlag`,
  postDelete: id => `${base_url}/api/postDelete/${id}`,
  getPostComments: (next_page_url, id) =>
    next_page_url ? next_page_url : `${base_url}/api/getPostComments/${id}`,


  getChatMessages: next_page_url =>
    next_page_url ? next_page_url : `${base_url}/api/allMessages`,

  getGroupMessages: next_page_url =>
    next_page_url ? next_page_url : `${base_url}/api/getGroupMessages`,
  readGroupMessages: `${base_url}/api/readGroupMessages`,
  deleteGroupMember: `${base_url}/api/removeGroupMember`,
  updateGroup: `${base_url}/api/updateChatGroup`,
  leaveGroup: `${base_url}/api/leaveGroup`,
  deleteGroup: `${base_url}/api/deleteChatGroup`,




  getEclasses: (next_page_url, searchText) =>
    next_page_url
      ? next_page_url
      : `${base_url}/api/getEclasses?name=${searchText ? searchText : ''}`,
  getAllCoachs: (next_page_url, searchText) =>
    next_page_url
      ? next_page_url
      : `${base_url}/api/getAllCoachs?name=${searchText ? searchText : ''}`,
  getCoachSession: (schedule_type, coach_id, filter, date) =>
    `${base_url}/api/coachSession/${schedule_type}/${coach_id}?filter=${filter}&date=${date}`,
  getSessionDetail: session_id =>
    `${base_url}/api/trainingSessionDetail/${session_id}`,
  createBooking: `${base_url}/api/booking`,
  getCoachBooking: `${base_url}/api/bookedtrainingsession`,
  getOneCoachBooking: booking_id =>
    `${base_url}/api/bookedtrainingsession/${booking_id}`,
  getSearchUser: (next_page_url, searchText) =>
    next_page_url
      ? next_page_url
      : `${base_url}/api/getSearchUser?name=${searchText ? searchText : ''}`,
  getHighlights: next_page_url =>
    next_page_url ? next_page_url : `${base_url}/api/getHighlights`,
  getMyHighlights: next_page_url =>
    next_page_url ? next_page_url : `${base_url}/api/getMyHighlights`,
  getAllFacility: (next_page_url, searchText) =>
    next_page_url
      ? next_page_url
      : `${base_url}/api/getAllFacility${searchText ? "/?name=" + searchText : ''}`,

  getSchedulesbyid: (scheduletype, id, filter, date, room_id, subroom_id) => `${base_url}/api/getSchedulesOnlyById/${scheduletype}/${id}?filter=${filter}&date=${date}&room=${room_id}&subroom=${subroom_id}`,

  getfacilityProduct: `${base_url}/api/getProductsByFacilityId/`,

  getFacilityProds: (next_page_url, id) =>
    next_page_url
      ? next_page_url
      : `${base_url}/api/getProductsByFacilityId/${id}`,


  updateCoachBooking: `${base_url}/api/updatesessionbooking`,
  bookingStatusUpdate: `${base_url}/api/bookingStatusUpdate`,
  getCoachTimeSlot: session_id => `${base_url}/api/showTimeSlot/${session_id}`,
  storeOrderListing: `${base_url}/api/storeOrderListing`,
  // getPostByUser: `${base_url}/api/getPostByUser`,
  getPostByUser: id => `${base_url}/api/getPostByUser/${id}`,
  sharePost: `${base_url}/api/sharePost`,

  deleteLeague: id => `${base_url}/api/deleteLeague/${id}`,
  meshCalenderGenerator: `${base_url}/api/meshCalenderGenerator`,
  allLeagues: type => `${base_url}/api/allLeagues/${type}`,
  getEClassesByfacility: id => `${base_url}/api/getEClassesByfacilityId/${id}`,
  countryList: `${base_url}/api/countryList`,
  stateList: country_id => `${base_url}/api/stateList/${country_id}`,
  citiesList: state_id => `${base_url}/api/cityList/${state_id}`,
  addBankAccount: `${base_url}/api/addBankAccount`,

  StoreRoom: `${base_url}/api/storeRoom`,
  GetRoom: `${base_url}/api/getAllRooms`,
  RoomDelete: `${base_url}/api/deleteRoom`,
  UpdateRoom: `${base_url}/api/updateRoom`,
  deleteRoomImage: `${base_url}/api/deleteRoomImage`,
  StoreSubRoom: `${base_url}/api/storeSubroom`,
  UpdateSubRoom: `${base_url}/api/updateSubroom`,
  getRoomStaffs: `${base_url}/api/getRoomStaffById`,

  createContract: `${base_url}/api/storeContract`,
  getAllContract: `${base_url}/api/getAllContracts`,
  createPackage: `${base_url}/api/storePackage`,
  getAllPackages: `${base_url}/api/getAllPackages`,
  createPass: `${base_url}/api/storePass`,
  getAllPasses: `${base_url}/api/getAllPasses`,
  getUserContracts: `${base_url}/api/getAllSubscribedPlans`,
  subscribedPlans: `${base_url}/api/buySubscription`,
  checkIfTeamMember: `${base_url}/api/checkIfTeamMember`,
  deletePass: `${base_url}/api/deletePass`,
  deleteContract: `${base_url}/api/deleteContract`,
  deletePackage: `${base_url}/api/deletePackage`,

  checkIfUserBlock: `${base_url}/api/checkBlockedUserStatus`,
  blockUser: `${base_url}/api/blockUser`,
  getBlockList: `${base_url}/api/getBlockedUsers`,
  getUsersByRole: `${base_url}/api/getUsersByRole`,

};

export default Apis;
