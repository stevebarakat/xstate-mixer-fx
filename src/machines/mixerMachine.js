import { createMachine, assign } from "xstate";
import { pure } from "xstate/lib/actions";
import {
  start as initializeAudio,
  getContext as getAudioContext,
  Destination,
  Transport as t,
} from "tone";
import { dBToPercent, scale } from "../utils/scale";
import { getSong } from "../utils/getSong";
import { roxanne } from "../songs";

const actx = getAudioContext();
const [song, currentMix, currentTracks] = getSong(roxanne);
const initialVolumes = currentTracks.map((currentTrack) => currentTrack.volume);
const initialPans = currentTracks.map((currentTrack) => currentTrack.pan);
const initialMutes = currentTracks.map((currentTrack) => currentTrack.mute);
const initialSolos = currentTracks.map((currentTrack) => currentTrack.solo);
const initialBusVolumes = currentMix.busVolumes.map((volume) => volume);

export const mixerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFsCWAPMAnAxAJQFEBlAgFQG0AGAXUVAAcB7WVAF1UYDs6R1EA2AIwAWAHQBOYeIBMggBwB2AKwAaEAE9EAWgViAzIP7DK-aUoC+5tWky5CAdQCSAOQAiVWkhBMW7Ljz4EYSUlUTlxOWE9ZTVNBC1ouVFBM0trDGwcADEsjx4fNg5uL0DpPWlRJUo9cRMzWO1E5NSrEBtMgGEACQBBZwBxAgB9ADUAeQAZAFUAWQI8rwK-YtBA8P5k-gVxfkVVDW1BJUFRKX5KcWiLVvbcbr7BoZmel1HJ2fmafOZC-xLEORKMSUQSCBTyGIHeJ6c6iMw1OrXdK2HD3AbDABCUyIb2mcwWDB+ywC2mEKVOZOMpn2cT05UqCOpaTaGVwJFIQyxREEQyyAA1BATvESiiTodtRHphAp+EpqQ14mVKAzakybqycOzOdiefzpEKlqL-tD+BsqfUocETkZEczbqjeuihgAFPoGkV-VYAygKU5KAwW2lyDYKKVXO0a0hjfr9CbDIiTMbu3xGr0IQEbfjiGQQmnaaTK4RmBRyFJIlkoqMxuNPKakT6eQkpz28AF6ULCSJXBURSolssRlFox6EEYEPAYnEzRx85O-Fat8VJeVQwTiE7B8F7QedR0jghjic452EVwECY9ACac+Jxq0xj0FP9ZYVwg2NWCAfL9uHw1H48nIYzw6K8b1TRd71BJ8vwVHR9EMc1v1ZUQABtGAAQwgVBOCgHAJjGHoz3cL5Fg9BdAmMZVpGo2UVziLQUiSGVxGfFpkWwUR6BQ9D1Gw3DXWxBtvmbcjECkE5ZD2WDTAkQQQTlNiKw4rieL40RsPQgBjdgADcwBwKtYyE0iRLFCVTD0Sg3ykqFpF2ZJOyiZQdywTjuN4nDRC03T9MMuMwJbQJ5HEUQfRohS8wQOykhELtnPVWxRFgVhGHoehIBwZ0L2vEim3nMVDBC8oi1zaSKnXeS1XY1zktS9KIHUzhvNQPSDOjIyAtEoJpWSOR20uSE4mkXQ-QUaoBwSjjarSyAvO0lrfPa-zcuFUzjSBDYIjkaRS0DRAdo3CInOuVpOEYCA4B4W5hPyu9DElZjWMirRhpCqp+0U25UIwrCcJu2802MUJg3KXbnrXCpKB9MGXLc1S-pM260wMUQLKs3ZBsQUFfWzST4uquGPKgRrmr0-7wKCy5kjXEREQVOkTnDSbXJUom5p88nAsQWpkkufru1sygOxzbdmaSlKZogTmupqEL5H5zGEBSfQoY+pDEum+qSfmsnEYBxcQhOapjgi+m3zCdHRYJzXZtJsBpbFN9ga2UrbKguRVZhyxzCAA */
    id: "mixer",
    initial: "loading",
    context: {
      start: song?.start,
      end: song?.end,
      currentTime: t.seconds,
      mainVolume: currentMix.mainVolume,
      busVolumes: initialBusVolumes,
      volume: initialVolumes,
      pan: initialPans,
      solo: initialSolos,
      mute: initialMutes,
      buses: {
        bus1fx1: "nofx",
        bus1fx2: "nofx",
        bus2fx1: "nofx",
        bus2fx2: "nofx",
      },
      busData: {
        bus1: { isOpen: false, position: { x: 0, y: 0 } },
        bus2: { isOpen: false, position: { x: 0, y: 0 } },
      },
      busFxData: {
        reverbsMix: currentMix.busFxData.reverbsMix,
        reverbsPreDelay: currentMix.busFxData.reverbsPreDelay,
        reverbsDecay: currentMix.busFxData.reverbsDecay,
        delaysMix: currentMix.busFxData.delaysMix,
        delaysTime: currentMix.busFxData.delaysTime,
        delaysFeedback: currentMix.busFxData.delaysFeedback,
      },
    },
    on: {
      RESET: { actions: "reset", target: "stopped" },
      REWIND: { actions: "rewind" },
      FF: { actions: "fastForward" },
      CHANGE_VOLUME: { actions: "changeVolume" },
      CHANGE_MAIN_VOLUME: { actions: "changeMainVolume" },
      CHANGE_BUS_VOLUMES: { actions: "changeBusVolumes" },
      SET_BUS_FX: { actions: "setBusFx" },
      SET_BUS_DATA: { actions: "setBusData" },
      CHANGE_PAN: { actions: "changePan" },
      TOGGLE_SOLO: { actions: "toggleSolo" },
      TOGGLE_MUTE: { actions: "toggleMute" },
      CHANGE_REVERBS_MIX: { actions: "changeReverbsMix" },
      CHANGE_REVERBS_PREDELAY: { actions: "changeReverbsPredelay" },
      CHANGE_REVERBS_DECAY: { actions: "changeReverbsDecay" },
      CHANGE_DELAYS_MIX: { actions: "changeDelaysMix" },
      CHANGE_DELAYS_TIME: { actions: "changeDelaysTime" },
      CHANGE_DELAYS_FEEDBACK: { actions: "changeDelaysFeedback" },
    },
    states: {
      loading: { on: { LOADED: "stopped" } },
      playing: {
        entry: "play",
        on: {
          PAUSE: { target: "stopped", actions: "pause" },
        },
      },
      stopped: {
        on: {
          PLAY: { target: "playing" },
        },
      },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },

  {
    actions: {
      reset: () => t.stop(),
      pause: () => t.pause(),
      play: () => (actx.state === "suspended" ? initializeAudio : t.start()),

      fastForward: pure((context) => {
        t.seconds =
          context.currentTime < context.end - 10 ? t.seconds + 10 : context.end;
      }),

      rewind: pure((context) => {
        t.seconds =
          t.seconds > 10 + context.start ? t.seconds - 10 : context.start;
      }),

      changeMainVolume: pure((_, { target }) => {
        const value = parseFloat(target.value);
        const scaled = dBToPercent(scale(value));
        const volume = () => {
          Destination.volume.value = scaled;
        };
        currentMix.mainVolume = value;
        localStorage.setItem("currentMix", JSON.stringify(currentMix));
        return [assign({ mainVolume: value }), volume];
      }),

      changeBusVolumes: pure((context, { target, channel }) => {
        const busIndex = target.id.at(-1);
        const value = parseFloat(target.value);
        const scaled = dBToPercent(scale(value));
        const volume = () => {
          channel.volume.value = scaled;
        };
        const tempBusVols = context.busVolumes;
        tempBusVols[busIndex] = value;
        currentMix.busVolumes[busIndex] = value;
        localStorage.setItem("currentMix", JSON.stringify(currentMix));
        return [assign({ busVolumes: tempBusVols }), volume];
      }),

      changeVolume: pure((context, { target, channel }) => {
        const trackIndex = target.id.at(-1);
        const value = target.value;
        const scaled = dBToPercent(scale(parseFloat(value)));
        const channelVolume = () => {
          channel.volume.value = scaled;
        };
        const tempVols = context.volume;
        tempVols[trackIndex] = parseFloat(value);
        currentTracks[trackIndex].volume = value;
        localStorage.setItem(
          "currentTracks",
          JSON.stringify([...currentTracks])
        );
        return [assign({ volume: tempVols }), channelVolume];
      }),

      changePan: pure((context, { target, channel }) => {
        const trackIndex = target.id.at(-1);
        const value = parseFloat(target.value);
        const channelPan = () => {
          channel.pan.value = value;
        };
        const tempPans = context.pan;
        tempPans[trackIndex] = value;
        currentTracks[trackIndex].pan = value;
        localStorage.setItem(
          "currentTracks",
          JSON.stringify([...currentTracks])
        );
        return [assign({ pan: tempPans }), channelPan];
      }),

      toggleMute: pure((context, { target, channel }) => {
        const trackIndex = target.id.at(-1);
        const checked = target.checked;
        const muteChannel = () => {
          channel.mute = checked;
        };
        const tempMutes = context.mute;
        tempMutes[trackIndex] = checked;
        currentTracks[trackIndex].mute = target.checked;
        localStorage.setItem(
          "currentTracks",
          JSON.stringify([...currentTracks])
        );
        return [assign({ mute: tempMutes }), muteChannel];
      }),

      toggleSolo: pure((context, { target, channel }) => {
        const trackIndex = target.id.at(-1);
        const checked = target.checked;
        const soloChannel = () => {
          channel.solo = checked;
        };
        const tempSolos = context.solo;
        tempSolos[trackIndex] = checked;
        currentTracks[trackIndex].solo = target.checked;
        localStorage.setItem(
          "currentTracks",
          JSON.stringify([...currentTracks])
        );
        return [assign({ solo: tempSolos }), soloChannel];
      }),

      setBusFx: assign((context, { target, busIndex, fxIndex }) => {
        context.buses = {
          ...context.buses,
          [`bus${busIndex + 1}fx${fxIndex + 1}`]: target.value,
        };
        localStorage.setItem(
          "currentMix",
          JSON.stringify({
            ...currentMix,
            buses: {
              ...context.buses,
              [`bus${busIndex + 1}fx${fxIndex + 1}`]: target.value,
            },
          })
        );
      }),

      setBusData: assign((context, { busIndex }) => {
        context.busData = {
          ...context.busData,
          [`bus${busIndex + 1}`]: {
            isOpen: !context.busData[`bus${busIndex + 1}`].isOpen,
          },
        };
        localStorage.setItem(
          "currentMix",
          JSON.stringify({
            ...currentMix,
            busData: {
              ...context.busData,
              [`bus${busIndex + 1}`]: {
                isOpen: !context.busData[`bus${busIndex + 1}`].isOpen,
              },
            },
          })
        );
      }),

      changeReverbsMix: assign((context, { target, reverb }) => {
        reverb.wet.value = target.value;
      }),

      changeReverbsPredelay: assign((context, { target, reverb }) => {
        reverb.preDelay = target.value;
      }),

      changeReverbsDecay: assign((context, { target, reverb }) => {
        reverb.decay = target.value;
      }),

      changeDelaysMix: pure((context, { target, delay, busIndex, fxIndex }) => {
        const value = parseFloat(target.value);
        delay.wet.value = value;
        const tempDelaysMix = context.busFxData.delaysMix;
        tempDelaysMix[busIndex][fxIndex] = value;
        currentMix.busFxData.delaysMix[busIndex][fxIndex] = value;
        localStorage.setItem("currentMix", JSON.stringify(currentMix));
        return [assign({ delaysMix: tempDelaysMix })];
      }),
      changeDelaysTime: pure(
        (context, { target, delay, busIndex, fxIndex }) => {
          const value = parseFloat(target.value);
          delay.delayTime.value = value;
          const tempDelaysTime = context.busFxData.delaysTime;
          tempDelaysTime[busIndex][fxIndex] = value;
          currentMix.busFxData.delaysTime[busIndex][fxIndex] = value;
          localStorage.setItem("currentMix", JSON.stringify(currentMix));
          return [assign({ delaysTime: tempDelaysTime })];
        }
      ),
      changeDelaysFeedback: pure(
        (context, { target, delay, busIndex, fxIndex }) => {
          const value = parseFloat(target.value);
          delay.feedback.value = value;
          const tempDelaysFeedback = context.busFxData.delaysFeedback;
          tempDelaysFeedback[busIndex][fxIndex] = value;
          currentMix.busFxData.delaysFeedback[busIndex][fxIndex] = value;
          localStorage.setItem("currentMix", JSON.stringify(currentMix));
          return [assign({ delaysFeedback: tempDelaysFeedback })];
        }
      ),
    },
  }
);
