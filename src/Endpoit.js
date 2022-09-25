const baseUrl = 'http://mysupir.com';
const baseUrlDriver = baseUrl + '/api/driver';

const EndPoint = {
  GET_CHAT: baseUrl + '/api/chat/conversation/',
  AUTH_BROADCAST: baseUrl + '/broadcasting/auth',
  SEND_CHAT: baseUrl + '/api/chat/message/',
  SEND_PANIC_PHOTO: baseUrlDriver + '/photo-driver',
  GENERATE_INCOME: baseUrlDriver + '/generate-income',
  INCOME_HISTORIES: baseUrlDriver + '/get-histories',
  REQUEST_INCOME: baseUrlDriver + '/request-income',
  LOGIN: baseUrlDriver + '/login',
  RESEND_OTP: baseUrlDriver + '/login',
  VERIFY_OTP: baseUrlDriver + '/login/verify',
  PANIC: baseUrlDriver + '/panic',
  FINISH_ORDER: baseUrl + '/api/order/finish/',
  START_ORDER: baseUrl + '/api/order/init/',
  GET_REVIEW: baseUrl + '/api/reviews',
  GET_ORDER_HISTORY: baseUrl + '/api/order/history',
  GET_ORDER_DETAIL: baseUrl + '/api/order/detail/',
  TOGGLE_ORDER: baseUrlDriver + '/toggle-order',
  UPDATE_PROFILE: baseUrlDriver + '/update',
  CHANGE_AVATAR: baseUrlDriver + '/update-foto',
  GET_PROFILE: baseUrlDriver,
  ACCEPT_ORDER: baseUrl + '/api/order/accept/',
  DECLINE_ORDER: baseUrl + '/api/order/decline/',
};

export default EndPoint;
