import { createMachine, assign } from "xstate";
import { pure } from "xstate/lib/actions";
import { start, getContext, Destination, Transport as t } from "tone";
import { dBToPercent, scale } from "../utils/scale";
import { getSong } from "../utils/getSong";
import { roxanne } from "../songs";

const context = getContext();
const [song, currentMix, currentTracks] = getSong(roxanne);
const initialVolumes = currentTracks.map((currentTrack) => currentTrack.volume);
const initialPans = currentTracks.map((currentTrack) => currentTrack.pan);
const initialMutes = currentTracks.map((currentTrack) => currentTrack.mute);
const initialSolos = currentTracks.map((currentTrack) => currentTrack.solo);

export const mixerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFsCWAPMAnAxAJQFEBlAgFQG0AGAXUVAAcB7WVAF1UYDs6R1EA2AIwAWAHQBOYeIBMggBwB2AKwAaEAE9EAWgViAzIP7DK-aUoC+5tWky5CAdQCSAOQAiVWkhBMW7Ljz4EYSUlUTlxOWE9ZTVNBC1ouVFBM0trDGwcADEsjx4fNg5uL0DpPWlRJUo9cRMzWO1E5NSrEBtMgGEACQBBZwBxAgB9ADUAeQAZAFUAWQI8rwK-YtBA8P5k-gVxfkVVDW1BJUFRKX5KcWiLVvbcbr7BoZmel1HJ2fmafOZC-xLEORKMSUQSCBTyGIHeJ6c6iMw1OrXdK2HD3AbDABCUyIb2mcwWDB+ywC2mEKVOZOMpn2cT05UqCOpaTaGVwJFIQyxREEQyyAA1BATvESiiTodtRHphAp+EpqQ14mVKAzakybqycOzOdiefzpEKlqL-tD+BsqfUocETkZEczbqjeuihgAFPoGkV-VYAygKU5KAwW2lyDYKKVXO0a0hjfr9CbDIiTMbu3xGr0IQEbfjiGQQmnaaTK4RmBRyFJIlkoqMxuNPKakT6eQkpz28AF6ULCSJXBURSolssRlFox6EEYEPAYnEzRx85O-Fat8VJeVQwTiE7B8F7QedR0jghjic452EVwECY9ACac+Jxq0xj0FP9ZYVwg2NWCAfL9uHw1H48nIYzw6K8b1TRd71BJ8vwVHR9EMc1v1ZUQABtGAAQwgVBOCgHAJjGHoz3cL5Fg9BdAmMZVpGo2UVziLQUiSGVxGfFpkWwUR6BQ9D1Gw3DXWxBtvmbcjECkE5ZD2WDTAkQQQTlNiKw4rieL40RsPQgBjdgADcwBwKtYyE0iRLFCVTD0Sg3ykqFpF2ZJOyiZQdywTjuN4nDRC03T9MMuMwJbQJ5HEUQfRohS8wQOykhELtnPVWxRFgVhGHoehIBwZ0L2vEim3nMVDBC8oi1zaSKnXeS1XY1zktS9KIHUzhvNQPSDOjIyAtEoJpWSOR20uSE4mkXQ-QUaoBwSjjarSyAvO0lrfPa-zcuFUzjSBDYIjkaRS0DRAdo3CInOuVpOEYCA4B4W5hPyu9DElZjWMirRhpCqp+0U25UIwrCcJu2802MUJg3KXbnrXCpKB9MGXLc1S-pM260wMUQLKs3ZBsQUFfWzST4uquGPKgRrmr0-7wKCy5kjXEREQVOkTnDSbXJUom5p88nAsQWpkkufru1sygOxzbdmaSlKZogTmupqEL5H5zGEBSfQoY+pDEum+qSfmsnEYBxcQhOapjgi+m3zCdHRYJzXZtJsBpbFN9ga2UrbKguRVZhyxzCAA */
    id: "mixer",
    initial: "loading",
    context: {
      mainVolume: -32,
      busVolumes: [-32, -32],
      volumes: initialVolumes,
      pans: initialPans,
      solos: initialSolos,
      mutes: initialMutes,
      bus1fx1: "nofx",
      bus1fx2: "nofx",
      bus2fx1: "nofx",
      bus2fx2: "nofx",
      reverbsMix: currentMix.reverbsMix,
      reverbsPreDelay: currentMix.reverbsPreDelay,
      reverbsDecay: currentMix.reverbsDecay,
      delaysMix: currentMix.delaysMix,
      delaysTime: currentMix.delaysTime,
      delaysFeedback: currentMix.delaysFeedback,
    },
    on: {
      RESET: { actions: "reset", target: "stopped" },
      REWIND: { actions: "rewind" },
      FF: { actions: "fastForward" },
      CHANGE_VOLUME: { actions: "changeVolume" },
      CHANGE_MAIN_VOLUME: { actions: "changeMainVolume" },
      CHANGE_BUS_VOLUMES: { actions: "changeBusVolumes" },
      SET_BUS1_FX1: { actions: "setBus1Fx1" },
      SET_BUS1_FX2: { actions: "setBus1Fx2" },
      SET_BUS2_FX1: { actions: "setBus2Fx1" },
      SET_BUS2_FX2: { actions: "setBus2Fx2" },
      CHANGE_PAN: { actions: "changePan" },
      TOGGLE_SOLO: { actions: "toggleSolo" },
      TOGGLE_MUTE: { actions: "toggleMute" },
      CHANGE_REVERBS_MIX: { actions: "changeReverbsMix" },
      CHANGE_REVERBS_PREDELAY: { actions: "changeReverbsPredelay" },
      CHANGE_REVERBS_DECAY: { actions: "changeReverbsDecay" },
      CHANGE_DELAYS_MIX: { actions: "changeDelaysMix" },
      CHANGE_DELAYS_DELAY_TIME: { actions: "changeDelaysTime" },
      CHANGE_DELAYS_FEEDBACK: { actions: "changeDelaysFeedback" },
    },

    states: {
      loading: { on: { LOADED: "stopped" } },
      playing: {
        initial: "inactive",
        entry: "play",
        states: {
          inactive: {
            tags: "active",
            on: {
              TOGGLE: "active",
            },
          },
          active: {
            tags: "inactive",
            on: {
              TOGGLE: "inactive",
            },
          },
        },
        on: {
          PAUSE: { target: "stopped", actions: "pause" },
        },
      },
      stopped: {
        initial: "inactive",
        states: {
          inactive: {
            tags: "active",
            on: {
              TOGGLE: "active",
            },
          },
          active: {
            tags: "inactive",
            on: {
              TOGGLE: "inactive",
            },
          },
        },
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
      play: () => {
        if (context.state === "suspended") {
          start(); // initialize audio context
          t.start();
        } else {
          t.start();
        }
      },
      pause: () => t.pause(),
      reset: () => {
        t.stop();
        t.seconds = song.start ?? 0;
      },
      fastForward: () =>
        (t.seconds =
          t.seconds < song.end - 10 ? t.seconds + 10 : (t.seconds = song.end)),
      rewind: () =>
        (t.seconds = t.seconds > 10 + song.start ? t.seconds - 10 : song.start),

      changeMainVolume: pure((_, { target }) => {
        const scaled = dBToPercent(scale(parseFloat(target.value)));
        const volume = () => {
          Destination.volume.value = scaled;
        };
        return [assign({ mainVolume: parseFloat(target.value) }), volume];
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
        return [assign({ busVolumes: tempBusVols }), volume];
      }),

      setBus1Fx1: assign((context, { target }) => {
        context.bus1fx1 = target.value;
      }),

      setBus1Fx2: assign((context, { target }) => {
        context.bus1fx2 = target.value;
      }),

      setBus2Fx1: assign((context, { target }) => {
        context.bus2fx1 = target.value;
      }),

      setBus2Fx2: assign((context, { target }) => {
        context.bus2fx2 = target.value;
      }),

      changeVolume: pure((context, { target }) => {
        const trackIndex = target.id.at(-1);
        const value = target.value;

        const tempVols = context.volumes;
        tempVols[trackIndex] = parseFloat(value);
        return [assign({ volumes: tempVols })];
      }),

      changePan: pure((context, { target, channel }) => {
        const trackIndex = target.id.at(-1);
        const value = parseFloat(target.value);
        const channelPan = () => {
          channel.pan.value = value;
        };
        const tempPans = context.pans;
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
        const tempMutes = context.mutes;
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
        const tempSolos = context.solos;
        tempSolos[trackIndex] = checked;
        currentTracks[trackIndex].solo = target.checked;
        localStorage.setItem(
          "currentTracks",
          JSON.stringify([...currentTracks])
        );
        return [assign({ solo: tempSolos }), soloChannel];
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

      changeDelaysMix: assign((context, { target, delay }) => {
        delay.wet.value = target.value;
      }),

      changeDelaysTime: assign((context, { target, delay }) => {
        delay.delayTime.value = target.value;
      }),

      changeDelaysFeedback: pure(
        (context, { target, delay, busIndex, fxIndex }) => {
          const value = parseFloat(target.value);
          delay.feedback.value = parseFloat(value);
          currentMix.delaysFeedback[busIndex][fxIndex] = value;
          localStorage.setItem("currentMix", JSON.stringify(currentMix));
        }
      ),
    },
  }
);
