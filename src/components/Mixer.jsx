import { useEffect, useRef } from "react";
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
import { MixerMachineContext } from "../App";
import { shallowEqual } from "@xstate/react";

export const Mixer = ({ song }) => {
  const { send } = MixerMachineContext.useActorRef();
  const activeBuses = MixerMachineContext.useSelector((state) => {
    const { bus1fx1, bus1fx2, bus2fx1, bus2fx2 } = state.context;
    return { bus1fx1, bus1fx2, bus2fx1, bus2fx2 };
  }, shallowEqual);
  const isLoading = MixerMachineContext.useSelector(
    (state) => state.value === "loading"
  );
  const isActive = MixerMachineContext.useSelector((state) =>
    state.hasTag("active")
  );
  const tracks = song.tracks;
  const [channels] = useChannelStrip({ tracks });

  const reverb1 = useRef(new Reverb().toDestination());
  const delay1 = useRef(new FeedbackDelay().toDestination());
  const reverb2 = useRef(new Reverb().toDestination());
  const delay2 = useRef(new FeedbackDelay().toDestination());
  const busChannels = useRef([new Channel(), new Channel()]);

  useEffect(() => {
    fx(2).forEach((_, i) => {
      fx(2).forEach((_, j) => {
        switch (activeBuses[`bus${i + 1}fx${j + 1}`]) {
          case "nofx1":
            busChannels.current[0].disconnect();
            busChannels.current[0] = new Channel();
            break;
          case "nofx2":
            busChannels.current[1].disconnect();
            busChannels.current[1] = new Channel();
            break;
          case "reverb1":
            busChannels.current[0].disconnect();
            busChannels.current[0] = new Channel().connect(reverb1.current);
            busChannels.current[0].receive("reverb1");
            break;
          case "delay1":
            busChannels.current[0].disconnect();
            busChannels.current[0] = new Channel().connect(delay1.current);
            busChannels.current[0].receive("delay1");
            break;
          case "reverb2":
            busChannels.current[1].disconnect();
            busChannels.current[1] = new Channel().connect(reverb2.current);
            busChannels.current[1].receive("reverb2");
            break;
          case "delay2":
            busChannels.current[1].disconnect();
            busChannels.current[1] = new Channel().connect(delay2.current);
            busChannels.current[1].receive("delay2");
            break;
          default:
            break;
        }
      });
    });
  }, [activeBuses]);

  return isLoading ? (
    <Loader song={song} />
  ) : (
    <div className="mixer">
      <div>
        {song.artist} - {song.title}
      </div>
      {isActive && (
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
              switch (activeBuses[`bus${i + 1}fx${j + 1}`]) {
                case "reverb1":
                  return <Reverber key="reverb1" reverb={reverb1.current} />;
                case "delay1":
                  return (
                    <Delay
                      key={`bus${i}delay${j}`}
                      delay={
                        delay1.current !== undefined ? delay1.current : null
                      }
                      channel={busChannels.current[0]}
                      busIndex={0}
                      fxIndex={0}
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
      {isActive && (
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
              switch (activeBuses[`bus${i + 1}fx${j + 1}`]) {
                case "reverb2":
                  return <Reverber key="reverb2" reverb={reverb2.current} />;
                case "delay2":
                  return (
                    <Delay
                      key={`bus${i}delay${j}`}
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
          <Bus key={i} busChannels={busChannels} busIndex={i} />
        ))}
        <MainVolume />
      </div>
      <Transport song={song} />
    </div>
  );
};
