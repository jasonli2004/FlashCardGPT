<script lang="ts">
  import { user, userData } from "$lib/firebase";
  import "../app.css";

  $user;
  $userData;
</script>

<div>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/card">Card</a></li>
    <li><a href="/gpt">GPT</a></li>
    <li><a href="/gptcard">Test</a></li>
  </ul>
  <slot />
</div>

<style>
  ul {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #e8fde7;
  }

  li {
    float: left;
  }

  li a {
    display: block;
    color: black;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
  }

  /* Change the link color to #111 (black) on hover */
  li a:hover {
    background-color: #5bf78a;
  }
</style>
