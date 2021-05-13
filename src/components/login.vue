<template>
  <div class='container-fluid wrapper'>
    <b-row align-h='center' align-v='center' class='layer'>
      <b-col cols='12'>
        <b-alert class='text-right text-danger' :show="showAlert" variant="success" @dismissed="showAlert = false" dismissible>
          {{alertMessage}}
        </b-alert>
      </b-col>
      <b-col cols='12' class='titleFont text-center'>
        <h1 class='display-3 my-5 loginTitle'>KRA-TODO</h1>
      </b-col>
      <b-col cols='12'>
        <section class='m-3 login'>
          <main :class="{'w-100': isMobile}" class='display-board border-effect mx-auto text-center main w-50 p-4'>
            <b-input :trim='true' v-model='email' :type="'text'" :placeholder="'e-mail'" :autocomplete="'off'"></b-input>
            <b-input :trim='true' v-model='password' :type="'password'" class='mt-3 mb-4' placeholder='Password'></b-input>

            <b-overlay
              :show="loading"
              spinner-variant="warning"
              spinner-type="grow"
              spinner-small
              rounded="sm"
            >
              <b-btn variant='light' @click='submit' :disabled='!isValidated'>Log In</b-btn>
            </b-overlay>
            <b-btn variant='light' class='mt-2' @click="$emit('newUserPage', true)">Sign In</b-btn>
          </main>
        </section>
      </b-col>
    </b-row>
  </div>
</template>

<script>

const axios = require('axios').default
const Animate = require('../utils/animate')

export default {
  name: "Login",
  data(){
    return{
      email: '',
      password: '',
      loading: false,
      showAlert: false,
      alertMessage: ''
    }
  },
  computed: {
    isMobile(){
      return window.screen.width < 400
    },
    isValidated(){
      return this.email.length > 5 && this.password.length > 5
    },
    payload(){
      return {
        email: this.email,
        password: this.password
      }
    }
  },
  methods:{
    clearForm(){
      this.email = ''
      this.password = ''
    },  
    async submit(){
      let res = null
      try{

        this.loading = true
        res = await axios({
          method: 'get',
          url:'/login/',
          auth: {
            username: this.email,
            password: this.password
          }
        })

        if(res.status === 200){
          await this.$emit('login', this.payload)
        }

        this.clearForm()

      }catch(err){
        this.alertMessage = "Wrong user or password"
        this.showAlert = true
        Animate('.login', 'tada', '.4')

      }finally{
        this.loading = false
      }      
    }
  },
  async mounted(){    
    await Animate('.loginTitle', 'zoomInDown', '2', '0.2')
    await Animate('.login', 'flipInX', '2.2', '1.2')
  }
}
</script>

<style scoped>

  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');

  .main{
    margin-top: 10%;
    margin-bottom: 20%;
  }
  .titleFont{
    font-family: 'Fredoka One', cursive;
    text-shadow: 6px 6px 3px #59981A;
    color: #fff;
  }
  .wrapper{
    background: url(https://ksr-ugc.imgix.net/assets/017/754/999/d9bc3790556b7bae2c0352834c0f5b44_original.jpg?crop=faces&w=1552&h=873&fit=crop&v=1501706488&auto=format&q=92&s=3513fde78d45acbc5a1b8843ae10e9d1) center no-repeat;
    background-position: cover;
    background-size: 100% 100%;
    height: 100%;
    margin-bottom: 0px !important;
    width: 100%;
  }
  .layer{
    background-color: rgba(222, 222, 0, 0.5);
  }

</style>