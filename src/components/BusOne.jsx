import { useState, useEffect, useRef } from "react";
import { Channel, Reverb, FeedbackDelay } from "tone";
import { MixerMachineContext } from "../App";
import Range from "./Range";

function BusOne() {
  const [state, send] = MixerMachineContext.useActor();
  const busChannel = useRef();
  const reverb = useRef();
  const delay = useRef();
  const [fx, setFx] = useState(null);

  useEffect(() => {
    console.log("fx", fx);

    switch (fx) {
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
  }, [fx]);

  return (
    <div>
      <select
        name="track-fx"
        id="fx-select"
        onChange={(e) => setFx(e.target.value)}
      >
        <option value="nofx">No FX</option>
        <option value="reverb">Reverb</option>
        <option value="delay">Delay</option>
      </select>
      <div className="channel">
        <div className="window">{`${state.context.busVolume.toFixed(
          0
        )} dB`}</div>
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
    </div>
  );
}

export default BusOne;
