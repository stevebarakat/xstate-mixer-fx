import { MixerMachineContext } from "../../App";
import TransportButton from "../Buttons/TransportButton";
import { rew } from "../../assets/icons";

function Rewind() {
  const [, send] = MixerMachineContext.useActor();

  return (
    <TransportButton
      onClick={() => {
        send("REWIND");
      }}
    >
      {rew}
    </TransportButton>
  );
}

export default Rewind;
