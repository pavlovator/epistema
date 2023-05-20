<template>
  <header>
    <nav class="container">
      <div class="branding">
        <router-link class="header" :to="{name: 'Home'}">Epistema</router-link>
      </div>
      <div class="nav-links">
        <ul>
          <router-link class="link" :to="{name: 'Home'}">Home</router-link>
          <router-link class="link" :to="{name: 'Blogs'}">Blogs</router-link>
          <router-link class="link" :to="{name: 'CreatePost'}">Create Post</router-link>
          <router-link v-if="!user" class="link" :to="{name: 'Login'}">Login/ Register</router-link>
        </ul>
        <div v-if="user" @click="toggleProfileMenu" class="profile" ref="profile">
          <span>{{ this.$store.state.profileInitials }}</span>
          <div v-show="profileMenu" class="profile-menu">
            <div class="info">
              <p class="initials">{{ this.$store.state.profileInitials }}</p>
              <div class="right">
                <p>{{ this.$store.state.profileFirstName }} {{ this.$store.state.profileLastName }}</p>
                <p>{{ this.$store.state.profileUsername }}</p>
                <p>{{ this.$store.state.profileEmail }}</p>
              </div>
            </div>
            <div class="options">
              <div class="option">
                <router-link class="option" :to="{name:'Profile'}">
                  <AnOutlinedUser class="icon"/>
                  <p>Profile</p>
                </router-link>
              </div>
              <div @click="signOut" class="option">
                <ChSignOut class="icon"/>
                <p>Sign Out</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { AnOutlinedUser } from "@kalimahapps/vue-icons";
import { ChSignOut } from "@kalimahapps/vue-icons";
import { auth } from "@/firebase/firebaseInit";


export default {
  name: "AppNavigation",
  components: { 
    AnOutlinedUser,
    ChSignOut
  },
  data() {
    return {
      profileMenu: null
    }
  },
  methods: {
    toggleProfileMenu(e) {
      if (e.target === this.$refs.profile) {
        this.profileMenu = !this.profileMenu;
      }
    },
    signOut() {
      auth.signOut(); //should be checked as promise
      window.location.reload();
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
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

    .profile {
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      color: #fff;
      background-color: #303030;

      span {
        pointer-events: none;
      }

      .profile-menu {
        position: absolute;
        top: 60px;
        right: 0;
        width: 250px;
        background-color: #303030;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

        .info {
          display: flex;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid #fff;

          .initials {
            position: initial;
            width: 40px;
            height: 40px;
            background-color: #fff;
            color: #303030;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
          }

          .right {
            flex: 1;
            margin-left: 24px;

            p:nth-child(1) {
              font-size: 14px;
            }

            p:nth-child(2),
            p:nth-child(3) {
              font-size: 12px;
            }
          }
        }

        .options {
          padding: 15px;
          .option {
            text-decoration: none;
            color: #fff;
            display: flex;
            align-items: center;
            margin-bottom: 12px;

            .icon {
              width: 18px;
              height: auto;
            }
            p {
              font-size: 14px;
              margin-left: 12px;
            }

            &:last-child {
              margin-bottom: 0px;
            }
          }
        }
      }
    }
  }
}
</style>