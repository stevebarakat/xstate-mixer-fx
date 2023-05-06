import { useState, useEffect, useRef } from "react";
import { array as fx } from "../utils";
import { Channel, Reverb, FeedbackDelay } from "tone";
import useChannelStrip from "../hooks/useChannelStrip";
import Transport from "./Transport";
import Loader from "./Loader";
import ChannelStrip from "./ChannelStrip";
import Reverber from "./Fx/Reverber";
import Delay from "./Fx/Delay";
import { MixerMachineContext } from "../App";
import MainVolume from "./MainVolume";
import BusOne from "./BusOne";
import { Rnd } from "react-rnd";

export const Mixer = ({ song }) => {
  const tracks = song.tracks;
  const [state, send] = MixerMachineContext.useActor();
  const [channels] = useChannelStrip({ tracks });

  const reverb = useRef();
  const delay = useRef();
  const busChannels = useRef([]);

  useEffect(() => {
    fx(2).forEach((_, i) => {
      switch (state.context[`bus1fx${i + 1}`]) {
        case "nofx":
          busChannels.current[i] = new Channel().toDestination();
          break;
        case "reverb":
          reverb.current = new Reverb(3).toDestination();
          busChannels.current[i] = new Channel().connect(reverb.current);
          busChannels.current[i].receive("reverb");
          break;
        case "delay":
          delay.current = new FeedbackDelay("8n", 0.5).toDestination();
          busChannels.current[i] = new Channel().connect(delay.current);
          busChannels.current[i].receive("delay");
          break;
        default:
          break;
      }
    });

    return () => {
      reverb.current?.dispose();
      delay.current?.dispose();
      busChannels.current.forEach((busChannel) => busChannel.dispose());
      busChannels.current = [];
    };
  }, [state.context]);

  return state.value === "loading" ? (
    <Loader song={song} />
  ) : (
    <div className="mixer">
      <div>
        {song.artist} - {song.title}
      </div>

      {(state.context.bus1fx1 !== "nofx" || state.context.bus1fx2 !== "nofx") &&
        state.hasTag("active") && (
          <Rnd
            className="fx-panel"
            default={{
              x: 0,
              y: 0,
              width: 320,
              height: "auto",
            }}
            cancel="input"
          >
            <button
              onClick={(e) => {
                send("TOGGLE");
              }}
            >
              X
            </button>

            {fx(2).map((_, i) => {
              switch (state.context[`bus1fx${i}`]) {
                case "reverb":
                  return <Reverber key={i} reverb={reverb.current} />;
                case "delay":
                  return <Delay key={i} delay={delay.current} />;
                default:
                  break;
              }
              return null;
            })}
          </Rnd>
        )}
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
        {busChannels.current.map((busChannel, i) => (
          <BusOne key={i} busChannel={busChannel} busIndex={i} />
        ))}
        <MainVolume />
      </div>
      <Transport song={song} />
    </div>
  );
};
