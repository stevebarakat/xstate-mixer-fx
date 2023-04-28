export default function Reverber({ reverb }) {
  const changeReverbsMix = (e) => {
    reverb.wet.value = e.target.value;
  };

  return (
    <div>
      <h3>Reverb</h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="mix">Mix:</label>
        <input
          type="range"
          className="simple-range"
          name="mix"
          min={0}
          max={1}
          step={0.01}
          onChange={changeReverbsMix}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="pre-delay">Pre Delay:</label>
        <input
          type="range"
          className="simple-range"
          name="pre-delay"
          min={0}
          max={1}
          step={0.01}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="decay">Decay:</label>
        <input
          type="range"
          className="simple-range"
          name="decay"
          min={0.1}
          max={20}
          step={0.1}
        />
      </div>
    </div>
  );
}
