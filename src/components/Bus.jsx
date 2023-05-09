import { MixerMachineContext } from "../App";
import { array as fx } from "../utils";
import Range from "./Range";

function Bus({ busChannels, busIndex }) {
  const currentMix = JSON.parse(localStorage.getItem("currentMix"));
  const [state, send] = MixerMachineContext.useActor();

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

      {fx(2).map((_, fxIndex) => {
        return (
          <select
            key={fxIndex}
            id={`bus${busIndex}fx${fxIndex}`}
            onChange={(e) => {
              send({
                type: "SET_BUS_FX",
                target: e.target,
                busIndex,
                fxIndex,
              });
            }}
            defaultValue={
              currentMix.buses[`bus${busIndex + 1}fx${fxIndex + 1}`]
            }
          >
            <option value={`nofx${busIndex + 1}`}>{`FX ${fxIndex + 1}`}</option>
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
