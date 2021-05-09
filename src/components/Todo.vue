<template>
    <div class='todo-wrapper'>
        <div class='row'>
            <div class='col-12 col-sm-4 col-lg-2'>
                <div>
                    <i class="far fa-thumbs-up text-secondary" v-if="!isDone()" @click="$emit('markAsDone', doneData())" data-bs-toggle="tooltip" data-bs-placement="top" title="Mark as done!"></i>
                    <i class="fas fa-check text-success" v-if="isDone()" @click="$emit('markAsDone', doneData())" data-bs-toggle="tooltip" data-bs-placement="top" title="If you want to undone..."></i>
                </div>
            </div>
            <div class='col-12 col-sm-8 col-lg-8'>
                <div class='mt-1 text-center'>
                    <h5 class='text-center' v-bind:class='{isToogled: isDone()}'>
                        {{ todo.title }}
                    </h5>
                    <p class='text-center'><small class='text-center'>{{ todo.description }}</small></p>
                </div>
            </div>
            <div class='col-lg-2' v-if='showDeleteButton'> 
                <i class="far fa-trash-alt text-danger float-right" @click="$emit('deleteTodo', $data)" data-bs-toggle="tooltip" data-bs-placement="top" title="Exclude this todo!"></i>
            </div>
        </div>
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
    methods:{
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