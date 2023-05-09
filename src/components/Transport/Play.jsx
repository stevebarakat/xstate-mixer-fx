import { MixerMachineContext } from "../../App";
import TransportButton from "../Buttons/TransportButton";
import { play, pause } from "../../assets/icons";

function Play() {
  const [state, send] = MixerMachineContext.useActor();

  return (
    <TransportButton
      onClick={() => {
        if (!state.matches("playing")) {
          send("PLAY");
        }
        if (state.matches("playing")) {
          send("PAUSE");
        }
      }}
    >
      {!state.matches("playing") ? play : pause}
    </TransportButton>
  );
}

export default Play;
