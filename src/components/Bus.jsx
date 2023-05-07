import { useState } from "react";
import { array as fx } from "../utils";
import { MixerMachineContext } from "../App";
import Range from "./Range";

function Bus({ busChannel, busIndex }) {
  const [state, send] = MixerMachineContext.useActor();
  const currentMix = JSON.parse(localStorage.getItem("currentMix"));

  const [busVolumes, setBusVolumes] = useState([-32, -32]);

  return (
    <div>
      <button
        className="button effect-select"
        onClick={(e) => {
          send("TOGGLE");
        }}
      >
        {state.hasTag("active") ? "Close" : "Open"} FX
      </button>

      {fx(2).map((_, i) => {
        return (
          <select
            key={i}
            id={`bus${busIndex}fx${i}`}
            onChange={(e) => {
              send({
                type: `SET_BUS${busIndex + 1}_FX${i + 1}`,
                target: e.target,
              });
            }}
            defaultValue={state.context[`bus${busIndex}fx${i}`]}
          >
            <option value="nofx">{`FX ${i + 1}`}</option>
            <option value={`reverb${busIndex + 1}`}>Reverb</option>
            <option value={`delay${busIndex + 1}`}>Delay</option>
          </select>
        );
      })}

      <div className="channel">
        <div className="window">{`${busVolumes[busIndex].toFixed(0)} dB`}</div>
        <Range
          id={`busVol${busIndex}`}
          className="range-y"
          min={-100}
          max={12}
          step={0.1}
          // value={busVolumes[busIndex]}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            busVolumes[busIndex] = value;
            setBusVolumes([...busVolumes]);
            console.log("busChannel", busChannel);
            busChannel.volume.value = value;
            // send({
            //   type: "CHANGE_BUS_VOLUMES",
            //   target: e.target,
            //   channel: busChannel,
            // });
          }}
        />
        <span>{`Bus ${busIndex + 1}`}</span>
      </div>
    </div>
  );
}

export default Bus;
