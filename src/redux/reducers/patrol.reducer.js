// holds all users who are on patrol

const patrolReducer = (state=[], action) => {
  switch(action.type) {
    case 'SET_PATROL':
      return action.payload;
    default:
      return state;
  }
}

export default patrolReducer;