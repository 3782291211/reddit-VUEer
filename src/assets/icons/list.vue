<template>
<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
</svg>
</template>

<style scoped>
svg {
  position: fixed;
  z-index: 4;
  right: 25px;
  top: 16px;
  border-radius: 6px;
  transition: 0.5s color ease-in-out;
  transition: 0.5s background-color ease-in-out;
  cursor: pointer;
}

svg:hover {
  color: black;
  background-color: white;
}

@media (max-width: 500px) {
  svg {
    top: 12px;
  }
}
</style>