import { useState } from "react";
import { dBToPercent, scale } from "../utils/scale";
import Range from "./Range";

function TrackVolume({ channel, trackIndex }) {
  const currentTracks = JSON.parse(localStorage.getItem("currentTracks"));
  const ubu = currentTracks.map((currentTrack) => currentTrack.volume);
  console.log("ubu", ubu);
  const [volumes, setVolumes] = useState([...ubu] ?? [-32, -32, -32, -32]);

  return (
    <>
      <div className="window">{`${volumes[trackIndex].toFixed(0)} dB`}</div>
      <Range
        id={`trackVol${trackIndex}`}
        className="range-y"
        min={-100}
        max={12}
        step={0.1}
        value={volumes[trackIndex]}
        onChange={(e) => {
          const trackIndex = e.target.id.at(-1);
          const value = parseFloat(e.target.value);
          const scaled = dBToPercent(scale(value));
          channel.volume.value = scaled;
          volumes[trackIndex] = value;
          setVolumes([...volumes]);
          currentTracks[trackIndex].volume = value;
          localStorage.setItem(
            "currentTracks",
            JSON.stringify([...currentTracks])
          );
        }}
      />
    </>
  );
}

export default TrackVolume;
