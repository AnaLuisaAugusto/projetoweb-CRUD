const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
const post = require("./models/post")


app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//views 
    //forms cadastro
    app.get("/", function(req, res){
        res.render("index")
    })

    //forms editar
    app.get("/atualizar/:id", function(req, res) 
    {
        res.render("atualizar")
    })

    //listar
    app.get("/consultar", function(req, res){
        post.findAll() // Busque todos os clientes
        .then(function(clientes){
            res.render("consultar", { clientes: clientes }); // Passe os clientes para o template Handlebars
        })
        .catch(function(erro){
            res.send("Falha ao mostrar a lista de clientes: " + erro);
        });  
    });
    // fim da view listar

//fim das views 

//função create
    app.post("/cadastrar", function(req, res){
        post.create({
            nome: req.body.nome,
            telefone: req.body.telefone,
            origem: req.body.origem,
            dataContato: req.body.data_contato,
            observacao: req.body.observacao
        })
        
        .then(function(){
            res.send("Dados Enviados com Sucesso!")
        })
        
        .catch(function(erro){
            res.send("Falha ao cadastrar os dados: " + erro)
        })
    })
//fim da função create


// função editar/atualizar 
    app.post("/atualizar/:id", function(req, res){
        const id = req.params.id;
        const {nome, telefone, origem, data_contato, observacao} = req.body; 

        post.atualizar({
            nome: nome,
            telefone: telefone,
            origem: origem,
            dataContato: data_contato,
            observacao: observacao
        }, 

        {
            where: { id: id }
        })

        .then(function(result){
            if (result[0] === 1){
                res.send("Dados editados com Sucesso!");
            } 

            else{
                res.send("Dados não enviados ou encontrados!");
            }
        })
        .catch(function(erro){
            res.send("Falha ao atualizar o cliente: " + erro);
        });
    });


app.listen(8081, function(){
    console.log("console ativo!")
})