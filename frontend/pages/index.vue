<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col md="3" class="d-none d-md-block fixed-top">
          <ul v-if="headings.length">
            <li v-for="(heading, idx) in headings" :key="idx">
              <a :href="`#${heading.id}`">{{ heading.text }}</a>
            </li>
          </ul>
        </b-col>
        <b-col md="9" offset-md="3">
          <div>
            <ul>
              <li v-for="(attr, idx) in md.attributes" :key="idx">
                <b>{{ idx }}: </b>{{ attr }}
              </li>
            </ul>
          </div>
          <!-- eslint-disable-next-line -->
          <div id="content" v-html="$md.render(md.body)"></div>
        </b-col>
      </b-row>
    </b-container>
    <b-sidebar
      v-model="sidebarIsOpen"
      aria-label="Sidebar"
      backdrop
      shadow
      right
    >
      <div v-if="activeComment" class="p-4">
        <span class="font-weight-bold lead">"{{ activeComment.quote }}"</span>
        <div>
          <span>{{ activeComment.text }}</span>
        </div>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
import fm from 'front-matter'
import marked from 'marked'

export default {
  name: 'Home',
  asyncData({ $axios, route, error, $config }) {
    return $axios.$get(`/content/rental_inspection.md`).then((res) => {
      return {
        md: fm(res),
      }
    })
  },
  data() {
    return {
      annotator: null,
      activeId: null,
      sidebarIsOpen: false,
      existing: [
        {
          id: 0,
          text: 'This is a test',
          ranges: [
            {
              start: '/ol[1]/li[1]',
              startOffset: 24,
              end: '/ol[1]/li[1]',
              endOffset: 42,
            },
          ],
          quote: 'double non-owner o',
        },
      ],
    }
  },
  computed: {
    activeComment() {
      return this.existing.find((a) => {
        return a.id === Number(this.activeId)
      })
    },
    headings() {
      const headings = []
      const renderer = {
        heading(text, level) {
          headings.push({
            text,
            level,
            id: text.toLowerCase().replace(/[^\w]+/g, '-'),
          })
        },
      }

      marked.use({ renderer })
      marked(this.md.body)
      return headings
    },
  },
  mounted() {
    this.initAnnotator()
  },
  methods: {
    toggleSidebar() {
      this.sidebarIsOpen = !this.sidebarIsOpen
    },
    annotationSelected(e) {
      e.stopPropagation()

      const target = e.target
      this.activeId = target.getAttribute('data-annotation-id')
      this.toggleSidebar()
    },
    attachListener(el) {
      el.mouseover = null
      el.addEventListener('click', (e) => {
        this.annotationSelected(e)
      })
    },
    initAnnotator() {
      const self = this
      const log = () => {
        return {
          annotationCreated(annotation) {
            console.log(annotation)
            self.existing.push({
              id: annotation.id,
              text: annotation.text,
              ranges: annotation.ranges,
              quote: annotation.quote,
            })
            const el = annotation._local.highlights[0]
            self.attachListener(el)
          },
        }
      }

      const load = () => {
        return {
          annotationsLoaded(annotations) {
            // console.log(annotations)
            annotations.forEach((a) => {
              const el = a._local.highlights[0]
              self.attachListener(el)
            })
          },
        }
      }
      /* eslint-disable no-undef */
      this.annotator = new annotator.App()
      this.annotator.include(annotator.ui.main, {
        element: document.querySelector('#content'),
      })
      this.annotator.include(log)
      this.annotator.include(load)

      this.annotator.start()
      this.annotator.runHook('annotationsLoaded', [this.existing])
      /* eslint-enable no-undef */
    },
  },
  head: {
    script: [
      {
        src: '/js/annotator.min.js',
      },
    ],
  },
}
</script>

<style>
.annotator-viewer {
  display: none !important;
}

.annotator-hl {
  cursor: pointer;
}
</style>
