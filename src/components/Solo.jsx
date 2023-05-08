import { useState } from "react";

function Solo({ trackIndex, channel }) {
  const currentTracks = JSON.parse(localStorage.getItem("currentTracks"));

  const [solos, setSolos] = useState([false, false, false, false]);

  return (
    <>
      <input
        id={`trackSolo${trackIndex}`}
        type="checkbox"
        onChange={(e) => {
          const trackIndex = e.target.id.at(-1);
          const checked = e.target.checked;
          channel.solo = checked;
          const tempSolos = solos;
          tempSolos[trackIndex] = checked;
          setSolos([...tempSolos]);
          currentTracks[trackIndex].solo = checked;
          localStorage.setItem(
            "currentTracks",
            JSON.stringify([...currentTracks])
          );
        }}
        checked={solos[trackIndex]}
      />
      <label htmlFor={`trackSolo${trackIndex}`}>S</label>
    </>
  );
}

export default Solo;
