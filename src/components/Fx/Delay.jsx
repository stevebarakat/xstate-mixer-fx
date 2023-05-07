import { useState } from "react";

export default function Delay({ delay, busIndex, fxIndex }) {
  const currentMix = JSON.parse(localStorage.getItem("currentMix"));
  const [delaysMix, setDelaysMix] = useState([
    [-32, -32],
    [-32, -32],
  ]);
  const [delaysTime, setDelaysTime] = useState([
    [0.5, 0.5],
    [0.5, 0.5],
  ]);
  const [delaysFeedback, setDelaysFeedback] = useState([
    [0.5, 0.5],
    [0.5, 0.5],
  ]);

  return (
    <div>
      <h3>Delay</h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="mix">Mix:</label>
        <input
          type="range"
          className="simple-range"
          id="mix"
          min={0}
          max={1}
          step={0.01}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            currentMix.delaysMix[busIndex][fxIndex] = value;
            delaysMix[busIndex][fxIndex] = value;
            delay.wet.value = value;
            setDelaysMix([...delaysMix]);
            localStorage.setItem("currentMix", JSON.stringify(currentMix));
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="delay-time">Delay Time:</label>
        <input
          type="range"
          className="simple-range"
          id="delay-time"
          min={0}
          max={1}
          step={0.01}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            currentMix.delaysTime[busIndex][fxIndex] = value;
            delaysTime[busIndex][fxIndex] = value;
            delay.delayTime.value = value;
            setDelaysTime([...delaysTime]);
            localStorage.setItem("currentMix", JSON.stringify(currentMix));
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="feedback">Feedback:</label>
        <input
          type="range"
          className="simple-range"
          name="feedback"
          min={0}
          max={1}
          step={0.01}
          value={delaysFeedback[busIndex][fxIndex]}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            currentMix.delaysFeedback[busIndex][fxIndex] = value;
            delaysFeedback[busIndex][fxIndex] = value;
            delay.feedback.value = value;
            setDelaysFeedback([...delaysFeedback]);
            localStorage.setItem("currentMix", JSON.stringify(currentMix));
          }}
        />
      </div>
    </div>
  );
}
