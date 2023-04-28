import { createMachine, assign } from "xstate";
import { pure } from "xstate/lib/actions";
import { start, getContext, Destination, Transport as t } from "tone";
import { dBToPercent, scale } from "../utils/scale";
import { getSong } from "../utils/getSong";
import { roxanne } from "../songs";

const context = getContext();
const [song, currentTracks] = getSong(roxanne);
const initialVolumes = currentTracks.map((currentTrack) => currentTrack.volume);
const initialPans = currentTracks.map((currentTrack) => currentTrack.pan);
const initialMutes = currentTracks.map((currentTrack) => currentTrack.mute);
const initialSolos = currentTracks.map((currentTrack) => currentTrack.solo);

export const mixerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFsCWAPMAnAxAJQFEBlAgFQG0AGAXUVAAcB7WVAF1UYDs6R1EAWAKwA2AHT8AHJX7CJAdkEAaEAE9EAWgCMmuaOGVBM+YIC+J5Wky5CAdQCSAOQAiVWkhBMW7Ljz4IJmgBMogCcmpSaIoFKqhqBIZSiAMz8SQpmFhjYOABiOa48nmwc3O5+-NGilMLC-NXRymoI6mn8oppJgQHRGSCW2QDCABIAgg4A4gQA+gBqAPIAMgCqALIEBe5F3qWgfhIhYprCcgfGjRqRmuIHlCFppuZ9WbjDY5NTKyOOs4ur6zSFZjFHxlRA1YKBFL3c7NCpJURRB6ZKw4V4TaYAISWRB+yzWGwYQO2vg0-CC4jJdWEDViCCSnQRSQS1KRTxRJFIUyxRE0UxyAA1NASPESSiTmmkQsl+HJhIiYepIYlBEz6qz+rgOVzsbyBYFhVsxaCJTVxGqYUIrrU1b0NajRuipgAFMYG0Ug3aIKS6IRJIIxJpJCRiORQ9KPO2kObjcYLaZERZzN1eI2e-wiPQhEKBTRnWmKxIVQRybrq544KMxuMfJakf5uQkpj28RBySgSUTxWQKGF3BEs23ltHvQgzAh4DE4lZ2fnJ4E7FsSkt6GlNTRhUTBuS58PIwYOkcEMcTnFOwhOAgLEYATTnxON6kt4k0VNXYLa9JCElSu7Z+7e0yjuOk5TBeAw3neqaLo+2gUiq-oKnIH5HK+ZZWKIAA2jAAIYQKgnBQDgCxzCMF4uACmzugufi5sESSUJQJYIfmuZiCE8E9BGzyiPQGHYSo+GES62L1oCTbUYggTVDCOjKkxnF7lgPF8QJBGiPh2EAMbsAAbmAFbRrGomUeJ4pBFc+zftCtJBB2Og7mh2DKfxgmiFpun6ZWRmQc2fg5roCjyQGGiCMEgiWT+jlKbArCMPQ9CQDgTpXreFGNvO4o5vC4R3D2tJBiGYZRaIMVxQlEDqZw7moHpBlVsZ6X3mmTKHFmOZ5k0dRSoEMi3Pcg7oaV8WQG52k1Z5hlxj5El0gc7RtQ5Fq3J2vW5Q8jycIwEBwDwGpiRlD4HAqgRIeIHHFVhuGCftTWLpIegdF0zFNFowahOdA1ObxLkETdUF+I+EgKi+iTtl+kWfUp32qVAlXVXpf2+YglAwoIuYIpDzkw6NHmIzNKO0nKSSY0N5V4+KKR2QtHWIJ0VxIfoa0k7Fw0VRpY0IyZB3NXN67ZottKCAYK2M-1XGDSz5U4+N5PGi1838zTCDCEyogM314ZmEAA */
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
    },
    on: {
      RESET: { actions: "reset", target: "stopped" },
      REWIND: { actions: "rewind" },
      FF: { actions: "fastForward" },
      CHANGE_VOLUME: { actions: "changeVolume" },
      CHANGE_MAIN_VOLUME: { actions: "changeMainVolume" },
      CHANGE_BUS_VOLUME: { actions: "changeBusVolume" },
      SET_BUS1_FX1: { actions: "setBus1Fx1" },
      SET_BUS1_FX2: { actions: "setBus1Fx2" },
      CHANGE_PAN: { actions: "changePan" },
      TOGGLE_SOLO: { actions: "toggleSolo" },
      TOGGLE_MUTE: { actions: "toggleMute" },
      CHANGE_REVERBS_MIX: { actions: "chengeReverbsMix" },
      CHANGE_REVERBS_PREDELAY: { actions: "changeReverbsPredelay" },
      CHANGE_REVERBS_DECAY: { actions: "changeReverbsDecay" },
    },

    states: {
      loading: { on: { LOADED: "stopped" } },
      playing: {
        initial: "active",
        states: {
          inactive: {
            tags: "inactive",
            on: {
              TOGGLE: "active",
            },
          },
          active: {
            tags: "active",
            on: {
              TOGGLE: "inactive",
            },
          },
        },
        on: {
          PAUSE: { actions: "pause", target: "stopped" },
        },
      },
      stopped: {
        initial: "active",
        states: {
          inactive: {
            on: {
              TOGGLE: "active",
            },
          },
          active: {
            on: {
              TOGGLE: "inactive",
            },
          },
        },
        on: {
          PLAY: { actions: "play", target: "playing" },
        },
      },
    },
    predictableActionArguments: true,
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

      changeBusVolume: pure((_, { target, channel }) => {
        const scaled = dBToPercent(scale(parseFloat(target.value)));
        const volume = () => {
          channel.volume.value = scaled;
        };
        return [assign({ busVolume: parseFloat(target.value) }), volume];
      }),

      // make pure
      setBus1Fx1: assign((context, { target }) => {
        const trackIndex = target.id.at(-1);
        context.bus1fx1 = target.value;
        currentTracks[trackIndex].bus1fx1 = target.value;
        localStorage.setItem(
          "currentTracks",
          JSON.stringify([...currentTracks])
        );
      }),

      setBus1Fx2: assign((context, { target }) => {
        context.bus1fx2 = target.value;
      }),

      changeVolume: pure((context, { target, channel }) => {
        const trackIndex = target.id.at(-1);
        const value = target.value;
        const scaled = dBToPercent(scale(parseFloat(value)));
        const channelVolume = () => {
          channel.volume.value = scaled;
        };
        const tempVols = context.volumes;
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
        const value = target.value;
        const channelPan = () => {
          channel.pan.value = value;
        };
        const tempPans = context.pans;
        tempPans[trackIndex] = parseFloat(value);
        currentTracks[trackIndex].pan = parseFloat(value);
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

      chengeReverbsMix: assign((context, { target, reverb }) => {
        reverb.wet.value = target.value;
      }),

      changeReverbsPredelay: assign((context, { target, reverb }) => {
        reverb.preDelay = target.value;
      }),

      changeReverbsDecay: assign((context, { target, reverb }) => {
        reverb.decay = target.value;
      }),
    },
  }
);
