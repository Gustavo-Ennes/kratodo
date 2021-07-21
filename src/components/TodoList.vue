<template>
    <div class="border p-2" id='tooltipWrapper' v-if='todos.length > 0'>
        <h2 class='mb-2'>{{this.title}}</h2> 
        <div class="if-wrapper" v-if='canDrag'>

            <!-- if draggable todo -->
            <draggable @change="handleChange" :list='todos' v-if='todos.length > 0'>       
                <div v-for="item in todos" :key="item._id">
                    <Todo 
                        :todo="item"
                        :buttonName="item.status === 'todo' ? 'Done' : '<'"
                        :showDeleteButton="showDeleteButton"
                        :lastOrder="getLastOrderedIndex()"
                        @deleteTodo="deleteTodo" 
                        @changeList='changeList'
                        @markAsDone='markAsDone' 
                    />
                </div>
            </draggable>
        </div>
        <div class='if-wrapper' v-else>
            <div v-if='todos.length > 0'>       
                <div v-for="item in todos" :key="item._id">
                    <Todo 
                        :todo="item"
                        :buttonName="item.status === 'todo' ? 'Done' : '<'"
                        :showDeleteButton="showDeleteButton"
                        :lastOrder="getLastOrderedIndex()"
                        @deleteTodo="deleteTodo" 
                        @changeList='changeList'
                        @markAsDone='markAsDone' 
                    />
                </div>
            </div>

        </div>
        
        <b-tooltip 
        target="tooltipWrapper"
        triggers="hover" 
        :placement="'topright'"
        :variant="'success'"
        >
            Try to grab a todo to change it's position!
        </b-tooltip>
    </div>
</template>

<script>    
    import Todo from './Todo.vue'
    import draggable from 'vuedraggable'

    export default {
        name: 'TodoList',
        props: ['todos', 'title', 'showDeleteButton', 'canDrag'],
        components:{
            Todo,
            draggable
        },
        methods:{
            searchByOrder(order){
                let todo = null;
                this.todos.map(each =>{
                    if(each.order === order){
                        todo = each
                    }
                })
                return todo
            },
            async updateOrderByDrag(draggedPayload, dropPayload){
                await this.$emit('updateOrder', draggedPayload)
                await this.$emit('updateOrder', dropPayload)
            },
            async handleChange(dict){
                //element dragged
                try{
                    let draggedElement = dict.moved.element
                    let dropElement = this.searchByOrder(dict.moved.newIndex + 1)
                    let draggedPayload = {
                        id: draggedElement._id,
                        order: dict.moved.newIndex + 1
                    }
                    let dropElementPayload = {
                        id: dropElement._id,
                        order: dict.moved.oldIndex + 1
                    }
                    
                    await this.updateOrderByDrag(draggedPayload, dropElementPayload)

                }catch(err){
                    console.log("Error at drag-and-drop todo's:   " + err.stack)
                }
            },
            getLastOrderedIndex(){
                let maxIndex = 0
                this.todos.map(each => {
                    if(each.order > maxIndex){
                        maxIndex = each.order
                    }
                })
                return maxIndex
            },
            markAsDone(data){
                this.$emit('markAsDone', data)
            },
            changeList(){
                this.$emit('changeList');
            },
            async deleteTodo(todo){
                this.$emit('deleteTodo', todo);
            }
        }
    }
</script>