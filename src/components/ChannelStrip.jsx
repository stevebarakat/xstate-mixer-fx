import Pan from "./Pan";
import Solo from "./Solo";
import Mute from "./Mute";
import TrackVolume from "./TrackVolume";

function ChannelStrip({ track, trackIndex, channel }) {
  return (
    <div>
      <select name="track-fx" id="fx-select">
        <option value="">No FX</option>
        <option value="reverb">Reverb</option>
        <option value="delay">Delay</option>
      </select>
      <div className="channel">
        <div className="chan-strip-btn">
          <Solo trackIndex={trackIndex} channel={channel} />
          <Mute trackIndex={trackIndex} channel={channel} />
        </div>
        <Pan trackIndex={trackIndex} channel={channel} />
        <TrackVolume trackIndex={trackIndex} channel={channel} />
        <span>{track.name}</span>
      </div>
    </div>
  );
}

export default ChannelStrip;
