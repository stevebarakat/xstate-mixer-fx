import { useEffect, useRef } from "react";
import { Channel, Reverb, FeedbackDelay } from "tone";
import useChannelStrip from "../hooks/useChannelStrip";
import Transport from "./Transport";
import Loader from "./Loader";
import ChannelStrip from "./ChannelStrip";
import Reverber from "./Fx/Reverber";
import { MixerMachineContext } from "../App";
import MainVolume from "./MainVolume";
import BusOne from "./BusOne";

export const Mixer = ({ song }) => {
  const tracks = song.tracks;
  const [state] = MixerMachineContext.useActor();
  const [channels] = useChannelStrip({ tracks });

  console.log("state.context", state.context);
  const reverb = useRef();
  const delay = useRef();
  const busChannel = useRef();

  useEffect(() => {
    switch (state.context.fx) {
      case "nofx":
        busChannel.current?.disconnect();
        busChannel.current = new Channel().toDestination();
        break;
      case "reverb":
        reverb.current = new Reverb(3).toDestination();
        busChannel.current?.disconnect();
        busChannel.current = new Channel().connect(reverb.current);
        busChannel.current.receive("reverb");
        break;
      case "delay":
        delay.current = new FeedbackDelay("8n", 0.5).toDestination();
        busChannel.current?.disconnect();
        busChannel.current = new Channel().connect(delay.current);
        busChannel.current.receive("delay");
        break;
      default:
        break;
    }

    return () => {
      reverb.current?.dispose();
      delay.current?.dispose();
      busChannel.current?.dispose();
    };
  }, [state.context.fx]);
  return state.value === "loading" ? (
    <Loader song={song} />
  ) : (
    <div className="mixer">
      <div>
        {song.artist} - {song.title}
      </div>
      {state.context.fx === "reverb" ? (
        <Reverber reverb={reverb.current} />
      ) : null}
      <div className="channels">
        <div>
          {tracks.map((track, i) => (
            <ChannelStrip
              key={track.path}
              track={track}
              trackIndex={i}
              channel={channels.current[i]}
              channels={channels.current}
            />
          ))}
        </div>
        <BusOne busChannel={busChannel.current} />
        <MainVolume />
      </div>
      <Transport song={song} />
    </div>
  );
};
