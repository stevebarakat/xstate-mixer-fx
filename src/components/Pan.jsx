import { useState } from "react";
import Range from "./Range";

function Pan({ trackIndex, channel }) {
  const [pans, setPans] = useState([0, 0, 0, 0]);
  const currentTracks = JSON.parse(localStorage.getItem("currentTracks"));

  return (
    <>
      <Range
        id={`trackPan${trackIndex}`}
        className="range-x"
        min={-1}
        max={1}
        step={0.01}
        value={pans[trackIndex]}
        onChange={(e) => {
          const trackIndex = e.target.id.at(-1);
          const value = parseFloat(e.target.value);
          channel.pan.value = value;
          const tempPans = pans;
          tempPans[trackIndex] = value;
          setPans([...tempPans]);
          currentTracks[trackIndex].pan = value;
          localStorage.setItem(
            "currentTracks",
            JSON.stringify([...currentTracks])
          );
        }}
      />
    </>
  );
}

export default Pan;
