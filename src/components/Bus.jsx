import { useState } from "react";
import { MixerMachineContext } from "../App";
import { array as fx } from "../utils";
import Range from "./Range";

function Bus({ busChannels, busIndex, isOpen, setIsOpen }) {
  const currentMix = JSON.parse(localStorage.getItem("currentMix"));
  const [state, send] = MixerMachineContext.useActor();
  // const [busVolumes, setBusVolumes] = useState([-32, -32]);

  console.log("state", state);

  return (
    <div>
      <button
        className="button effect-select"
        onClick={(e) => setIsOpen(!isOpen)}
      >
        {isOpen ? "Close" : "Open"} FX
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
              localStorage.setItem(
                "currentMix",
                JSON.stringify({
                  ...currentMix,
                  state: {
                    ...state.state,
                    [`bus${busIndex + 1}fx${i + 1}`]: e.target.value,
                  },
                })
              );
            }}
            defaultValue={currentMix[`bus${busIndex + 1}fx${i + 1}`]}
          >
            <option value={`nofx${busIndex + 1}`}>{`FX ${i + 1}`}</option>
            <option value={`reverb${busIndex + 1}`}>Reverb</option>
            <option value={`delay${busIndex + 1}`}>Delay</option>
          </select>
        );
      })}

      <div className="channel">
        <div className="window">{`${state.context.busVolumes[busIndex].toFixed(
          0
        )} dB`}</div>
        <Range
          id={`busVol${busIndex}`}
          className="range-y"
          min={-100}
          max={12}
          step={0.1}
          value={state.context.busVolumes[busIndex]}
          onChange={(e) => {
            // const value = parseFloat(e.target.value);
            // busVolumes[busIndex] = value;
            // setBusVolumes([...busVolumes]);
            // busChannel.volume.value = value;
            send({
              type: "CHANGE_BUS_VOLUMES",
              target: e.target,
              channel: busChannels.current[busIndex],
            });
          }}
        />
        <span>{`Bus ${busIndex + 1}`}</span>
      </div>
    </div>
  );
}

export default Bus;
