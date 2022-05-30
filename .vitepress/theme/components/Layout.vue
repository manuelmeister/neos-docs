<script setup>
import DefaultTheme from 'vitepress/theme'

const {Layout} = DefaultTheme
</script>

<template>
  <div>
    <Layout>
      <template #home-hero>
        <div class="banner">
          <img width="400" height="110" src="/neos-logo-light.svg" alt="Neos Logo">
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
