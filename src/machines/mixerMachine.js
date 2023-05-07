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
      busVolume: -32,
      volumes: initialVolumes,
      pans: initialPans,
      solos: initialSolos,
      mutes: initialMutes,
      bus1fx1: "nofx",
      bus1fx2: "nofx",
      bus2fx1: "nofx",
      bus2fx2: "nofx",
    },
    on: {
      RESET: { actions: "reset", target: "stopped" },
      REWIND: { actions: "rewind" },
      FF: { actions: "fastForward" },
      SET_BUS1_FX1: { actions: "setBus1Fx1" },
      SET_BUS1_FX2: { actions: "setBus1Fx2" },
      SET_BUS2_FX1: { actions: "setBus2Fx1" },
      SET_BUS2_FX2: { actions: "setBus2Fx2" },
      TOGGLE_SOLO: { actions: "toggleSolo" },
      TOGGLE_MUTE: { actions: "toggleMute" },
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
    },
  }
);
