<template>
  <header>
    <nav class="container">
      <div class="branding">
        <router-link class="header" :to="{name: 'Home'}">Epistema</router-link>
      </div>
      <div class="nav-links">
        <ul>
          <router-link class="link" :to="{name: 'Home'}">Home</router-link>
          <router-link class="link" :to="{name: 'Home'}">Blogs</router-link>
          <router-link class="link" :to="{name: 'Home'}">Create Post</router-link>
          <router-link class="link" :to="{name: 'Home'}">Login/ Register</router-link>
        </ul>
      </div>
    </nav>
    <img :src="barsIcon" alt="bars-icon" class="menu-icon"/>  
  </header>
</template>

<script>
import barsIcon from '@/assets/Icons/bars-regular.svg';
export default {
  name: "NavigationMenu",
  setup() {
      return {
        barsIcon
      };
    }
};
</script>

<style lang="scss" scoped>
header {
  background-color: #fff;
  padding: 0 25px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 99;
  .link {
  font-weight: 500;
  padding: 0 8px;
  transition: 0.3s color ease;
    &:hover {
      color: #1eb8b8;
    }
  }

  nav {
    display: flex;
    padding: 25px 0;

    .branding { 
      display: flex;
      align-items: center;

      .header {
        font-size: 24px;
        font-weight: 600;
        color: #000;
        text-decoration: none;
      }
    }
  }

  .nav-links {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex: 1;

    ul {
      margin-right: 32 px;

      .link {
        margin-right: 32px;
      }

      .link:last-child {
        margin-right: 0;
      }
    }
  }

  .menu-icon {
    cursor: pointer;
    position: absolute;
    top: 32px;
    right: 25px;
    height: 25px;
    width: auto;
  }
}





</style>