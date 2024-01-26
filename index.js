// Import express
const express = require('express');
const app = express();
const port = 3000;

// Import express-handlebars
const exphbs = require('express-handlebars')

// Import do pool para conexão com MySQL
const pool = require('./db/conn')

/**************CONFIGURAÇÕES APP****************/
// Configurar Express para poder pegar o body dos forms
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json()) //Obter o dado do body em json()

// Config partials
const hbs = exphbs.create({
    partialsDir: ['views/partials']//array de onde pode-se encontra partials
})

// Config handlebars (com partials)
app.engine('handlebars', hbs.engine)/**
        Aqui, você está registrando o Handlebars como mecanismo de visualização no Express. A função app.engine é usada para associar a extensão 'handlebars' ao engine do Handlebars que configuramos anteriormente (hbs.engine)*/
app.set('view engine', 'handlebars')/**
        - app.set: É um método do Express usado para configurar diferentes configurações no aplicativo.
        - view engine: É a configuração que define o mecanismo de visualização que o Express usará para renderizar as páginas.
        - handlebars: Indica que o mecanismo de visualização a ser usado é o Handlebars.
 */

// Config styles
app.use(express.static('public'))//middleware
/***********************************************/



/*********************ROTAS*********************/
// (C) Cadastrar Livro
app.post('/books/insertbook', (req, res) => {
    const title = req.body.title;
    const pageqty = req.body.pagesqty;
    // Qualquer e todo dado que vem do usuário/cliente NÃO CONFIAMOS


    /**A sanitização de dados 
     * é o processo de remover ou modificar dados de entrada do utilizador 
     * que podem ser potencialmente maliciosos, inválidos ou indesejados. 
     * */
    /** 2 maneiras de segurança:
     * 1 - nas colunas, colocando: ??
     * 2 - nos valores. colocando: ?
     * */
   // Criando a query para insert
    const sql = `INSERT INTO books (??, ??) VALUES (?, ?)`

    // Depois temos que fazer um array para informar (futuramente), o que será substituído pelo o quê?
    const data = ['title', 'pageqty', title, pageqty]

    pool.query(sql, data, (err) => {
        if (err) {
            console.log(err)
            return;
        }
        res.redirect('/books')
    })

})

// (R) Ler livro(s) cadastrado(s)
app.get('/books/:id', (req, res) => {
    const id = req.params.id

    const sql = `SELECT * FROM books WHERE ?? = ?`
    const data = ['id', id]

    pool.query(sql, data, (err, data) => {
        if (err) {
            console.log(err)
            return;
        }

        const book = data[0]

        res.render('book', { book })
    })

})
app.get('/books', (req, res) => {
    const sql = `SELECT * FROM books`
    pool.query(sql, (err, data) => {
        if (err) {
            console.log(err)
            return;
        }
        const books = data
        console.log(books);

        res.render('books', { books })
    })
})

// (U) Atualizar/Editar livros
app.get('/books/edit/:id', (req, res) => {

    const id = req.params.id

    const sql = `SELECT * FROM books WHERE ?? = ?`
    const data = ['id', id]

    pool.query(sql, data, (err, data) => {

        if (err) {
            console.log(err);
            return;
        }

        const book = data[0]

        res.render('editbook', { book })
    })
})
app.post('/books/updatedbook', (req, res) => {
    const id = req.body.id
    const title = req.body.title
    const pageqty = req.body.pagesqty

    const sql = `UPDATE books SET ?? = ?, ?? = ? WHERE ?? = ?`
    const data = ['title', title, 'pageqty', pageqty, 'id', id]

    pool.query(sql, data, (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        res.redirect(`/books`)
    })

})

// (D) Deletar/Remover/Apagar livros
app.post('/books/remove/:id', (req, res) => {
    const id = req.params.id

    const sql = `DELETE FROM books WHERE ?? = ?`
    const data = ['id', id]
    
    pool.query(sql, data, (err, data)=>{
        if (err) {
            console.log(err);
            return;
        }

        res.redirect('/books')
    })
})

app.get('/', (req, res) => {
    res.render('home')
})
/***********************************************/



/********************SERVER*********************/
app.listen(port, () => {
    console.log(`Conectou ao MySQL! \nServidor rodando na porta ${port}`);
})
/***********************************************/
