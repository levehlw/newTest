const mysql = require('mysql')
const con = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'root',
        port:'3306',
        database:'test'
    })

//开始连接
con.connect()

//同意执行执行函数
const exec =  function (sql){
    const promise = new Promise((resolve,reject) =>{
        con.query(sql,(err,result) => {
            if(err){
                reject(err)
                return
            }
            resolve(result)
        })
    })
    return promise
}
module.exports = {
    exec,
    escape:mysql.escape
}

