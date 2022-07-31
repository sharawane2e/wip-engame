
const initialState = {
    show: false,
    type: "message",
    heading: "Subscription Type",
    body: "This is body"
}

export const popupReducer = (state = { popupData: initialState }, action:any) => {
    switch (action.type) {
  
      case "POPUP_DATA":
        return { loading: false, popupData: action.payload };
  
      default:
        return state;
    }
};
  