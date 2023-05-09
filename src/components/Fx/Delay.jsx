import { MixerMachineContext } from "../../App";

export default function Delay({ delay, busIndex, fxIndex }) {
  const [, send] = MixerMachineContext.useActor();

  return (
    <div>
      <h3>Delay</h3>
      <div className="flex-y">
        <label htmlFor="mix">Mix:</label>
        <input
          type="range"
          className="simple-range"
          id="mix"
          min={0}
          max={1}
          step={0.01}
          // value={state.context.busFxData.delaysMix[busIndex][fxIndex]}
          onChange={(e) => {
            send({
              type: "CHANGE_DELAYS_MIX",
              target: e.target,
              delay,
              busIndex,
              fxIndex,
            });
          }}
        />
      </div>
      <div className="flex-y">
        <label htmlFor="delay-time">Delay Time:</label>
        <input
          type="range"
          className="simple-range"
          id="delay-time"
          min={0}
          max={1}
          step={0.01}
          // value={state.context.busFxData.delaysTime[busIndex][fxIndex]}
          onChange={(e) => {
            send({
              type: "CHANGE_DELAYS_TIME",
              target: e.target,
              delay,
              busIndex,
              fxIndex,
            });
          }}
        />
      </div>
      <div className="flex-y">
        <label htmlFor="feedback">Feedback:</label>
        <input
          type="range"
          className="simple-range"
          name="feedback"
          min={0}
          max={1}
          step={0.01}
          // value={state.context.busFxData.delaysFeedback[busIndex][fxIndex]}
          onChange={(e) => {
            send({
              type: "CHANGE_DELAYS_FEEDBACK",
              target: e.target,
              delay,
              busIndex,
              fxIndex,
            });
          }}
        />
      </div>
    </div>
  );
}
