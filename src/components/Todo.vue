<template>
    <div class='todo-wrapper'>
        <b-overlay
        id="overlay-background"
        :show='isLoading'
        rounded="sm"
            > 
            <div class='row'>
                <div class='col-12 col-sm-4 col-lg-2'>
                    <div>
                        <i class="far fa-thumbs-up text-secondary" v-if="!isDone()" @click="$emit('markAsDone', doneData())" data-bs-toggle="tooltip" data-bs-placement="top" title="Mark as done!"></i>
                        <i class="fas fa-trash-restore text-warning" v-if="isDone()" @click="$emit('markAsDone', doneData())" data-bs-toggle="tooltip" data-bs-placement="top" title="If you want to undone..."></i>
                    </div>
                </div>
                <div class='col-12 col-sm-8 col-lg-8'>
                    <div class='mt-1 text-center editable'>
                        <h5 class='text-center' v-bind:class='{isToogled: isDone()}'>
                            <b-form-input
                            :plaintext="!isEditing"
                            v-model='title'
                            class='text-center'
                            >
                            </b-form-input>
                        </h5>
                        <b-form-textarea
                        id="textarea"
                        v-model="description"
                        :plaintext="!isEditing"
                        :rows="2"
                        no-resize
                        class='form-control-sm text-center text-sm'
                        ></b-form-textarea>

                    </div>
                </div>
                <div class='col-lg-1' v-if='isEditing && showDeleteButton'> 
                    <i v-if='isEditing' @click="update" class='fas fa-check text-success'></i>
                </div>
                <div class='col-lg-1' v-if='!isEditing && showDeleteButton'> 
                    <i class="fas fa-pen text-warning" @click="isEditing = true" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit this todo!"></i>
                </div>
                <div class='col-lg-1' v-if='showDeleteButton'> 
                    <i class="far fa-trash-alt text-danger float-right" @click="$emit('deleteTodo', $data)" data-bs-toggle="tooltip" data-bs-placement="top" title="Exclude this todo!"></i>
                </div>
            </div>
        </b-overlay>
    </div>
</template>

<script>


export default {
    name: 'Todo',
    props: [
        'todo',
        'buttonName',
        'showDeleteButton'
    ],
    data(){
        return{
            isLoading: false,
            isEditing: false,
            title: this.todo.title,
            description: this.todo.description,
            status: this.todo.status,
            id: this.todo._id,
            order:this.todo.order,
            files: [
                {
                    _id:this.id,
                    order:this.order
                }
            ]/* debug is on
            try to understand how to drag an item
            almost there */
        };
    },
    computed:{
        payload(){
            return {
                id: this.id,
                title: this.title,
                description: this.description
            }
        }
    },
    methods:{
        async update(){
            const axios = require('axios').default
            
            this.isLoading = true

            let res = await axios({
                method: 'put', 
                url:'/todos/',
                data: this.payload
            })

            if(res.status === 200){
                this.isLoading = false
                this.isEditing = false
                console.log(res.data)
            }
        },
        doneData(){
            return {
                id: this.id,
                status: this.status
            }
        },
        isDone(){
            return this.status === 'done' ? true : false;
        }, 
    }
    
}
</script>

<style scoped>
    .isToogled{
        text-decoration: line-through;
    }
    .todo-wrapper{
        cursor: pointer;
    }
</style>