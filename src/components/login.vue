<template>
  <div class='wrapper vh-100'>
    <div>
      <b-row align-h='center' align-v='center'>
        <b-col cols='12'>
          <b-alert class='text-right text-danger' :show="showAlert" variant="success" @dismissed="showAlert = false" dismissible>
            {{alertMessage}}
          </b-alert>
        </b-col>
        <b-col cols='12' class='titleFont text-center'>
          <h1 class='display-4 my-5 siteTitle'>
            KRA-TODO<br/>
            <small class='subtitle'> A simple app to handle your tasks</small>

          </h1>
        </b-col>
        <b-col cols='12' align-self="center">
          <section class='login m-3'>
            <form :class="{'w-100': isMobile}" class='display-board border-effect mx-auto  my-auto text-center main w-50 p-4'>

              <label for="inputMail" class='text-light'>E-mail</label>
              <b-input id='inputMail' :trim='true' v-model='email' :type="'text'" :placeholder="'e-mail'" :autocomplete="'off'"></b-input>
              <label for="inputMail" class='text-light mt-3'>Password</label>
              <b-input id='inputPass' :trim='true' v-model='password' :type="'password'" class='mb-4' placeholder='Password'></b-input>

              <b-overlay
                :show="loading"
                spinner-variant="success"
                spinner-type="grow"
                spinner-small
                rounded="sm"
                bg-color="transparent"
              >
                <b-btn variant='dark' @click='submit' :disabled='!isValidated'>Log In</b-btn>
              </b-overlay>
              <b-btn variant='dark' class='mt-2' @click="$emit('newUserPage', true)">Sign In</b-btn>
            </form>
          </section>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>

const axios = require('axios')
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
    },
    addEventListerners(){
      const inputMail = document.querySelector('#inputMail')
      const inputPass = document.querySelector("#inputPass")

      inputMail.addEventListener('keyup', (e) =>{
        if(e.code === 'Enter'){
          if(this.isValidated){
            this.submit()
          }
        }
      })
      inputPass.addEventListener('keyup', (e) =>{
        if(e.code === 'Enter'){
          if(this.isValidated){
            this.submit()
          }
        }
      })
    }
  },
  async mounted(){    
    await Animate('.siteTitle', 'zoomInDown', '2', '0.2')
    await Animate('.login', 'flipInX', '2.2', '1.2')
    const m = document.querySelector('.main')
    m.style.setProperty('min-height', window.innerHeight)

    this.addEventListerners()
  }
}
</script>

<style scoped>

  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');

  main{
    margin-top: 10%;
    margin-bottom: 20%;
  }
  .titleFont{
    font-family: 'Fredoka One', cursive;
    text-shadow: 3px 2px 3px #000a02f5;
    color: #72BC5C ;
  }
  .wrapper{
    background-size: 100% 100%;
    height: 100%;
    margin-bottom: 0;
    width: 100%;

  }
  .layer{
    background-color: rgba(222, 222, 0, 0.5);
    height:100%;
    width:100%;
  }

  .login{
    margin-top:30%;
  }

  .subtitle{
    font-size: 3vw;
  }

</style>