import Pan from "./Pan";
import Solo from "./Solo";
import Mute from "./Mute";
import TrackVolume from "./TrackVolume";
import { Destination } from "tone";

function ChannelStrip({ track, trackIndex, channel, channels }) {
  return (
    <div>
      <div className="bus-btn">
        <input
          id={`bus1${trackIndex}`}
          type="checkbox"
          onChange={(e) => {
            const id = e.target.id.at(-1);
            if (e.target.checked) {
              channels[id].send("reverb1");
              channels[id].send("delay1");
            } else {
              channels[id].disconnect();
              channels[id].connect(Destination);
            }
          }}
        />
        <label htmlFor={`bus1${trackIndex}`}>1</label>
        <input
          id={`busFxPanel2${trackIndex}`}
          type="checkbox"
          onChange={(e) => {
            const id = e.target.id.at(-1);
            if (e.target.checked) {
              channels[id].send("reverb2");
              channels[id].send("delay2");
            }
          }}
        />
        <label htmlFor={`busFxPanel2${trackIndex}`}>2</label>
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
