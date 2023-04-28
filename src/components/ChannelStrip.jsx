import Pan from "./Pan";
import Solo from "./Solo";
import Mute from "./Mute";
import TrackVolume from "./TrackVolume";
import { Destination } from "tone";

function ChannelStrip({ track, trackIndex, channel, channels }) {
  return (
    <div>
      <div className="fx-select">
        <select name="track-fx" id="fx-select">
          <option value="">No FX</option>
          <option value="reverb">Reverb</option>
          <option value="delay">Delay</option>
        </select>
      </div>
      <div className="bus-btn">
        <input
          id={`bus1${trackIndex}`}
          type="checkbox"
          onChange={(e) => {
            const id = e.target.id.at(-1);
            if (e.target.checked) {
              channels[id].send("reverb");
              channels[id].send("delay");
            } else {
              channels[id].disconnect();
              channels[id].connect(Destination);
            }
          }}
        />
        <label htmlFor={`bus1${trackIndex}`}>1</label>
        <input id={`bus2${trackIndex}`} type="checkbox" />
        <label htmlFor={`bus2${trackIndex}`}>2</label>
      </div>
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
