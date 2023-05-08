import { useState } from "react";

function Mute({ trackIndex, channel }) {
  const currentTracks = JSON.parse(localStorage.getItem("currentTracks"));

  const [mutes, setMutes] = useState([false, false, false, false]);

  return (
    <>
      <input
        id={`trackMute${trackIndex}`}
        type="checkbox"
        onChange={(e) => {
          const trackIndex = e.target.id.at(-1);
          const checked = e.target.checked;
          channel.mute = checked;
          const tempMutes = mutes;
          tempMutes[trackIndex] = checked;
          setMutes([...tempMutes]);
          currentTracks[trackIndex].mute = checked;
          localStorage.setItem(
            "currentTracks",
            JSON.stringify([...currentTracks])
          );
        }}
        checked={mutes[trackIndex]}
      />
      <label htmlFor={`trackMute${trackIndex}`}>M</label>
    </>
  );
}

export default Mute;
