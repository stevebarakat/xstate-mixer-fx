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
    /** @xstate-layout N4IgpgJg5mDOIC5QFsCWAPMAnAxAJQFEBlAgFQG0AGAXUVAAcB7WVAF1UYDs6R1EAWAKwA2AHT8AHJX7CJAdkEAaEAE9EAWgCMmuaOGVBM+YIC+J5Wky5CAdQCSAOQAiVWkhBMW7Ljz4IJmgBMogCcmpSaIoFKqhqBIZSiAMz8SQpmFhjYOABiOa48nmwc3O5+-NGilMLC-NXRymoI6mn8oppJgQHRGSCW2QDCABIAgg4A4gQA+gBqAPIAMgCqALIEBe5F3qWgfhIhYprCcgfGjRqRmuIHlCFppuZ9WbjDY5NTKyOOs4ur6zSFZjFHxlRA1YKBFL3c7NCpJURRB6ZKw4V4TaYABTGGwYQO2vkQUl0QiSQRiTSSEjEcih6Ue-VwpDm43GC2mREWcxxHjxJQJ-hEehCIUCmjOsWagUSFUEcm6SKeKKZLLZHyWpH+blxXj5oIQckoElE8VkChhdwRwh69OeogANowAIYQVCcKA4BZzEZOAguAGbXkg3aIMXBJKUShyskwrRU0KCUnW5HYUT0O2OlSu91YpYkblbXXBhBS4QwnSJWXy3oM1PpzNu-AEAZzPB+rU8nVB3iIJJJQTiWWURPkxCi3SBGmpOnJrC1jNZnAYhYjACaACERgMANL5wM7bvNQT9mkSLrRiVafv3au22CsRj0eiQRfLle7zv7vyi+HhO5miWUtStIKjWd4Pk+ECoqM6JTEuq4btuHxzD677Ap+o4SPCYQnKaI4III4RVBOwFmI8nCMBAcA8AygIfvyWhDqIJ5ng0F4Tm0JJkjeVj2k6LpurRaH8pIegdCxeGxmIIQJlxNo8Wm84CQGdF6pQMKtAi3EpmBj6QIJ+J6joRr8Dcf4SSEbTyPs9QPGYQA */
    id: "mixer",
    initial: "loading",
    context: {
      mainVolume: -32,
      busVolume: -32,
      volumes: initialVolumes,
      pans: initialPans,
      solos: initialSolos,
      mutes: initialMutes,
      fx: "nofx",
    },
    on: {
      RESET: { actions: "reset", target: "stopped" },
      REWIND: { actions: "rewind" },
      FF: { actions: "fastForward" },
      CHANGE_VOLUME: { actions: "changeVolume" },
      CHANGE_MAIN_VOLUME: { actions: "changeMainVolume" },
      CHANGE_BUS_VOLUME: { actions: "changeBusVolume" },
      SET_FX: { actions: "setFx" },
      CHANGE_PAN: { actions: "changePan" },
      TOGGLE_SOLO: { actions: "toggleSolo" },
      TOGGLE_MUTE: { actions: "toggleMute" },
    },

    states: {
      loading: { on: { LOADED: "stopped" } },
      playing: {
        on: {
          PAUSE: { actions: "pause", target: "stopped" },
        },
      },
      stopped: {
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

      setFx: assign((context, { target }) => {
        context.fx = target.value;
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
    },
  }
);
