<template>
    <div class='footer'>
        <div class="row justify-content-center align-items-end">
            <div class='col-6'>
                <div class='row justify-content-center align-items-between'>
                    <h4 class='col-12 mb-3'>Useful resources:</h4>
                    <a class='col' href="https://nodejs.org/en/docs/">Node.js docs</a>
                    <a class='col' href="https://docs.mongodb.com/">Mongo docs</a>
                    <a class='col' href="https://developer.mozilla.org/pt-BR/docs/Web/JavaScript">Javascript docs</a>
                    <a class='col' href="https://expressjs.com/pt-br/4x/api.html">Express.js docs</a>
                    <a class='col' href="https://vuejs.org/v2/guide/">Vue docs</a>
                </div>
            </div>
            <div class='col-6'>
                <div class='row justify-content-center align-items-between'>
                    <h4 class='col-12 mb-3'>Technologies used:</h4>
                    <i class="col fab fa-node"></i>
                    <div class='col'>
                        <img class='footerImg'  src="https://img.icons8.com/color/48/000000/mongodb.png" alt="mongoDB"/>
                    </div>
                    <i class="col fab fa-vuejs"></i>
                    <div class='col'>
                        <img class='footerImg'  src="https://cdn.iconscout.com/icon/free/png-64/express-8-1175029.png" alt="express.js">
                    </div>
                </div>
            </div>
            <small class='textBrand mt-5 mb-0'>&copy; ENNESDEV 2021</small>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Footer',
}
</script>

<style scoped>
    .footerImg{
        max-height: 50px !important;
        max-width: 80px !important;
    }
    a{
        text-decoration: none;
        color: #ECF87F;
        font-size: 20px;
    }
</style>