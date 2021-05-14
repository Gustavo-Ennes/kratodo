<template>
  
  <div class='wrapper'>
    <b-row align-h='center' align-v='center'>
      <b-col cols='12'>
        <b-alert  class='text-right text-danger' :show="showAlert" variant="success" @dismissed="showAlert = false" dismissible>
          {{alertMessage}}
        </b-alert>

      </b-col>
      <b-col cols='12' class='titleFont text-center'>
        <h1 class='display-3 my-5 newUserTitle text-warning'>new user</h1>
      </b-col>
      <b-col cols='12'>
        <section class='m-3 newUser'>
          <main :class="{'w-100': isMobile}" class='display-board border-effect mx-auto text-center main w-50 p-4'>
            <label for='formName' class='text-left text-warning'>Your name</label>
            <b-input id='formName' v-model='name' type='text' class='form-control mb-3' placeholder="your name" />
            <label for='formName' class='text-warning text-left'>Your e-mail</label>
            <b-input v-model='email' type='text' class='form-control' placeholder="e-mail" />
            <label for='formName' class='text-warning text-left'>Password</label>
            <b-input v-model='password1' type='password' class='form-control mt-3 text-warning' placeholder='Password' />
            <b-input v-model='password2' type='password' class='form-control mt-2 mb-4 text-warning' placeholder='Type password one more time'/>
            <b-overlay
              :show="loading"
              spinner-variant="warning"
              spinner-type="grow"
              spinner-small
              rounded="sm"
            >
              <b-row>
                <b-col cols='6'>
                  <b-btn variant='light' class='text-warning' @click='$emit("back")'>Back</b-btn>
                </b-col>
                <b-col cols='6'>
                 <b-btn variant='light' class='text-warning' @click='submit' :disabled='!isValidated'>Create</b-btn>
                </b-col>
              </b-row>
            </b-overlay>
          </main>
        </section>
      </b-col>
    </b-row>
  </div>
</template>

<script>

const Animate = require('../utils/animate');

export default {
  name: 'newUser',
  data(){
    return {
      name: '',
      email: '',
      password1: '',
      password2: '',
      showAlert: false,
      alertMessage: '',
      loading: false
    }
  },
  computed: {
    isMobile(){
      return window.screen.width < 400
    },
    isEmailValid(){
       return /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.exec(this.email) ? true : false
    },
    isValidated(){
      return (
        this.name.length > 5 &&
        this.isEmailValid &&
        this.password1 === this.password2 &&
        this.password2.length > 5
      )
    },
    payload(){
      return {
        name: this.name,
        email: this.email,
        password: this.password1
      }
    }
  },
  methods:{
    
    async submit(){
      this.loading = true

      const axios = require('axios')
      require('dotenv').config()

      if(this.isValidated){
        try {
          let res = await axios({
            method: 'post',
            url: 'create-user',
            headers:{
              "Content-Type": "application/json"
            },
            withCredentials: false,
            data: this.payload
          })
          if(res.status === 201){
            await this.$emit('login', this.payload)
            await this.$emit('showAlert', `Welcome ${this.name}!`)
          }
        } catch (err) {
          this.message = `There's an error processing your user creation. Try again later`
          this.showAlert = true
        }
      } else{
        this.showWhy()
      }

      this.loading = false
    },

    showWhy(){
      let message = ''
      if(this.password1 !== this.password2){
        message = " < Passwords are different > "
      }
      if(this.password2.length < 5){
        message += " < At least 5 characters in password > "
      }
      if(!this.isEmailValid){
        message += " < Enter a valid e-mail > "
      }
      if(this.name.length < 5){
        message += " < At least 5 characters in name > "
      }
      this.alertMessage = message
      this.showAlert = true
    }
  },
  async mounted(){
    await Animate('.newUserTitle', 'zoomInDown', '2', '0.2')
    await Animate('.newUser', 'flipInX', '2.2', '1.2')
  }

}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');

  .main{
    margin-top: 10%;
    margin-bottom: 20%;
    background-color:teal !important;
  }
  .titleFont{
    font-family: 'Fredoka One', cursive;
    text-shadow: 6px 6px 3px rgba(0, 0, 0, 0.3);
    color: #fff;
  }
  .wrapper{
    background: url(https://ksr-ugc.imgix.net/assets/017/754/999/d9bc3790556b7bae2c0352834c0f5b44_original.jpg?crop=faces&w=1552&h=873&fit=crop&v=1501706488&auto=format&q=92&s=3513fde78d45acbc5a1b8843ae10e9d1) center no-repeat;
    background-position: cover;
    background-size: 100% 100%;
    height: 100%;
    width: 100% !important;
    margin-bottom: 0px !important;
  }
  .layer{
    background-color: rgba(222, 222, 0, 0.2);
  }

</style>