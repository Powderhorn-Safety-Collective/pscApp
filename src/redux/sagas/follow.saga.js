import { put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

// this saga function is to add the user to the junction table incident_followers
// to allow users to follow updates on an incident
function* followIncidentSaga(action) {
  console.log('in follow incident with incident id', action.payload);
  yield axios.post('api/incident/follow', action.payload);
  yield put({type: 'GET_FOLLOWED_INCIDENTS'});
} 

// this saga function is to remove the user from the junction table incident_followers
// to allow them to stop receiving updates on that incident
function* unfollowIncidentSaga(action) {
  console.log('in unfollow incident with incident id', action.payload);
  yield axios.delete(`api/incident/follow/${action.payload.incident_Id}`);
  yield put({type: 'GET_FOLLOWED_INCIDENTS'});
} 

function* followSaga() {
  yield takeEvery('FOLLOW_INCIDENT', followIncidentSaga); 
  yield takeEvery('UNFOLLOW_INCIDENT', unfollowIncidentSaga); 

}

export default followSaga;