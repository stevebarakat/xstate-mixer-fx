import { useEffect, useRef } from "react";
import { Channel, Reverb, FeedbackDelay } from "tone";
import { MixerMachineContext } from "../App";

function useFx() {
  const [state] = MixerMachineContext.useActor();
  const busChannel = useRef();
  const reverb = useRef();
  const delay = useRef();

  useEffect(() => {
    switch (state.context.fx) {
      case "nofx":
        busChannel.current?.disconnect();
        busChannel.current = new Channel().toDestination();
        break;
      case "reverb":
        reverb.current = new Reverb(3).toDestination();
        busChannel.current?.disconnect();
        busChannel.current = new Channel().connect(reverb.current);
        busChannel.current.receive("reverb");
        break;
      case "delay":
        delay.current = new FeedbackDelay("8n", 0.5).toDestination();
        busChannel.current?.disconnect();
        busChannel.current = new Channel().connect(delay.current);
        busChannel.current.receive("delay");
        break;
      default:
        break;
    }

    return () => {
      reverb.current?.dispose();
      delay.current?.dispose();
      busChannel.current?.dispose();
    };
  }, [state.context.fx]);
  return busChannel.current;
}

export default useFx;
