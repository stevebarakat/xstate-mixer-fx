import { MixerMachineContext } from "../../App";
import TransportButton from "../Buttons/TransportButton";
import { restart } from "../../assets/icons";

function Reset() {
  const [, send] = MixerMachineContext.useActor();

  return (
    <TransportButton
      onClick={() => {
        send("RESET");
      }}
    >
      {restart}
    </TransportButton>
  );
}

export default Reset;
