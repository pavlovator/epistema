import { createStore } from 'vuex'
import {db, auth} from "@/firebase/firebaseInit";
import { doc, getDoc } from "firebase/firestore";


const store = createStore({
  state: {
    sampleBlogCards: [
      { blogTitle:"Block Card #1", blogCoverPhoto: "stock-1", blogDate:"May 1, 2021"},
      { blogTitle:"Block Card #2", blogCoverPhoto: "stock-2", blogDate:"May 1, 2021"},
      { blogTitle:"Block Card #3", blogCoverPhoto: "stock-3", blogDate:"May 1, 2021"},
      { blogTitle:"Block Card #4", blogCoverPhoto: "stock-4", blogDate:"May 1, 2021"},
    ],
    editPost: null,
    user: null,
    profileEmail: null,
    profileFirstName: null,
    profileLastName: null,
    profileUsername: null,
    profileId: null,
    profileInitials: null,
  },
  mutations: {
    toggleEditPost(state, payload) {
      state.editPost = payload;
    },
    updateUser(state, payload) {
      state.user = payload;
    }, 
    setProfileInfo(state, doc) {
      state.profileId = doc.id;
      state.profileEmail = doc.data().email;
      state.profileFirstName = doc.data().firstName;
      state.profileLastName = doc.data().lastName;
      state.profileUsername = doc.data().username;
    },
    setProfileInitials(state) {
      state.profileInitials = 
        state.profileFirstName.match(/(\b\S)?/g).join("") + 
        state.profileLastName.match(/(\b\S)?/g).join("");
    }, 
  },
  actions: {
    async getCurrentUser({commit}) { //{commit} is same as const commit = obj.commit?
      const dataBase = doc(db, "users", auth.currentUser.uid);
      const dbResults = await getDoc(dataBase);
      commit("setProfileInfo", dbResults);
      commit("setProfileInitials");
      console.log(this.state);
    }
  },
  modules: {
  }
})

export default store