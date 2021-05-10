<template>
  <div class="hello container-fluid">

    <b-alert class='text-right text-ligth' :show="showAlert" variant="success" @dismissed="showAlert = false" dismissible>
      {{alertMessage}}
    </b-alert>

    <Header/>
    <div class="mt-4 my-3">
      <div class="row">
        <div class='col-6 '>
          <small class='email'>{{ payload.email }}</small>
        </div>
        <div class='col-6 text-right'>
          <b-button variant='ligth' @click="$emit('logout')">
            <small>log out</small>
          </b-button>
        </div>
        <div class="col-md-8 animate">
            <CreateTodo class='create' @createTodo="todoCreate" :isLoading="isLoading"/>
        </div>
        <div class="col-md-4 my-3 my-md-0 mt-md-4 animate">
            <DisplayBoard class='display' :numberOfTodos="numberOfTodos" :numberOfFinishedTodos="numberOfFinishedTodos"/>
        </div>
      </div>
    </div>
    <div class="row animate">
        <div class='col-12 col-lg-8'>
          <section class='m-3 lists'>
            <TodoList 
              @deleteTodo="deleteTodo" 
              :todos='todos'
              :title="'Todos'"
              :showDeleteButton="true"
              :canDrag='true'
              @changeList='changeList'
              @markAsDone='markAsDone'
              @updateOrder="updateTodo"
            />
          </section>
        </div>
        <div class='col-12 col-lg-4'>
          <section class='m-3'>
            <TodoList 
              @deleteTodo="deleteTodo" 
              :todos='done' 
              :title="'Dones'"
              :showDeleteButton='false'
              :canDrag='false'
              @changeList='changeList'
              @markAsDone='markAsDone'
              @updateOrder="updateTodo"
            />
          </section>
        </div>
    </div>
  </div>
</template>

<script>
import Header from './Header.vue'
import CreateTodo from './CreateTodo.vue'
import DisplayBoard from './DisplayBoard.vue'
import TodoList from './TodoList.vue'
const axios = require('axios').default

export default {
  name: 'Dashboard',
  props:['url', 'payload'],
  components: {
    Header,
    CreateTodo,
    DisplayBoard,
    TodoList
  },
  data() {
      return {
          todos: [],
          done:[],
          numberOfTodos: 0,
          numberOfFinishedTodos:0,
          isLoading: false,
          showAlert: false,
          alertMessage: ''
      }
  },
  methods: {
    async markAsDone(data){
      this.isLoading = true;

      // set opposite state
      let status = data.status === 'todo' ? 'done' : 'todo';
      this.numberOfTodos += status === 'done' ? -1 : 1
      this.numberOfFinishedTodos += status === 'done' ? 1 : -1
      let url = `todos/${data.id}`;

      // the second arguement is this.getOrder() is the id
      // if I send null, getOrder() will understand that
      // this todo is a unfinished todo
      let argID = data.status === 'done'? data.id : null
      let body = {status: status, order:this.getOrder(status, argID)};
      await axios({
        method:'put',
        url: url,
        data: body,
        auth: {
          username: this.payload.email,
          password: this.payload.password
        }
      })

      await this.fetchTodos();
      
      this.isLoading = false;
    },
    async changeList(){
      await this.fetchTodos();
    },
    letMeSee(){
      console.log(
        "this is my data:\n\ntodos:\n"
        + JSON.stringify(this.todos) 
        + "\ndone:\n" 
        + JSON.stringify(this.done)
        + "\nnumber of Todo's: \n" 
        + this.numberOfTodos
        + "\nnumber of Done Todo's: \n"
        + this.numberOfFinishedTodos
      );
    },
    async fetchFinished(){
      try{
        const res = await axios({
          method:'get',
          url:'todos/finished',
          auth:{
            username: this.payload.email,
            password: this.payload.password
          }
        })
        const data = res.data
        this.done = data.todos
        this.numberOfFinishedTodos = this.done.length
      }catch(err){
        console.error(err)
      }
    },
    async fetchUnfinished(){
      try{
        const res = await axios({
          method:'get',
          url:'todos/unfinished',
          auth:{
            username: this.payload.email,
            password: this.payload.password
          }
        })
        const data = res.data
        this.todos = data.todos;
        this.numberOfTodos = this.todos.length;
      }catch(err){
        console.error(err);
      }
    },
    async fetchTodos(){
      this.isLoading = true;

      await this.fetchUnfinished();
      await this.fetchFinished();

      this.isLoading = false;
    },
    async deleteTodo(todo){
      try{
        this.isLoading = true;

        let url = `todos/${todo.id}`;
        let res =  await axios({
          method:'delete',
          url: url,
          auth:{
            username: this.payload.email,
            password: this.payload.password
          },
          headers:{
            "Content-Type": "application/json"
          }
        })
        await this.fetchTodos();

        this.isLoading = false;

        return res 
      }catch(err){
        console.error(err);
      }
    },
    async todoCreate(data) {
      this.isLoading =  true;
      data.order = this.getOrder(data.status, null);
      await axios({
          method:'post',
          url:'todos',
          auth:{
            username: this.payload.email,
            password: this.payload.password
          },
          data: data
        })
      await this.fetchTodos();

      this.isLoading = false;
    },
    getOrder(type, id){
      let maxOrderTodo = 0;
      let maxOrderDone = 0;
      //if todo have no order number, like the first ones
      //we have to give they an order number before
      //to after get the highest order number to give to our new todo
      this.todos.map(todo =>{
        if(todo.order > maxOrderTodo){
          maxOrderTodo = todo.order
        }
      })
      //as the done list is filtered in decreasing id,
      //it dont workds well with draggable element
      //so I have to return 1 if type == 'done'
      //and increase by 1 the order of the others
      if( id ){
        this.done.map(doneTodo =>{
          if(doneTodo._id !== id){
            doneTodo.order++
            let payload = {
              id: id,
              order: doneTodo.order
            }
            this.$emit('updateTodo', payload)
          }
        })
        return ++maxOrderDone
      }
      return ++maxOrderTodo 
    },
    async updateTodo(data){
      this.isLoading = true;
      

      let url = `todos/${data.id}`
      await axios({
        method:'put',
        url:url,
        auth:{
          username: this.payload.email,
          password: this.payload.password
        }
      })
      this.fetchTodos();
      
      this.isLoading = false;
    }
  },
  async mounted(){
    const Animate = require('../utils/animate');

    await Animate('.animate', 'bounceInUp', '0.5', '.2', true)

    await this.fetchTodos();
  }
}
</script>


<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200&family=Stick&display=swap');

  .email{
    text-align: start;
    padding-top: 5px !important;
    color: rgba(0, 155, 0, 0.3)
  }
</style>