<template>
  <div class='position-relative h-100'>

    <!-- absolute div to hold three.js animation -->
    <div class='threejs'></div>



    <b-alert class='text-right text-ligth w-100' :show="showAlert" variant="success" @dismissed="showAlert = false" dismissible>
      {{alertMessage}}
    </b-alert>

    <main>
      <b-overlay
      class='overlay'
      :show="isLoading"
      spinner-variant="success"
      spinner-type="grow"
      spinner-small
      rounded="sm"
      bg-color='transparent'
      >
        <b-row>
          <b-col cols='12' v-if='isLogged' align-self='stretch'>
            <Dashboard 
            :url="'https://api.ennes.dev/kratodo'"
            :payload="userPayload"
            @logout="handleLogout"
            />
            </b-col>
            <b-col cols='12' align-self="stretch"  v-else>
              <section class='loginSession'>
                <b-row>

                  <b-col align-self='stretch' v-if="newUserPage">
                    <NewUser
                    @login="handleLogin"
                    @showAlert="handleShowAlert"
                    @back='handleBack'
                    />
                  </b-col>
                  <b-col align-self='stretch' v-else>          
                    <Login 
                    @login="handleLogin"
                    @logout="handleLogout" 
                    @newUserPage="newUserPageHandle"
                    />
                  </b-col>
                </b-row>
              </section>
            </b-col>
            <b-col cols='12' align-self='stretch' class='footerWrapper'>
              <Footer />
            </b-col>
          </b-row>
      </b-overlay>
    </main>
  </div>
</template>

<script>

  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'

  import Dashboard from './components/Dashboard.vue'
  import Footer from './components/Footer.vue'
  import Login from './components/login.vue'
  import NewUser from './components/newUser'
  import "animate.css/source/animate.css";
  import {init, onWindowResize} from './assets/threejs/index.js'

  const application = {
    name: 'App',
    data(){
      return {
        debug: false,
        isLogged: false,
        isLoading: false,
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
      async handleLogout(){
        const axios = require('axios').default

        this.isLogged = false
        this.email = ''
        this.password = ''
        
        await axios({url:'/logout/', method: 'get'})
        onWindowResize()
      },
    },
    async mounted(){            
      this.isLoading = true

      try{
        const el = document.querySelector('.threejs')
        console.log(el)
        init(el)

        const axios = require('axios').default

        const res = await axios({
          method:'get',
          url:'/login/',
        })
        if (res.status === 200){
          this.isLogged = true
        }

      }
      catch(err){
        console.log(err)
      }
      
      this.isLoading = false
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
  export default application

</script>

<style scoped>
  @import "./assets/styles/global.css"; 
  .overlay{
    height: 100%;
    z-index:2;
  }
  .footerWrapper{
    width:100% !important;
  }
</style>