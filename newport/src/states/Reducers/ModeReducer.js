const ModeReducer = (state = "light", action) => {
  if (action.type === "LIGHTMODE") {
    return (state = action.payload);
  } else if (action.type === "DARKMODE") {
    return (state = action.payload);
  } else {
    return state;
  }
};
export default ModeReducer;
