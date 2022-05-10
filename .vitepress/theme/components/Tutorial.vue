<template>
  <article class="tutorial">
    <a :href="href">
      <h2>{{ title }}</h2>
    </a>
    <p>
      <template v-if="date">
        <time>{{ date }}</time>
        <br>
      </template>
      {{ description }}
    </p>
    <footer v-if="tags" class="tutorial-footer">
      <ul>
        <li v-for="tag in tags">{{ tag }}</li>
      </ul>
    </footer>
  </article>
</template>

<script>
export default {
  name: "Tutorial",
  props: ['href', 'title', 'description', 'date', 'tags']
}
</script>

<style scoped>
.tutorial {
  margin: 1rem 0;
  padding: 12px 12px 0;
  border: 1px solid rgb(164 161 192);
  border-radius: 6px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, .07), 0 1px 4px rgba(0, 0, 0, .07);
}

.tutorial a {
  display: block;
}

.tutorial a h2 {
  text-decoration: underline;
  text-decoration-color: var(--c-brand);
  color: var(--c-text);
  margin: 0;
  border: 0;
}

.tutorial-footer ul {
  display: flex;
  list-style: none;
  gap: 10px;
  padding: 0;
  margin: 0 0 12px;
  line-height: normal;
}

.tutorial-footer ul li {
  padding: 5px;
  border-radius: 5px;
  background: #eee;
}


</style>
