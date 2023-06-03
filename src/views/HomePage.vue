<template>
  <div class="home">
    <div class="blog-card-wrap">
      <div class="container">
        <h3> View More Recent Blogs</h3>
        <div class="blog-cards">
          <BlogCard :post="post" v-for="(post, index) in blogPostCards" :key="index" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BlogCard from '@/components/BlogCard.vue';

export default {
  name: "HomePage",
  components: { BlogCard },
  computed: {
    blogPostCards() {
      return this.$store.getters.blogPostsCards;
    },
    user() {
      return this.$store.state.user;
    }
  }
};
</script>

<style lang="scss" scoped>
.blog-card-wrap {
  h3 {
    font-weight: 300;
    font-size: 28px;
    margin-bottom: 32px;
  }
}
</style>