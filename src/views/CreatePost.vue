<template>
<div class="create-post">
  <BlogCoverPreview v-show="this.$store.state.blogPhotoPreview" />
  <UniversalLoading v-show="loading" />
  <div class="container">
    <div :class="{invisible: !error}" class="err-message">
      <p><span>Error:</span>{{ this.errorMsg }}</p>
    </div>
     <div class="blog-info">
      <input type="text" placeholder="Enter Blog Title" v-model="blogTitle">
      <div class="upload-file">
        <label for="blog-photo">Upload Cover Photo</label>
        <input type="file" ref="blogPhoto" id="blog-photo" @change="fileChange" accept=".png, .jpg, .jpeg" />
        <button @click="openPreview" class="preview" :class="{'button-inactive' : !this.$store.state.blogPhotoFileURL }">Preview Photo</button>
        <span>File Chosen: {{ this.$store.state.blogPhotoName }}</span>
      </div>
      <div class="editor">
        <QuillEditor theme="snow" v-model:content="blogHTML" contentType="html" />
      </div>
      <div class="blog-actions">
        <button @click="uploadBlog">Publish Blog</button>
        <router-link class="router-button" :to="{ name: 'BlogPreview' }" >Post Preview</router-link>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { storage, db } from "@/firebase/firebaseInit";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, doc, setDoc } from "firebase/firestore";

import BlogCoverPreview from "@/components/BlogCoverPreview.vue";
import UniversalLoading from "@/components/UniversalLoading.vue";

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
  name: "CreatePost",
  components: {
    QuillEditor,
    BlogCoverPreview,
    UniversalLoading
},
  data (){
    return {
      file: null,
      error: null,
      errorMsg: null,
      loading: null
    }
  },
  methods: {
    fileChange() {
      this.file = this.$refs.blogPhoto.files[0];
      const filename = this.file.name;
      this.$store.commit("fileNameChange", filename);
      this.$store.commit("createFileURL", URL.createObjectURL(this.file));
    },
    openPreview(){
      this.$store.commit("openPhotoPreview");
    },
    uploadBlog(){
      console.log("aaa")
      if (!this.blogTitle.length !== 0 && this.blogHTML.length !== 0){
        if (this.file) {
          this.loading = true;
          const storageRef = ref(storage, "documents/BlogCoverPhotos/" + this.$store.state.blogPhotoName);
          const uploadTask = uploadBytesResumable(storageRef, this.file);

          uploadTask.on("state_changed", (snapshot) => {
            console.log(snapshot);
          },
          (err) => {
            console.log(err);
            this.loading = false;
          },
          async () => {
            const downloadURL = await getDownloadURL(storageRef);
            const timestamp = Date.now();
            const dataBase = doc(collection(db, "blogPosts"));

            await setDoc(dataBase, {
              blogID: dataBase.id,
              blogHTML: this.blogHTML,
              blogCoverPhoto: downloadURL,
              blogCoverPhotoName: this.blogCoverPhotoName,
              blogTitle: this.blogTitle,
              profileId: this.profileId,
              date: timestamp,
            });
            
            await this.$store.dispatch("getPost");
            this.loading = false;
            this.$router.push({ name: "ViewBlog", params: { blogid: dataBase.id } });
          }
        );
          return;
        }
        this.error = true;
        this.errorMsg = "Please make sure you uploaded a cover phot!"
        setTimeout(() => {
          this.error = false
        }, 5000);
      }
      this.error = true;
      this.errorMsg = "Please ensure Blog Title & Blog Post has been filled!"
      setTimeout(() => {
        this.error = false
      }, 5000);
      return;
    }
  },
  computed: {
    profileId(){
      return this.$store.state.profileId;
    },
    blogCoverPhotoName(){
      return this.$store.state.blogPhotoName;
    },
    blogTitle: {
      get(){
        return this.$store.state.blogTitle;
      },
      set(payload){
        this.$store.commit("updateBlogTitle", payload);
      }
    },
    blogHTML: { 
      get(){
        return this.$store.state.blogHTML;
      },
      set(payload){
        this.$store.commit("newBlogPost", payload);
      }
    }
  },
}
</script>


<style lang="scss">
.create-post {
  position: relative;
  height: 100%;

  button {
    margin: 10px;
  }

  .router-button {
    text-decoration: none;
    color: #fff;
  }

  label,
  button,
  .router-button {
    transition: 0.5s ease-in-out all;
    align-self: center;
    font-size: 14px;
    cursor: pointer;
    border-radius: 20px;
    padding: 12px 24px;
    color: #fff;
    background-color: #303030;
    text-decoration: none;
    margin: 10px;
    &:hover {
      background-color: rgba(48, 48, 48, 0.7);
    }
  }

  .container {
    position: relative;
    height: 100%;
    padding: 10px 25px 60px;
  }

  // error styling
  .invisible {
    opacity: 0 !important;
  }

  .err-message {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    color: #fff;
    margin-bottom: 10px;
    background-color: #303030;
    opacity: 1;
    transition: 0.5s ease all;

    p {
      font-size: 14px;
    }

    span {
      font-weight: 600;
    }
  }

  .blog-info {
    display: flex;
    flex-direction: column;
    margin-bottom: 32px;

    input:nth-child(1) {
      min-width: 300px;
    }

    input {
      transition: 0.5s ease-in-out all;
      padding: 10px 4px;
      border: none;
      border-bottom: 1px solid #303030;

      &:focus {
        outline: none;
        box-shadow: 0 1px 0 0 #303030;
      }
    }

    .upload-file {
      flex: 1;
      margin-left: 16px;
      position: relative;
      display: flex;

      input {
        display: none;
      }

      .preview {
        margin-left: 16px;
        text-transform: initial;
      }

      span {
        font-size: 12px;
        margin-left: 16px;
        align-self: center;
      }
    }
  }

  .editor {
    height: 60vh;
    display: flex;
    flex-direction: column;
    .ql-container {
      overflow: scroll;
    }
  }

  .blog-actions {
    margin-top: 32px;

    button {
      margin-right: 16px;
    }
  }
}
</style>