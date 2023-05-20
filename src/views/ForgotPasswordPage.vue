<template>
<div class="reset-password">
  <UniversalModal v-if="modalActive" :modalMessage="modalMessage" v-on:close-modal="closeModal"/>
  <UniversalLoading v-if="loading" />
  <div class="form-wrap">
    <form class="reset">
      <p class="login-register">
      Back to
      <router-link class="router-link" :to="{name: 'Login'}">Login</router-link>
      </p>
      <h2>Reset Password</h2>
      <p>Forgot your password? Enter your email to reset it</p>
      <div class="inputs">
        <div class="input">
          <input type="text" placeholder="Email" v-model="email" />
          <CdMail class="icon" />
        </div>
      </div>
      <button @click.prevent="resetPassword">Reset</button>
      <div class="angle"></div>
    </form>
    <div class="background"></div>
  </div>
</div>
</template>

<script>
import { CdMail } from "@kalimahapps/vue-icons";
import UniversalModal from "@/components/UniversalModal.vue";
import UniversalLoading from "@/components/UniversalLoading.vue";
import { auth } from "@/firebase/firebaseInit";
import { sendPasswordResetEmail } from "firebase/auth";

export default {
  name: "ForgotPasswordPage",
  components: { 
    CdMail, 
    UniversalModal, 
    UniversalLoading 
  },
  data() {
    return {
      email: "",
      modalActive: false,
      modalMessage: "",
      loading: null,
    };
  },
  methods: {
    resetPassword(){
      this.loading = true;
      sendPasswordResetEmail(auth, this.email)
      .then(() => {
        this.modalMessage = "If your account exist, you will recieve a email."
        this.loading = false;
        this.modalActive = true;
      }).catch((err) => {
        this.modalMessage = err.message;
        this.loading = false;
        this.modalActive = true;
      })
    },
    closeModal() {
      this.modalActive = !this.modalActive;
      this.email = "";
    },
  },
}
</script>

<style lang="scss" scoped>
.reset-password {
  position: relative;
  .form-wrap {
    .reset {
      h2 {
        margin-bottom: 8px;
      }
      p {
        text-align: center;
        margin-bottom: 32px;
      }
    }
  }
}
</style>