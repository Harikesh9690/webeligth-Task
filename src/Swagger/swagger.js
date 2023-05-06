const swaggerJsDoc= require("swagger-jsdoc");


const options={
    definition:{
        openapi: '3.0.0',
        info:{
            title: "webelight Assignment -->Nodejs Project for Backend ",
            version: '1.0.0'
        },
        servers:[
            {
                url:'http://localhost:3000/'
            }
        ],
        components: {
            securitySchemas:{
                bearerAuth:{type:"http",
                scheme: "bearer",
                bearerFormate:"JWT"
                },
            },
        },
        security:[
            {
                bearerAuth:[],
            },
        ],

    }, 
    apis:['../routes/route.js']
}

const swaggerSpec = swaggerJsDoc(options)
 
module.exports={ swaggerSpec};