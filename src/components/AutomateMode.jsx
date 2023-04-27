import { MixerMachineContext } from "../App";

function AutomateMode({ trackIndex, id }) {
  const [, send] = MixerMachineContext.useActor();

  function changeAutomateMode(e) {
    send({
      type: "CHANGE_AUTOMATE_MODE",
      target: e.target,
      id,
    });
  }

  const currentTracks = JSON.parse(localStorage.getItem("currentTracks"));
  const automateMode = currentTracks[trackIndex].automateMode[`${id}`];

  return (
    <div className="pbm-btn">
      <input
        type="radio"
        id={`record-${id}-${trackIndex}`}
        name={`pbm-${id}-${trackIndex}`}
        value="record"
        onChange={changeAutomateMode}
        checked={automateMode === "record"}
      />
      <label htmlFor={`record-${id}-${trackIndex}`}>R</label>

      <input
        type="radio"
        id={`automate-${id}-${trackIndex}`}
        name={`pbm-${id}-${trackIndex}`}
        value="automate"
        onChange={changeAutomateMode}
        checked={automateMode === "automate"}
      />
      <label htmlFor={`automate-${id}-${trackIndex}`}>P</label>

      <input
        type="radio"
        id={`static-${id}-${trackIndex}`}
        name={`pbm-${id}-${trackIndex}`}
        value="static"
        onChange={changeAutomateMode}
        checked={automateMode === "static"}
      />
      <label htmlFor={`static-${id}-${trackIndex}`}>S</label>
    </div>
  );
}

export default AutomateMode;
