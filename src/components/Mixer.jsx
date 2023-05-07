import { useState, useEffect, useRef } from "react";
import { array as fx } from "../utils";
import { Channel, Reverb, FeedbackDelay, Destination } from "tone";
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

  const reverb1 = useRef(new Reverb(3).toDestination());
  const delay1 = useRef(new FeedbackDelay().toDestination());
  const reverb2 = useRef(new Reverb(3).toDestination());
  const delay2 = useRef(new FeedbackDelay().toDestination());
  const busChannels = useRef([]);

  useEffect(() => {
    fx(2).forEach((_, i) => {
      fx(2).forEach((_, j) => {
        switch (state.context[`bus${i + 1}fx${j + 1}`]) {
          case "nofx":
            busChannels.current[i] = new Channel().toDestination();
            break;
          case "reverb1":
            console.log("reverb1", reverb1);
            busChannels.current[0] = new Channel().connect(reverb1.current);
            busChannels.current[0].receive("reverb1");
            break;
          case "delay1":
            busChannels.current[0] = new Channel().connect(delay1.current);
            busChannels.current[0].receive("delay1");
            break;
          case "reverb2":
            console.log("reverb2", reverb2);
            busChannels.current[1] = new Channel().connect(reverb2.current);
            busChannels.current[1].receive("reverb2");
            break;
          case "delay2":
            busChannels.current[1] = new Channel().connect(delay2.current);
            busChannels.current[1].receive("delay2");
            break;
          default:
            break;
        }
      });
    });
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
              return fx(2).map((_, j) => {
                switch (state.context[`bus${i}fx${j}`]) {
                  case "reverb1":
                    return <Reverber key={i} reverb={reverb1.current} />;
                  case "delay1":
                    return (
                      <Delay
                        key={i}
                        delay={
                          delay1.current !== undefined ? delay1.current : null
                        }
                        busIndex={0}
                        fxIndex={0}
                      />
                    );
                  case "reverb2":
                    return <Reverber key={i} reverb={reverb2.current} />;
                  case "delay2":
                    return (
                      <Delay
                        key={i}
                        delay={
                          delay2.current !== undefined ? delay2.current : null
                        }
                        busIndex={1}
                        fxIndex={1}
                      />
                    );
                  default:
                    break;
                }
                return null;
              });
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
