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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// I dont really understand how this works it sets the title of the page
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Epistema`;
  next();
});

export default router