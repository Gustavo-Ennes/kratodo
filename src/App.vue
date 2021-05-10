<template>
  <div id="app">

    <b-alert class='text-right text-ligth w-100' :show="showAlert" variant="success" @dismissed="showAlert = false" dismissible>
      {{alertMessage}}
    </b-alert>

    <main>
      <Dashboard 
      v-if='isLogged' 
      :url='getURL()'
      :payload="userPayload"
      @logout="handleLogout"
      />
      <section v-else>
        <NewUser
        v-if="newUserPage"
        @login="handleLogin"
        @showAlert="handleShowAlert"
        @back='handleBack'
        />
        
        <Login 
        @login="handleLogin"
        @logout="handleLogout" 
        @newUserPage="newUserPageHandle"
        v-else
        />
      </section>
      <Footer />
    </main>
  </div>
</template>

<script>

  import axios from 'axios'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'

  import Dashboard from './components/Dashboard.vue'
  import Footer from './components/Footer.vue'
  import Login from './components/login.vue'
  import NewUser from './components/newUser'
  import "animate.css/source/animate.css";

  const application = {
    name: 'App',
    data(){
      return {
        debug: false,

        isLogged: false,
        email: '',
        password: '',
        newUserPage: false,
        showAlert: false,
        alertMessage: '',
        user: false
      }
    },
    components: {
      Dashboard,
      Footer,
      Login,
      NewUser
    },
    computed: {
      userPayload(){
        return {
          email: this.email,
          password: this.password
        }
      }
    },
    methods: {
      handleBack(){
        this.newUserPage = false
      },
      handleShowAlert(string){
        this.alertMessage = string
        this.showAlert = true
      },
      newUserPageHandle(payload){
        this.email = ''
        this.password = ''
        this.newUserPage = payload
      },
      handleLogin(payload){
        this.isLogged = true
        this.email = payload.email
        this.password = payload.password
      },
      handleLogout(){
        this.isLogged = false
        this.email = ''
        this.password = ''
      },
      getURL(){
        const url = this.debug === true ? `https://localhost:${process.env.LOCAL_PORT}/kratodo` : process.env.API_URL
        const axios = require('axios').default

        axios.defaults.baseURL = url
        return url
      }
    },
    async mounted(){
              
      // sending a request to get all todos
      // if res === {"message":"User not authenticated"} the login component will appear, else the app

      try{

        const axios = require('axios').default
        const res = await axios({
          method:'get',
          url:'todos',
          auth:{
            username: this.email,
            password: this.password
          },
          headers:{
            'Content-Type': 'application/json',
          }
        })
        const data = res.data
        const message = data.message
        if (res.status === 200){
          this.isLogged = true
        }
      }
      catch(err){
      }
    },
    ///SEO////
    metaInfo: {
      title: 'Kratodo',
      titleTemplate: '%s - todo app',
      description: `
        A simple todo app to help you remember the right thing to do
      `,
      meta:[
        {"http-equiv": "Content-Type", content: 'text/html; charset=utf-8'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1'},
        {name: 'description', content: `
        A simple todo app to help you remember the right thing to do
      `},
        {property: 'og:title', content: 'Kratodo - todo app'},
        {property: 'og:site_name', content: 'kratodo'},
        // The list of types is available here: http://ogp.me/#types
        {property: 'og:type', content: 'website'},
        // Should the the same as your canonical link, see below.
        {property: 'og:url', content: 'https://kratodo.ennes.dev'},
        {property: 'og:image', content: 'https://kratodo.ennes.dev'},
        // Often the same as your meta description, but not always.
        {property: 'og:description', content: `
        A simple todo app to help you remember the right thing to do
      `},

      
        // Google / Schema.org markup:
        {itemprop: 'name', content: 'Kratoto - todo app'},
        {itemprop: 'description', content: `
          A simple todo app to help you remember the right thing to do
        `},
        {itemprop: 'image', content: 'htpps://kratodo.ennes.dev/logo.png'}
      ],
      link: [
        {rel: 'canonical', href: 'https://kratodo.ennes.dev'},
        {rel: 'preconnect', href: 'htpps://fonts.gstatic.com'},
        {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Ubuntu:wght@300&display=swap'}
      ],
      script: [
        { src: 'https://kit.fontawesome.com/2a327097e3.js', crossorigin: 'anonymous'}
      ]
    }
  }
  
  axios.defaults.baseURL = application.data().debug ? `http://localhost:${process.env.LOCAL_PORT}/kratodo` : process.env.API_URL
  export default application

</script>

<style scoped>
  @import "./assets/styles/global.css";  
</style>