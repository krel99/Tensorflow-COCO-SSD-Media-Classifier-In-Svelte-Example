<script>
  import { videoSourceSelection, selectedSample, sampleImages, uploadOverlay, freshlyResizedOnImage } from "./stores.js";
  import PredictionsFrame from "./subcomponents/predictionsFrame.svelte";
  import * as tf from "@tensorflow/tfjs"; // ! Note: This is loading a backend (CPU or GPU), it absolutely is in use!
  import * as cocoSsd from "@tensorflow-models/coco-ssd";

  console.clear();
  /**
   * This function acquires Webcam and sets it as a source of video
   */
  async function obtainCamera() {
    try {
      loading = true;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoSource.srcObject = stream;
      videoSource.play();
      loading = false;
    } catch (error) {
      console.log(error);
    }
  }

  let frames = [];
  let videoSource = null;
  // TODO render loading animation?
  let loading = true;
  let model = null;

  /**
   * Asynchronously detects objects in a video stream using the cocoSsd model.
   * Predictions with a confidence score above 50% are considered for processing.
   * The function updates the global `frames` array with the detected objects'
   * predictions including class name, confidence level, and bounding box coordinates.
   * It is designed to be called repeatedly for a live video feed.
   *
   * Global Variables:
   * - `model`: A reference to the loaded cocoSsd model. Must be defined in the global scope.
   * - `frames`: An array to store the prediction frames. Must be initialized in the global scope.
   * - `$videoSourceSelection`: A variable that holds the current video source type.
   *
   * Notes:
   * - The function will only attempt to load the model if it is not already present in the `model` global variable.
   * - The predictions are stored in a temporary array, which replaces the global `frames` array at the end of each call.
   * - For a live video feed, the function ensures continuous detection by scheduling the next call with `requestAnimationFrame`.
   * - The function uses the ternary operator to check the video source type before scheduling the next frame's detection.
   *
   * TODO:
   * loading animation, optimization
   * - loading of the model can take some time, so a loading animation should be added
   * - this function can be optimized by saving contents of for loop in a permanent place as a function instead of creating new instances on each call
   */
  async function predict() {
    let video = document.getElementsByClassName("modelTarget").item(0);
    let currentFrames = [];
    if (!model) {
      console.info("%cNeed to load model", "color:hsl(240, 70%, 60%);");
      model = await cocoSsd.load().then((model) => {
        console.log("%cCocoSsd loaded%csucessfully!", "color:green;");
        return model;
      });
    }

    await model.detect(video).then((predictions) => {
      for (let i = 0; i < predictions.length; i++) {
        if (predictions[i].score > 0.5) {
          const prediction = `${predictions[i].class} - with ${Math.round(parseFloat(predictions[i].score) * 100)}% confidence`;
          const marginLeftTop = [predictions[i].bbox[0], predictions[i].bbox[1]];
          const sizes = [predictions[i].bbox[2], predictions[i].bbox[3]];
          currentFrames.unshift([prediction, marginLeftTop, sizes]);
        }
      }
    });
    frames = currentFrames;
    if ($videoSourceSelection != "img" && $videoSourceSelection != "upload") {
      window.requestAnimationFrame(() => predict(video));
    }
  }

  /**
   * Based on what was set via icons in <Header>, these funtions will set the pixel source for the model
   */
  $: $videoSourceSelection === "webcam"
    ? obtainCamera()
    : $videoSourceSelection === "youtube"
    ? obtainYoutube()
    : $videoSourceSelection === "upload"
    ? obtainUpload()
    : console.log(`${$videoSourceSelection} is source! `);

  /**
   * * This function will rerun predict() after 200ms delay
   * * This is to prevent predict() from running too many times on resize
   */
  $: $freshlyResizedOnImage ? rerunPredictOnResize() : console.log("$freshlyResizedOnImage Set back to false");

  function rerunPredictOnResize() {
    console.log("Rerunning %cpredict()%c with 200ms delay", "color:yellow", "");
    setTimeout(() => {
      predict();
      $freshlyResizedOnImage = false;
    }, 200);
  }

  /**
   * * if the image is cached and preloaded, on:load will not fire, this function will enable predict instead
   * @param {HTMLImageElement} Image node
   */
  function checkImageLoad(node) {
    if (node.complete) {
      console.log("%cImage was preloaded%c, starting %cpredict()%c", "color:green", "", "color:yellow");
      predict();
    }
  }
</script>

<main class="preview__video">
  <!-- svelte-ignore a11y-media-has-caption -->
  <div class="container">
    {#if $videoSourceSelection === "img" || $uploadOverlay}
      <img
        alt={$sampleImages[$selectedSample][1]}
        src="/samples/{$sampleImages[$selectedSample][0]}.png"
        class="modelTarget"
        on:load={() => {
          console.log("%cSample image ready!%c Starting %cpredict()", "color:green", "", "color:yellow");
          predict();
        }}
        use:checkImageLoad
      />
    {:else if $videoSourceSelection === "upload" || $uploadOverlay}
      <img
        class="modelTarget"
        alt="User's uploaded media"
        on:load={() => {
          console.log("%cUser's image ready!%c Starting %cpredict()", "color:green", "", "color:yellow");
        }}
      />
    {:else if $videoSourceSelection === "webcam" || $videoSourceSelection === "youtube" || $uploadOverlay}
      <video
        class="modelTarget"
        bind:this={videoSource}
        on:canplay={() => {
          console.log("%cVideo ready!%c Starting predict()", "color:yellow");
          predict();
        }}
      />
    {/if}

    {#each frames as frame, i}
      <PredictionsFrame margins={frame[1]} size={frame[2]} confidence={frame[0]} />
    {/each}
  </div>
</main>

<style>
  main {
    background-color: aquamarine;
    height: 100vh;
    width: 100vw;
  }

  div.container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* Centers the .modelTarget */
  }

  .modelTarget {
    max-height: 100vh;
    max-width: 100vw;
    outline: 1px solid hsl(0, 100%, 5%); /* Adjust the color and thickness as needed */
  }
</style>
