// Função interna para gerenciar a conexão
// O uso do padrão "Singleton" (via global.connection) evita abrir conexões desnecessárias
async function connect() {

    // Se já existir uma conexão ativa, reutiliza o pool existente
    if(global.connection)
        return global.connection.connect();

    // O Pool permite gerenciar múltiplas conexões simultâneas de forma eficiente
    const { Pool } = require("pg");
    const pool = new Pool({
        connectionString: process.env.CONNECTION_STRING
    });

    const client = await pool.connect();
    console.log("Criou o pool de conexão");

    // Teste simples de conectividade
    const res = await client.query("SELECT now();");
    console.log("Conectado ao Postgres em:", res.rows[0]); // capturando a 1ª linha
    client.release(); // Libera o cliente de volta para o pool

    // Armazena o pool globalmente para ser reutilizado por outras chamadas
    global.connection = pool;

    return pool.connect();
}

// Executa a tentativa inicial de conexão ao subir a aplicação
// Executa a tentativa inicial de conexão ao subir a aplicação
connect();

// Função para buscar todos os clientes
 async function selectClientes() {
    const client = await connect();
    // Query simples sem parâmetros
    const res = await client.query("SELECT * FROM tb_clientes;");
    return res.rows;
}

async function selectCliente(id_cliente) {
    const client = await connect();
    // SEGURANÇA: Uso de parâmetros ($1). O driver 'pg' limpa o dado, evitando SQL Injection
    const res = await client.query("SELECT * FROM tb_clientes WHERE id_cliente = $1;", [id_cliente]);
    return res.rows;
}

// Exportação das funções: Torna este arquivo um módulo que pode ser usado por outros (ex: index.js)
 /*module.exports = {
    selectClientes,
    selectCliente
} */
// Função para inserir um novo cliente
async function insertCliente(cliente) {
    const client = await connect();
    // Mapeamento explícito das colunas para garantir integridade
    const sql = "INSERT INTO tb_clientes(nm_cliente, dt_nascimento, uf) VALUES ($1, $2, $3)";
    const values = [cliente.nm_cliente, cliente.dt_nascimento, cliente.uf];

    await client.query(sql, values);
    // A função de "insert" não possui um retorno (não é uma query)
}

// Exportação das funções: Torna este arquivo um módulo que pode ser usado por outros (ex: index.js)
module.exports = {
    selectClientes,
    selectCliente,
    insertCliente
}



