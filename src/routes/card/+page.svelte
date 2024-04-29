<script lang="ts">
  let flipped = false;

  function flipCard() {
    flipped = !flipped;
  }
</script>

<body>
  <div class="center w-3/6 card" on:click={flipCard}>
    <div
      class={flipped ? "card-inner flipped shadow-xl" : "card-inner shadow-xl"}
    >
      <div class="card-front">
        <p>Front of the card</p>
      </div>
      <div class="card-back">
        <p>Back of the card</p>
      </div>
    </div>
  </div>
</body>

<style>
  .center {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  body {
    background-color: rgb(246, 247, 251);
  }
  .card {
    height: 500px;
    perspective: 1000px;
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
</style>
