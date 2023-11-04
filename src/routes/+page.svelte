<script>
  import "../global.scss";
  import Header from "../lib/header.svelte";
  import Main from "../lib/main.svelte";
  import Footer from "../lib/footer.svelte";
  import { onMount } from "svelte";
  import { freshlyResizedOnImage, webcamSupported } from "../lib/stores.js";

  onMount(() => {
    console.log("%cApp mounted", "color: green");

    $webcamSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    $webcamSupported
      ? console.info("%cWebcam is supported %cby the browser", "color:hsl(240, 70%, 60%);", "")
      : console.warn("%cWebcam is not supported", "color: red;");

    window.addEventListener("resize", () => {
      if (!$freshlyResizedOnImage) {
        console.log(
          "(not implemented) Window %cResized%c, %cshould restart %cpredict()",
          "color: yellow;",
          "",
          "color: orange;",
          "color: yellow"
        );
        $freshlyResizedOnImage = true;
      }
    });
  });
</script>

<Header />
<Main />
<Footer />
