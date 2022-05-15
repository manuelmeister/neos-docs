<template>
  <figure
      ref="wrapper"
      class="youtube-embed"
      :class="{'activated': activated}"
      :style="style"
      @click.prevent="start"
      @pointerover.once="warmConnections">
    <transition name="ease-out">
      <div v-show="!activated" class="backdrop">
        <a :href="'https://youtube.com/watch?v=' + videoid" class="playbtn" title="Play Video">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 69 48" width="69" height="48">
            <title>Play Video: {{ description }}</title>
            <path d="M8 2Q3 3 2 8 0 24 2 40q1 5 6 6 27 4 54 0 5-1 6-6 2-16 0-32-1-5-6-6Q35-2 8 2" fill="red"/>
            <path d="M46 24 27 14v20" fill="white"/>
          </svg>
        </a>
      </div>
    </transition>
    <iframe v-if="activated" ref="iframe" width="560" height="315" :title="description"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
            frameborder="0" :src="src"/>
  </figure>
</template>

<script>
import {withBase} from "vitepress";

export default {
  name: "YoutubeEmbed",
  props: ['videoid', 'description', 'params', 'posterUrl'],
  data() {
    return {
      preconnected: false,
      activated: false
    }
  },
  computed: {
    style() {
      if (this.posterUrl) {
        return {
          backgroundImage: 'url(\'' + withBase(this.posterUrl) + '\')'
        }
      }
      return {
        backgroundImage: 'url(\'https://i.ytimg.com/vi/' + this.videoid + '/hqdefault.jpg\')'
      }
    },
    iframeParams() {
      const params = new URLSearchParams(this.params || []);
      params.append('autoplay', '1');
      return params;
    },
    src() {
      return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(this.videoid)}?${this.iframeParams.toString()}`;
    }
  },
  methods: {
    addPrefetch(kind, url, as) {
      const linkEl = document.createElement('link');
      linkEl.rel = kind;
      linkEl.href = url;
      if (as) {
        linkEl.as = as;
      }
      document.head.append(linkEl);
    },
    warmConnections() {
      if (this.preconnected) return;

      // The iframe document and most of its subresources come right off youtube.com
      this.addPrefetch('preconnect', this.src);

      this.preconnected = true;
    },
    start() {
      if (this.activated) return;
      this.activated = true;
      this.$nextTick(() => {
        this.$refs.iframe.focus();
      });
    }
  }
}
</script>

<style scoped>
.youtube-embed {
  aspect-ratio: 16 / 9;
  background-color: #000;
  position: relative;
  contain: content;
  background-position: center center;
  background-size: cover;
  cursor: pointer;
  max-width: 720px;
}

.backdrop {
  content: '';
  display: grid;
  place-content: center;
  align-items: center;
  background: top / 100% 99px no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAABjCAQAAADwIKJTAAAAP0lEQVR4AX2KgQmAAAzDyv6/xBvdJiiRQkUIkIaWjlKX9mbgKc185fSPlQb3RX6eg2SZYMP3S2RFiE/FBGb2C9N8U8cUU0GsAAAAAElFTkSuQmCC);
  transition: all 0.2s cubic-bezier(0, 0, 0.2, 1);
}

.youtube-embed > * {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  border: 0;
}

.playbtn {
  display: block;
  filter: grayscale(100%);
  transition: filter .1s cubic-bezier(0, 0, 0.2, 1);
}

.youtube-embed:hover .playbtn,
.youtube-embed .playbtn:focus {
  filter: none;
}

/* Post-click styles */
.youtube-embed.activated {
  cursor: unset;
}

.youtube-embed.activated .backdrop {
  opacity: 0;
  pointer-events: none;
}
</style>
