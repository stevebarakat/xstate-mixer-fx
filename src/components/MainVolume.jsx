import { Destination } from "tone";
import { MixerMachineContext } from "../App";
import Range from "./Range";

function MainVolume({ channel, trackIndex }) {
  const [state, send] = MixerMachineContext.useActor();

  return (
    <div className="channel">
      <div className="window">
        {`${state.context.mainVolume.toFixed(0)} dB`}
      </div>
      <div className="range-y">
        <Range
          id="main"
          min={-100}
          max={12}
          step={0.1}
          value={state.context.mainVolume}
          onChange={(e) => {
            send({
              type: "CHANGE_MAIN_VOLUME",
              target: e.target,
              channel: Destination,
            });
          }}
        />
      </div>
      <span>Main</span>
    </div>
  );
}

export default MainVolume;
