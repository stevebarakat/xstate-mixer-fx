import { MixerMachineContext } from "../App";
import Range from "./Range";

function BusOne({ busChannel }) {
  const [state, send] = MixerMachineContext.useActor();

  return (
    <div>
      <select
        name="track-fx"
        id="fx-select"
        onChange={(e) => {
          send({
            type: "SET_FX",
            target: e.target,
          });
        }}
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
