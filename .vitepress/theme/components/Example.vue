<template>
  <div class="example">
    <iframe :src="src" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  name: "Example",
  props: ['src']
}
</script>

<style scoped>
.example {
  position: fixed;
  display: flex;
  flex-direction: column;
  inset: 0;
  padding-top: var(--header-height);
  overflow-y: auto;
}

@media (min-width: 720px) {
  .example {
    margin-left: 16.4rem;
  }
}

@media (min-width: 960px) {
  .example {
    margin-left: 20rem;
  }
}

.example iframe {
  flex-grow: 1;
}
</style>
