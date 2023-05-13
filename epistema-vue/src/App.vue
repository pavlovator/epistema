<template>
	<HeaderMenu/>
	<ContentBody/>
</template>

<script>
import HeaderMenu from './components/HeaderMenu.vue'
import ContentBody from './components/ContentBody.vue'

export default {
  name: 'App',
  components: {
    HeaderMenu,
	ContentBody
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
