import { MixerMachineContext } from "../App";
import Range from "./Range";
import AutomateMode from "./AutomateMode";
import { useRef, useEffect } from "react";
import { Loop, Transport as t } from "tone";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db";

function TrackVolume({ channel, trackIndex }) {
  const [state, send] = MixerMachineContext.useActor();
  const volume = parseFloat(state.context.volumes[trackIndex]);
  const recordLoop = useRef(null);
  const automateLoop = useRef(null);
  const currentTracks = JSON.parse(localStorage.getItem("currentTracks"));
  const trackData = useLiveQuery(async () => {
    const trackData = await db[`track${trackIndex + 1}`]
      .where("id")
      .equals("volume")
      .toArray();

    return trackData;
  });

  // !!! --- RECORD --- !!! //
  useEffect(() => {
    recordLoop.current = new Loop(() => {
      if (currentTracks[trackIndex].automateMode.volume !== "record") return;
      send({
        type: "RECORD",
        id: "volume",
        trackIndex,
        value: volume,
      });
    }, 0.1).start(0);

    return () => {
      recordLoop.current.dispose();
    };
  }, [send, trackIndex, currentTracks, volume]);

  // !!! --- AUTOMATE --- !!! //
  useEffect(() => {
    automateLoop.current = new Loop(() => {
      send({
        type: "AUTOMATE",
        id: "volume",
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
      <div className="window">{`${volume.toFixed(0)} dB`}</div>
      <Range
        id={`trackVol${trackIndex}`}
        className="range-y"
        min={-100}
        max={12}
        step={0.1}
        value={volume}
        onChange={(e) => {
          send({
            type: "CHANGE_VOLUME",
            target: e.target,
            channel,
          });
        }}
      />
      <AutomateMode trackIndex={trackIndex} id="volume" />
    </>
  );
}

export default TrackVolume;
