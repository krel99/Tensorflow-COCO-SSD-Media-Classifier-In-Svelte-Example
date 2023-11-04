<script>
  import { videoSourceSelection, selectedSample, sampleImages, webcamSupported } from "./stores.js";
  import arrowRight from "$lib/images/icons/arrowRight.png";
  import sourceWebcam from "$lib/images/icons/sourceWebcam.png";

  /**
   * Sets the video source to the selected source which <Main> will later work with
   * @param source Depends on which button was clicked
   */
  function setVideoSource(source) {
    videoSourceSelection.set(source);
  }
</script>

<header>
  <h1 class="softShadow">TensorflowJs COCO Object-Recognition Model</h1>
  <div class="buttons">
    {#if $webcamSupported}
      <button id="webcam" on:click={() => setVideoSource("webcam")}>
        <img src={sourceWebcam} alt="Webcam Icon" />
      </button>

      {:else}
      <button id="webcam" class="greyedOut" on:click={() => setVideoSource("webcam")}>
        <img src={sourceWebcam} alt="Webcam Icon" />
      </button>
    {/if}

    <button
      id="next"
      on:click={() => {
        setVideoSource("img");
        const index = $sampleImages.indexOf($sampleImages[$selectedSample]);
        const length = $sampleImages.length;

        index + 1 === length ? ($selectedSample = 0) : ($selectedSample = [index + 1]);

        console.log(index, "Length: ", length);
      }}
    >
      <img src={arrowRight} alt="Next Sample Icon" />
    </button>
  </div>
</header>

<style lang="scss">
  header {
    display: flex;
    justify-content: space-evenly;
    position: absolute;
    z-index: 1;
    width: 100vw;

    & h1 {
      margin-left: 10px;
      margin-top: 7px;
      padding: 0.5rem 1rem 0.2rem 1rem;
      width: fit-content;
      color: orange;
    }

    & .buttons {
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-content: space-around;
      margin-top: -3px;
      transition: transform 0.7s, margin-top 0.7s;

      & button {
        width: 50px;
        height: 50px;
        margin: 0px 20px 20px 20px;
        background-color: transparent;
        border: none;
        filter: drop-shadow(1px 1px 1px orange) drop-shadow(-1px -1px 1px orange);
      }

      // & button#upload {
      //   background-color: blue;
      // }

      & button:hover {
        transform: scale(1.1);
        margin-top: 10px;
        color: black;
      }

      & :hover::after {
        content: "";
        transform: scale(1.1);
        margin-top: 8px;
      }

      // & #upload:hover::after {
      //   content: "Upload";
      // }

      & #webcam:hover::after {
        content: "Webcam";
      }

      // & #youtube:hover::after {
      //   content: "Youtube";
      // }

      & #next:hover::after {
        content: "Next Sample";
      }

      & button * {
        width: 48px;
        height: 48px;
      }
    }
  }
</style>
