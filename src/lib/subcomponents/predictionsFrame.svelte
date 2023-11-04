<script>
  export let margins = [30, 30],
    confidence = "",
    size = [0, 0];

  const color = [255, 0, 0];
</script>

<span
  class="highlighter"
  style="outline: 3px solid rgba({color[0]},{color[1]},{color[2]}, 1); left: {margins[0]}px; top: {margins[1]}px; width: {size[0]}px; height: {size[1]}px;"
>
  <p class="softShadow" style="max-width: calc({size[0]}px *0.9);">{confidence}</p>
</span>

<style>
  span.highlighter {
    z-index: 3;
    position: absolute;
    /* border-radius: 10px; */

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: inherit;
      box-shadow: 2px 2px 4px hsla(210, 50%, 20%, 0.8), -2px -2px 4px hsla(210, 50%, 20%, 0.8);
      z-index: 2;
    }

    & p {
      color: orange;
      margin-left: 4.5%;
    }
  }
</style>
