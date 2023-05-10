import { MixerMachineContext } from "../../App";
import { powerIcon } from "../../assets/icons";

export default function Reverber({ reverb, busIndex, fxIndex }) {
  const [state, send] = MixerMachineContext.useActor();

  return (
    <div>
      <h3>Reverb</h3>
      <div className="power-button">
        <input
          id={`bus${busIndex}reverbBypass`}
          type="checkbox"
          onChange={(e) => {
            send({
              type: "BYPASS_REVERB",
              checked: e.target.checked,
              reverb,
              busIndex,
              fxIndex,
            });
          }}
          checked={state.context.busFxData.reverbsBypass[busIndex][fxIndex]}
        />
        <label htmlFor={`bus${busIndex}reverbBypass`}>{powerIcon}</label>
      </div>
      <div className="flex-y">
        <label htmlFor="mix">Mix:</label>
        <input
          type="range"
          className="simple-range"
          name="mix"
          min={0}
          max={1}
          step={0.01}
          onChange={(e) => {
            send({
              type: "CHANGE_REVERBS_MIX",
              target: e.target,
              reverb,
              busIndex,
              fxIndex,
            });
          }}
        />
      </div>
      <div className="flex-y">
        <label htmlFor="pre-delay">Pre Delay:</label>
        <input
          type="range"
          className="simple-range"
          name="pre-delay"
          min={0}
          max={1}
          step={0.01}
          onChange={(e) => {
            send({
              type: "CHANGE_REVERBS_PREDELAY",
              target: e.target,
              reverb,
              busIndex,
              fxIndex,
            });
          }}
        />
      </div>
      <div className="flex-y">
        <label htmlFor="decay">Decay:</label>
        <input
          type="range"
          className="simple-range"
          name="decay"
          min={0.1}
          max={20}
          step={0.1}
          onChange={(e) => {
            send({
              type: "CHANGE_REVERBS_DECAY",
              target: e.target,
              reverb,
              busIndex,
              fxIndex,
            });
          }}
        />
      </div>
    </div>
  );
}
