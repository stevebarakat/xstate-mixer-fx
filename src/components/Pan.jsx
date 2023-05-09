import { MixerMachineContext } from "../App";
import Range from "./Range";

function Pan({ trackIndex, channel }) {
  const [state, send] = MixerMachineContext.useActor();
  const pan = parseFloat(state.context.pan[trackIndex]);

  return (
    <>
      <Range
        id={`trackPan${trackIndex}`}
        className="range-x"
        min={-1}
        max={1}
        step={0.01}
        value={pan}
        onChange={(e) => {
          send({
            type: "CHANGE_PAN",
            target: e.target,
            channel,
          });
        }}
      />
    </>
  );
}

export default Pan;
