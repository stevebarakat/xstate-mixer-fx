import { useEffect, useRef } from "react";
import { Channel, Reverb } from "tone";
import { MixerMachineContext } from "../App";
import Range from "./Range";

function BusOne() {
  const [state, send] = MixerMachineContext.useActor();
  const busChannel = useRef();
  const reverb = useRef();

  useEffect(() => {
    reverb.current = new Reverb(3).toDestination();
    busChannel.current = new Channel().connect(reverb.current);
    busChannel.current.receive("reverb");

    return () => {
      reverb.current.dispose();
      busChannel.current.dispose();
    };
  }, []);

  return (
    <div className="channel">
      <div className="window">{`${state.context.busVolume.toFixed(0)} dB`}</div>
      <Range
        id="main"
        className="range-y"
        min={-100}
        max={12}
        step={0.1}
        value={state.context.busVolume}
        onChange={(e) => {
          send({
            type: "CHANGE_BUS_VOLUME",
            target: e.target,
            channel: busChannel.current,
          });
        }}
      />
      <span>Bus One</span>
    </div>
  );
}

export default BusOne;
