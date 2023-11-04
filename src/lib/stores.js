import { writable } from "svelte/store";
import { readable } from "svelte/store";

export let videoSourceSelection = writable("img");
export let selectedSample = writable(0);

/**
 * TODO sampleImages should be maintained automatically
 */

// export const displayWidth = 600;
// export const displayHeight = 480;
export const freshlyResizedOnImage = writable();
export const webcamSupported = writable();

export const sampleImages = readable([
  ["elephantBoat", "Elephant navigating a boat with teddy bears and a giraffe"],
  ["underwaterCrossroads", "Crossroads underwater with a trafficlight, cars and a fish"],
  ["orcDruid", "Orc Cooking Show"],
  ["zebraDj", "Zebra DJ spinning a wheel of pizze on a turntable"],
  ["highTechOffice", "A high tech office"],
  ["train", "Train surrounded with massive books and potplants"],
]);

export let uploadOverlay = writable(false);

// export let loading = writable(true);
// export let videoSource = writable(null);
// export let frames = writable([]);
