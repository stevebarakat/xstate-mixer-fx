import { useState } from "react";
import { Destination } from "tone";
import { dBToPercent, scale } from "../utils/scale";
import Range from "./Range";

function MainVolume({ channel, trackIndex }) {
  const [mainVolume, setMainVolume] = useState(-32);
  return (
    <div className="channel">
      <div className="window">{`${mainVolume.toFixed(0)} dB`}</div>
      <div className="range-y">
        <Range
          id="main"
          min={-100}
          max={12}
          step={0.1}
          value={mainVolume}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            const scaled = dBToPercent(scale(value));
            Destination.volume.value = scaled;
            setMainVolume(value);
          }}
        />
      </div>
      <span>Main</span>
    </div>
  );
}

export default MainVolume;
