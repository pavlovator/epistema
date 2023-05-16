<template>
<div class="form-wrap">
  <form class="register">
    <p class="login-register">
      Already have an account?
      <router-link class="router-link" :to="{name: 'Login'}">Login</router-link>
    </p>
    <h2>Create Your Epistema Account</h2>
    <div class="inputs">
      <div class="input">
        <input type="text" placeholder="First Name" v-model="firstName">
        <AnOutlinedUser class="icon"/>
      </div>
    </div>
    <div class="inputs">
      <div class="input">
        <input type="text" placeholder="Last Name" v-model="lastName">
        <AnOutlinedUser class="icon"/>
      </div>
    </div>
    <div class="inputs">
      <div class="input">
        <input type="text" placeholder="Username" v-model="username">
        <AnOutlinedUser class="icon"/>
      </div>
    </div>

    <div class="inputs">
      <div class="input">
        <input type="text" placeholder="Email" v-model="email">
        <CdMail class="icon"/>
      </div>
    </div>
    <div class="inputs">
      <div class="input">
        <input type="password" placeholder="Password" v-model="password">
        <AdLock class="icon"/>
      </div>
      <div v-show="error" class="error">{{ this.errorMsg }}</div>
    </div>
    <button @click.prevent="register">Sign Up</button>
    <div class="angle"></div>
  </form>
  <div class="background"></div>
</div>
</template>

<script>
import { CdMail } from "@kalimahapps/vue-icons";
import { AdLock } from "@kalimahapps/vue-icons";
import { AnOutlinedUser } from "@kalimahapps/vue-icons";

import { createUserWithEmailAndPassword } from "firebase/auth";
import {db, auth} from "@/firebase/firebaseInit";
import { doc, setDoc } from "firebase/firestore";

export default {
  name: "RegisterPage",
  components: { CdMail, AdLock, AnOutlinedUser },
  data (){
    return {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      error: null,
      errorMsg: ""
    }
  },
  methods: {
    async register(){ // need to be checked for wrong values e.g. bad mail or bad password >6chars
      if (this.email !== "" && this.password !== "" &&
        this.firstName !== "" && this.lastName !== "" &&
        this.username !== ""){
        this.error = false;
        this.errorMsg = "";
        // need to check documentation for this one
        const createUser = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const result = createUser;
        const dataBase = doc(db, "users", result.user.uid);
        await setDoc(dataBase, {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          email: this.email,
        });
        this.$router.push({name: "Home"});
        return;
      }
      this.error = true;
      this.errorMsg = "Please fill out all the fields";
      return;
    }
  }
}
</script>

<style lang="scss">
.register {
  h2 {
    max-width: 350px;
  }
}
</style>