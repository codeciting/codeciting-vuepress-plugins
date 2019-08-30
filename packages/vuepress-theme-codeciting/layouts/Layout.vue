<template>
  <div
      class="theme-container"
      :class="pageClasses"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
  >
    <Navbar
        v-if="shouldShowNavbar"
        @toggle-sidebar="toggleSidebar"
    />

    <div
        class="sidebar-mask"
        @click="toggleSidebar(false)"
    ></div>

    <Sidebar
        :items="sidebarItems"
        @toggle-sidebar="toggleSidebar"
    >
      <slot
          name="sidebar-top"
          slot="top"
      />
      <slot
          name="sidebar-bottom"
          slot="bottom"
      />
    </Sidebar>

    <Home v-if="$page.frontmatter.home" />

    <Page
        v-else
        :sidebar-items="sidebarItems"
    >
      <slot
          name="page-top"
          slot="top"
      />
      <slot
          name="page-bottom"
          slot="bottom"
      />
      <div slot="edit-updates" class="update-logs">
        <p class="title">Recent updates:</p>
        <ul class="updated-log">
          <li v-for="(log, i) in $page.recentUpdates" :key="i">
              <span class="prefix">
                {{log.author}}:
              </span>
            <span class="time">
                {{log.updateDate}}
              </span>
          </li>
        </ul>
      </div>
    </Page>
  </div>
</template>

<script>
  import Home from '@theme/components/Home.vue'
  import Navbar from '@theme/components/Navbar.vue'
  import Page from '../components/Page.vue'
  import Sidebar from '@theme/components/Sidebar.vue'
  import { resolveSidebarItems } from '@vuepress/theme-default/util'

  export default {
    components: { Home, Page, Sidebar, Navbar },

    data () {
      return {
        isSidebarOpen: false
      }
    },

    computed: {
      shouldShowNavbar () {
        const { themeConfig } = this.$site
        const { frontmatter } = this.$page
        if (
          frontmatter.navbar === false
          || themeConfig.navbar === false) {
          return false
        }
        return (
          this.$title
          || themeConfig.logo
          || themeConfig.repo
          || themeConfig.nav
          || this.$themeLocaleConfig.nav
        )
      },

      shouldShowSidebar () {
        const { frontmatter } = this.$page
        return (
          !frontmatter.home
          && frontmatter.sidebar !== false
          && this.sidebarItems.length
        )
      },

      sidebarItems () {
        return resolveSidebarItems(
          this.$page,
          this.$page.regularPath,
          this.$site,
          this.$localePath
        )
      },

      pageClasses () {
        const userPageClass = this.$page.frontmatter.pageClass
        return [
          {
            'no-navbar': !this.shouldShowNavbar,
            'sidebar-open': this.isSidebarOpen,
            'no-sidebar': !this.shouldShowSidebar
          },
          userPageClass
        ]
      }
    },

    mounted () {
      this.$router.afterEach(() => {
        this.isSidebarOpen = false
      })
    },

    methods: {
      toggleSidebar (to) {
        this.isSidebarOpen = typeof to === 'boolean' ? to : !this.isSidebarOpen
      },

      // side swipe
      onTouchStart (e) {
        this.touchStart = {
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY
        }
      },

      onTouchEnd (e) {
        const dx = e.changedTouches[0].clientX - this.touchStart.x
        const dy = e.changedTouches[0].clientY - this.touchStart.y
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
          if (dx > 0 && this.touchStart.x <= 80) {
            this.toggleSidebar(true)
          } else {
            this.toggleSidebar(false)
          }
        }
      }
    }
  }
</script>

<style lang="stylus">
  .update-logs
    display inline-block
    float: right

    .title
      line-height 1
      margin 0
      font-weight bold
      color lighten($textColor, 25%)

    .updated-log
      list-style none
      margin 8px 0
      margin-bottom 0
      line-height 1.5
      padding 0
      font-size 0.9em

      .prefix
        font-weight 500
        color lighten($textColor, 25%)

      .time
        font-weight 400
        color #aaa
</style>
