import { useState } from "react";
import { array as fx } from "../utils";
import { MixerMachineContext } from "../App";
import Range from "./Range";

function BusOne({ busChannel, busIndex }) {
  const [state, send] = MixerMachineContext.useActor();
  const currentMix = JSON.parse(localStorage.getItem("currentMix"));

  console.log("state.context.bus1fx1", state.context.bus1fx1);
  console.log("currentMix", currentMix);

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
            <option value="reverb1">Reverb</option>
            <option value="delay">Delay</option>
          </select>
        );
      })}

      <div className="channel">
        <div className="window">{`${state.context.busVolume.toFixed(
          0
        )} dB`}</div>
        <Range
          className="range-y"
          min={-100}
          max={12}
          step={0.1}
          value={state.context.busVolume}
          onChange={(e) => {
            send({
              type: "CHANGE_BUS_VOLUME",
              target: e.target,
              channel: busChannel,
            });
          }}
        />
        <span>Bus One</span>
      </div>
    </div>
  );
}

export default BusOne;
