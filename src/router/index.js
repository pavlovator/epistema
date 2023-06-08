import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
    meta: {
      title: 'Home',
    },
  },
  {
    path: '/blogs',
    name: 'Blogs',
    component: () => import('../views/BlogsPage.vue'),
    meta: {
      title: 'Blogs',
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue'),
    meta: {
      title: 'Login',
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterPage.vue'),
    meta: {
      title: 'Register',
    },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPasswordPage.vue'),
    meta: {
      title: 'Forgot Password',
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfilePage.vue'),
    meta: {
      title: 'Profile',
    },
  },
  {
    path: '/create-post',
    name: 'CreatePost',
    component: () => import('../views/CreatePost.vue'),
    meta: {
      title: 'Create Post',
    },
  },
  {
    path: '/view-blog/:blogid',
    name: 'ViewBlog',
    component: () => import('../views/ViewBlog.vue'),
    meta: {
      title: 'View Blog Post',
    },
  },
  {
    path:'/insertion-sort',
    name: 'InsertionSort',
    component: () => import('../views/posts/InsertionSort.vue'),
    meta: {
      title: 'Insertion Sort',
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Epistema`;
  next();
});

export default router