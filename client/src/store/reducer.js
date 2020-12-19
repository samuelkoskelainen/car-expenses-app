let user

if (sessionStorage.getItem("username")) {
  user = sessionStorage.getItem("username")
} else {
  user = ""
}

const initialState = {
  username: user
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET-USERNAME':
      state.username = action.payload
      return {
        username: state.username
      }
    default:
      return state
  }
}

export default reducer