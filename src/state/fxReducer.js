export default function fxReducer(state, action) {
  switch (action.type) {
    case "SET_BUS1_FX1":
      return {
        ...state,
        bus1fx1: action.payload,
      };

    case "SET_BUS1_FX2":
      return {
        ...state,
        bus1fx2: action.payload,
      };

    case "SET_BUS2_FX1":
      return {
        ...state,
        bus2fx1: action.payload,
      };

    case "SET_BUS2_FX2":
      return {
        ...state,
        bus2fx2: action.payload,
      };

    default:
      break;
  }
}
