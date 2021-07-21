<template>
    <div class="display-board border-effect">
        <div class='row'>
            <div class='col-6 text-center'>
                <h4>Todo</h4>
                <div class="number">
                {{numberOfTodos}}
                </div>
            </div>
            <div class='col-6 text-center'>
                <h4>Done</h4>
                <div class="number">
                {{numberOfFinishedTodos}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'DisplayBoard',
        props: ['numberOfTodos', 'numberOfFinishedTodos']
    }
</script>