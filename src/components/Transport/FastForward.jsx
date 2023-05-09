import { MixerMachineContext } from "../../App";
import TransportButton from "../Buttons/TransportButton";
import { ff } from "../../assets/icons";

export function FastForward() {
  const [, send] = MixerMachineContext.useActor();

  return (
    <TransportButton
      onClick={() => {
        send("FF");
      }}
    >
      {ff}
    </TransportButton>
  );
}
