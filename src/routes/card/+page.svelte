<script lang="ts">
  let flipped = false;
  let count = 1;

  function flipCard() {
    flipped = !flipped;
  }

  function left() {
    flipped = false;
    count = count - 1;
  }

  function right() {
    flipped = false;
    count = count + 1;
  }

  function handleKeyDown(event: { key: string }) {
    if (event.key === "Enter") {
      flipCard();
    }
  }
</script>

<p id="ho_center">Card {count}</p>
<div
  class="center card"
  tabindex="0"
  role="button"
  on:click={flipCard}
  on:keydown={handleKeyDown}
>
  <div
    class={flipped ? "card-inner flipped shadow-xl" : "card-inner shadow-xl"}
  >
    <div class="card-front">
      <p>Front of the card {count}</p>
    </div>
    <div class="card-back">
      <p>Back of the card {count}</p>
    </div>
  </div>
</div>

<div id="left-btn" class="btn" on:click={left}>←</div>
<div id="right-btn" class="btn" on:click={right}>→</div>

<style>
  .center {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  #ho_center {
    top: 20px;
    position: relative;
    text-align: center;
  }

  .card {
    height: 67%;
    width: 62%;
  }

  .card-inner {
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.6s;
    cursor: pointer;
  }

  .card-front,
  .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    color: black;
    font-size: 24px;
  }

  .card-back {
    transform: rotateY(180deg);
  }

  .flipped {
    transform: rotateY(180deg);
  }

  .btn {
    position: absolute;
    width: 40px;
    /* background-color: rgb(246, 247, 251); */
    color: gray;
    font-size: x-large;
  }
  #left-btn {
    top: 50%;
    left: 10%;
  }
  #right-btn {
    top: 50%;
    right: 10%;
  }
</style>
