export default function Reverber({ reverb }) {
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
          // onChange={(e) => {
          //   // reverb &&
          //   send({
          //     type: "SET_BUS1_FX1_REVERB_WET",
          //     target: e.target,
          //     reverb,
          //   });
          // }}
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
          // onChange={(e) => {
          //   send({
          //     type: "CHANGE_REVERBS_PREDELAY",
          //     target: e.target,
          //     reverb,
          //   });
          // }}
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
          // onChange={(e) => {
          //   send({
          //     type: "CHANGE_REVERBS_DECAY",
          //     target: e.target,
          //     reverb,
          //   });
          // }}
        />
      </div>
    </div>
  );
}
