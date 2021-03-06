//holds all members who are on call
const onCallReducer = (state=[], action) => {
  switch(action.type) {
    case 'SET_ONCALL':
      return action.payload;
    default:
      return state;
  }
}

export default onCallReducer;