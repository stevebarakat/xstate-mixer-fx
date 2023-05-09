import { MixerMachineContext } from "../App";
import Range from "./Range";

function TrackVolume({ channel, trackIndex }) {
  const [state, send] = MixerMachineContext.useActor();
  const volume = parseFloat(state.context.volumes[trackIndex]);

  return (
    <>
      <div className="window">{`${volume.toFixed(0)} dB`}</div>
      <Range
        id={`trackVol${trackIndex}`}
        className="range-y"
        min={-100}
        max={12}
        step={0.1}
        value={volume}
        onChange={(e) => {
          send({
            type: "CHANGE_VOLUME",
            target: e.target,
            channel,
          });
        }}
      />
    </>
  );
}

export default TrackVolume;
