
    // carregando as configurações do arquivo .env para o objeto process.env 
    require("dotenv").config();

    const db = require("./db"); // importa o módulo de banco de dados 
    const port = process.env.PORT; // recupera a porta definida do .env 
    const express = require("express"); // framework web para lidar com rotas e middlewares

    const app = (express.json()); // instancia a aplicação express

        // middlewarw: instruimos o express a converter automaticamente o corpo das requisões (body) para JSON
    app.use(express.json());

    // rota root: util para check ( verificar se api esta online) 
    // 1º parametro: caminho de rota 
    // 2º função de callback (funcao disparada quando a rota for invocada)
   app.get("/", (req, res) => {
    res.json({
        message: "Funcionando!"
    })
   })

    // Rota GET (Read): Busca um recurso específico pelo ID passado na URL (:id_cliente)
    app.get("/clientes/:id_cliente", async (req, res) => {
    // req.params contém os parâmetros passados na URL
    const clientes = await db.selectCliente(req.params.id_cliente);
    res.json(clientes);
})

   // rota GET (READ): Lista todos os registro da tabela 
   app.get("/clientes", async (req, res) => {
    const clientes = await db.selectClientes();
    res.json(clientes);
   })
   // Rota POST (Create): Recebe dados no corpo da requisição para criar um novo registro
   app.post("/clientes", async (req, res) => {
    // req.body contém os dados enviados pelo cliente (ex: via Postman ou Frontend)
    await db.insertCliente(req.body);
    // Status 201: Código HTTP padrão para "Created" (Criado com sucesso)
    res.sendStatus(201);
})
   
   app.listen(port); 
   console.log("Backend rodando na porta" + port); 

   



