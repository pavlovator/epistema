<template>
<div class="blog-card-wrap">
  <div class="blog-cards container">
    <BlogCard :post="post" v-for="(post, index) in blogPosts" :key="index" />
  </div>
</div>
</template>

<script>
import BlogCard from '@/components/BlogCard.vue';

export default {
  name: 'BlogsPage',
  components: { BlogCard },
  computed: {
    blogPosts() {
      return this.$store.state.blogPosts;
    },
  },
}
</script>

<style lang="scss" scoped>
.blog-cards {
  position: relative;
}
</style>