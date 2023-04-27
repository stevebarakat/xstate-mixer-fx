import { MixerMachineContext } from "../App";
import Range from "./Range";
import AutomateMode from "./AutomateMode";
import { useRef, useEffect } from "react";
import { Loop, Transport as t } from "tone";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db";

function Pan({ trackIndex, channel }) {
  const [state, send] = MixerMachineContext.useActor();
  const pan = parseFloat(state.context.pans[trackIndex]);
  const recordLoop = useRef(null);
  const automateLoop = useRef(null);
  const currentTracks = JSON.parse(localStorage.getItem("currentTracks"));
  const trackData = useLiveQuery(async () => {
    const trackData = await db[`track${trackIndex + 1}`]
      .where("id")
      .equals("pan")
      .toArray();

    return trackData;
  });

  // !!! --- RECORD --- !!! //
  useEffect(() => {
    recordLoop.current = new Loop(() => {
      if (currentTracks[trackIndex].automateMode.pan !== "record") return;
      send({
        type: "RECORD",
        id: "pan",
        trackIndex,
        value: pan,
      });
    }, 0.1).start(0);

    return () => {
      recordLoop.current.dispose();
    };
  }, [send, trackIndex, currentTracks, pan]);

  // !!! --- AUTOMATE --- !!! //
  useEffect(() => {
    automateLoop.current = new Loop(() => {
      send({
        type: "AUTOMATE",
        id: "pan",
        trackIndex,
        channel,
        trackData,
      });
    }, 0.1).start(0);

    return () => {
      automateLoop.current.dispose();
    };
  }, [send, trackIndex, trackData, channel]);

  return (
    <>
      <Range
        id={`trackPan${trackIndex}`}
        className="range-x"
        min={-1}
        max={1}
        step={0.01}
        value={pan}
        onChange={(e) => {
          send({
            type: "CHANGE_PAN",
            target: e.target,
            channel,
          });
        }}
      />
      <AutomateMode trackIndex={trackIndex} id="pan" />
    </>
  );
}

export default Pan;
