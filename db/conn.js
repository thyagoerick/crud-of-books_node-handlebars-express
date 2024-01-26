const mysql = require('mysql')

/**
 *  Connection Pool é um recurso para otimizar as conexões, criando um cache e permitindo sua reutilização;
 */

const pool = mysql.createPool({
    connectionLimit:10, // Mantém no máximo 10 conexões, apartir disso, ele vai começar a matar as conexões inativas, que estão a muito tempo sem receber resposta. Então ele consegue fazer esse gerenciamento para otimizar o BD
    host:`localhost`,
    user: 'root',
    password:'',
    database:'nodemysql',
})

module.exports = pool