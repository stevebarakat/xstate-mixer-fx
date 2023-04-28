import { useState } from "react";
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
        {state.value.stopped === "active" ? "Close" : "Open"} FX
      </button>
      <select
        name="track1-fx1"
        id="fx-select-1.1"
        onChange={(e) => {
          send({
            type: "SET_BUS1_FX1",
            target: e.target,
          });
        }}
        defaultValue={state.context.bus1fx1}
      >
        <option value="nofx">FX 1</option>
        <option value="reverb">Reverb</option>
        <option value="delay">Delay</option>
      </select>
      <select
        name="track1-fx2"
        id="fx-select-2.1"
        onChange={(e) => {
          send({
            type: "SET_BUS1_FX2",
            target: e.target,
          });
        }}
      >
        <option value="nofx">FX 2</option>
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
