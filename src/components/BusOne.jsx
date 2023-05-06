import { useState } from "react";
import { array as fx } from "../utils";
import { MixerMachineContext } from "../App";
import Range from "./Range";

function BusOne({ busChannel }) {
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
            name={`track1-fx${i}`}
            id={`fx-select-1.${i}`}
            onChange={(e) => {
              send({
                type: `SET_BUS1_FX${i + 1}`,
                target: e.target,
              });
            }}
            defaultValue={state.context[`bus1fx${i}`]}
          >
            <option value="nofx">{`FX ${i + 1}`}</option>
            <option value="reverb">Reverb</option>
            <option value="delay">Delay</option>
          </select>
        );
      })}

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
