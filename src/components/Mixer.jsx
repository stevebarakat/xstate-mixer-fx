import { useEffect, useState, useReducer, useRef } from "react";
import { array as fx } from "../utils";
import { Channel, Reverb, FeedbackDelay } from "tone";
import useChannelStrip from "../hooks/useChannelStrip";
import Transport from "./Transport";
import Loader from "./Loader";
import ChannelStrip from "./ChannelStrip";
import Reverber from "./Fx/Reverber";
import Delay from "./Fx/Delay";
import MainVolume from "./MainVolume";
import Bus from "./Bus";
import { Rnd } from "react-rnd";
import fxReducer from "../state/fxReducer";

const initialState = {
  bus1fx1: "nofx",
  bus1fx2: "nofx",
  bus2fx1: "nofx",
  bus2fx2: "nofx",
};

export const Mixer = ({ song }) => {
  const [state, dispatch] = useReducer(fxReducer, initialState);
  const tracks = song.tracks;
  const [isOpen, setIsOpen] = useState(false);
  const [channels, isLoaded] = useChannelStrip({ tracks });

  const reverb1 = useRef(new Reverb(3));
  const delay1 = useRef(new FeedbackDelay().toDestination());
  const reverb2 = useRef(new Reverb(3).toDestination());
  const delay2 = useRef(new FeedbackDelay().toDestination());
  const busChannels = useRef([new Channel(), new Channel()]);

  useEffect(() => {
    fx(2).forEach((_, i) => {
      fx(2).forEach((_, j) => {
        switch (state[`bus${i + 1}fx${j + 1}`]) {
          case "nofx":
            break;
          case "reverb1":
            // reverb1.current = new Reverb(3).toDestination();
            busChannels.current[0].connect(reverb1.current);
            busChannels.current[0].receive("reverb1");
            break;
          case "delay1":
            // delay1.current = new FeedbackDelay().toDestination();
            busChannels.current[0].connect(delay1.current);
            busChannels.current[0].receive("delay1");
            break;
          case "reverb2":
            // reverb2.current = new Reverb(3).toDestination();
            busChannels.current[1].connect(reverb2.current);
            busChannels.current[1].receive("reverb2");
            break;
          case "delay2":
            // delay2.current = new FeedbackDelay().toDestination();
            busChannels.current[1].connect(delay2.current);
            busChannels.current[1].receive("delay2");
            break;
          default:
            break;
        }
      });
    });

    // return () => {
    //   reverb1.current?.dispose();
    //   delay1.current?.dispose();
    //   reverb2.current?.dispose();
    //   delay2.current?.dispose();
    //   busChannels.current.forEach((busChannel) => busChannel.dispose());
    //   busChannels.current = [];
    // };
  }, [state]);

  return !isLoaded ? (
    <Loader song={song} />
  ) : (
    <div className="mixer">
      <div>
        {song.artist} - {song.title}
      </div>
      {!isOpen && (
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
          <button onClick={() => setIsOpen(!isOpen)}>X</button>

          {fx(2).map((_, i) => {
            return fx(2).map((_, j) => {
              console.log(state[`bus${i}fx${j}`]);
              switch (state[`bus${i}fx${j}`]) {
                case "reverb1":
                  return <Reverber key={i} reverb={reverb1.current} />;
                case "delay1":
                  return (
                    <Delay
                      key={i}
                      delay={
                        delay1.current !== undefined ? delay1.current : null
                      }
                      channel={busChannels.current[0]}
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
                      channel={busChannels.current[1]}
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
          <Bus
            key={i}
            busChannel={busChannel}
            busIndex={i}
            state={state}
            dispatch={dispatch}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        ))}
        <MainVolume />
      </div>
      <Transport song={song} />
    </div>
  );
};
