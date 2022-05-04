<script setup>
import DefaultTheme from 'vitepress/theme'

const {Layout} = DefaultTheme
</script>

<template>
  <div>
    <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@380;540;600&display=swap"
          rel="stylesheet">
    <Layout>
      <template #home-hero>
        <div class="banner">
          <img width="400" src="https://raw.githubusercontent.com/neos/brand/e52c18d3ace329133afdf0a2073f6cc672d0dcb0/logos/Neos/neos_negative_light.svg" alt="Neos Logo">
        </div>
      </template>
    </Layout>
  </div>
</template>

<style>
.banner {
  display: grid;
  place-content: center;
  padding: 40px 1.5rem;
  min-height: 300px;
  background-color: var(--c-brand);
}
</style>
