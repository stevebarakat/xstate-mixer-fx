import { MixerMachineContext } from "../../App";

export default function Reverber({ reverb, busIndex, fxIndex }) {
  const [, send] = MixerMachineContext.useActor();

  return (
    <div>
      <h3>Reverb</h3>
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
