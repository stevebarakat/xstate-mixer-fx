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
import { Rnd } from "react-rnd";

export const Mixer = ({ song }) => {
  const tracks = song.tracks;
  const [state, send] = MixerMachineContext.useActor();
  const [channels] = useChannelStrip({ tracks });

  console.log("state", state.value.stopped);
  console.log('state.stopped.matches("stopped)', state.matches("inactive"));
  const reverb = useRef();
  const delay = useRef();
  const busChannel = useRef();

  useEffect(() => {
    switch (state.context.bus1fx1) {
      case "nofx":
        // busChannel.current?.disconnect();
        busChannel.current = new Channel().toDestination();
        break;
      case "reverb":
        reverb.current = new Reverb(3).toDestination();
        // busChannel.current?.disconnect();
        busChannel.current = new Channel().connect(reverb.current);
        busChannel.current.receive("reverb");
        break;
      case "delay":
        delay.current = new FeedbackDelay("8n", 0.5).toDestination();
        // busChannel.current?.disconnect();
        busChannel.current = new Channel().connect(delay.current);
        busChannel.current.receive("delay");
        break;
      default:
        break;
    }

    switch (state.context.bus1fx2) {
      case "nofx":
        // busChannel.current?.disconnect();
        busChannel.current = new Channel().toDestination();
        break;
      case "reverb":
        reverb.current = new Reverb(3).toDestination();
        // busChannel.current?.disconnect();
        busChannel.current = new Channel().chain(reverb.current);
        busChannel.current.receive("reverb");
        break;
      case "delay":
        delay.current = new FeedbackDelay("8n", 0.5).toDestination();
        // busChannel.current?.disconnect();
        busChannel.current = new Channel().chain(delay.current);
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
  }, [state.context.bus1fx2, state.context.bus1fx1]);

  return state.value === "loading" ? (
    <Loader song={song} />
  ) : (
    <div className="mixer">
      <div>
        {song.artist} - {song.title}
      </div>
      {state.context.bus1fx1 === "reverb" ||
      state.context.bus1fx2 === "reverb" ? (
        state.value.stopped === "active" ? (
          <Rnd
            className="fx-panel"
            default={{
              x: 0,
              y: 0,
              width: 320,
              height: 200,
            }}
          >
            <button
              onClick={(e) => {
                send("TOGGLE");
              }}
            >
              X
            </button>
            <Reverber reverb={reverb.current} />
          </Rnd>
        ) : null
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
