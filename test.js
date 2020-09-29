const superagent = require('superagent');
//const {exec, escape} = require('./mysql')
const cheerio = require('cheerio');
const fs = require('fs');
const schedule = require('node-schedule');
let url = ''
let exit = 0
// 定义爬虫
function get(url, type){
    const t = type
    return new Promise((resolve) => {
        try{
            superagent('GET',url).retry(10).timeout({
                response: 5000,  // Wait 5 seconds for the server to start sending,
                deadline: 60000, // but allow 1 minute for the file to finish loading.
              }).then(res => {
                if(res){
                $ = cheerio.load(res.text)
                let array = []
                // 添加链接到数组
                $('a[target=_blank]', '.headline-left').each((i, item) => {
                let href = $(item).attr('href')
                array.push(href)
                })
                // 遍历所有链接，访问文章
                array.forEach(async (item, i) => {
                // sleep(100)
                superagent('GET', item).retry(10).timeout({
                    response: 5000,  // Wait 5 seconds for the server to start sending,
                    deadline: 60000, // but allow 1 minute for the file to finish loading.
                  }).then(res => {
                    if(res){
                    $ = cheerio.load(res.text)
                    let paper = $('.newsTex')
                    // 标题
                    let title = $(paper).find('.neirong').text().trim()
                    if(title.indexOf("更正")!==-1||title.indexOf("更改")!==-1||title.indexOf("补充")!==-1||title.indexOf("澄清")!==-1||title.indexOf("暂停")!==-1){
                        return;
                    }
                    let paperText = $(paper).find('.newsCon').text().trim()
                    // // 摘要
                    // let abstract = $(paper).find('.summary').text().trim().replace("摘要: ", "")
                    // // 文章信息
                    // let detail = $(paper).find('.msgbar').text().trim()
                    // let aRegex = /\d+\W?\d+\W?\d+\W?\d+\W?\d+\W?\d+/
                    // let dateTime = detail.match(aRegex)[0]
                    // // 文章主体
                    // let paperBody = ''
                    // // 项目预算
                    // let budget
                    // // 项目编号
                    // let serialNum = ''
                    // // 采购人
                    // let people = ''
                    // // 采购代理机构
                    // let company = ''
                    // // 附件链接
                    // let attachment = $(paper).find('.t1', '.newsCon').attr('href')
                    // let deadline = ''
                    // let address = ''
                    // let flag1 = 0
                    // let flag2 = 0
                    // let flag3 = 0
                    // let count = 0
                    // $(paper).find('p', '.newsCon').each((i, item) => {
                    //     if($(item).text().trim()!==""){
                    //         count++
                    //     }
                    //     paperBody+="<p>"
                    //     paperBody += $(item).text();
                    //     paperBody += "</p>"
                    //     if($(item).text().indexOf('编号') !== -1){
                    //         let regex = /编号：\S+\s?[0-9a-z]$/g
                    //         if($(item).text().match(regex) != null)
                    //         {
                    //             serialNum = $(item).text().match(regex)[0].replace("编号：", "")
                    //         }
                    //         else{
                    //             regex = /编号：\S+\s?[0-9a-z]/g
                    //             if($(item).text().match(regex) != null)
                    //             {
                    //                 serialNum = $(item).text().match(regex)[0].replace("编号：", "")
                    //             }
                    //         }
                    //     }
                    //     //预算金额
                    //     if(count < 15 && $(item).text().indexOf('预算') !== -1){
                    //         let regex = /\d+[^\u4e00-\u9fa5]+\d+元$/
                    //         let regex11 = /\d+[^\u4e00-\u9fa5]+元/
                    //         let regex2 = /\d+[^\u4e00-\u9fa5]+\d+万元$/
                    //         let regex22 = /\d+[^\u4e00-\u9fa5]+\d?万元/
                    //         let regex3 = /\d+[^\u4e00-\u9fa5]+\d$/
                    //         if($(item).text().match(regex) !== null)
                    //         {
                    //             budget = $(item).text().match(regex)[0]  
                    //         }
                    //         else if(($(item).text().match(regex2) !== null)){
                    //             budget = $(item).text().match(regex2)[0]
                    //         }
                    //         else if(($(item).text().match(regex11) !== null)){
                    //             budget = $(item).text().match(regex11)[0]  
                    //         }
                    //         else if(($(item).text().match(regex22) !== null)){
                    //             budget = $(item).text().match(regex22)[0]
                    //         }
                    //         else if(($(item).text().match(regex3) !== null)){
                    //             budget = $(item).text().match(regex3)[0]
                    //         }
                    //     }
                    // })
                    // paperBody.replace(/<p\W?<\W?p\W?<p\W?<\W?p\W?/g, "<p></p>")
                    title = escape(title)
                    abstract = escape(abstract)
                    paperBody = escape(paperBody)
                    budget = escape(budget)
                    serialNum = escape(serialNum)
                    dateTime = escape(dateTime)
                    people = escape(people)
                    company = escape(company)
                    attachment = escape(attachment)
                    address = escape(address)
                    deadline = escape(deadline)
                    let sql2 = `SELECT id FROM articles WHERE title = ${title}`
                    // exec(sql2).then(data => {
                    //     if(!data[0]){
                    //         //写入数据库
                    //     let sql = `INSERT INTO articles (title, abstract, dateTime, body, budget, serialNum, people, attachment, area, deadline, address)VALUES
                    //     (${title}, ${abstract}, ${dateTime}, ${paperBody}, ${budget}, ${serialNum}, ${people}, ${attachment}, '${t}', ${deadline}, ${address})`
                    //     exec(sql).then(res=>{
                    //         console.log('写入成功')
                    //     }).catch(err=>{
                    //         console.log(err)
                    //     })
                    //      }
                    //     else{
                    //         console.log('已存在跳过')
                    //         console.log('-------------------------------------------------')
                    //     }
                    // }).catch(err=>{
                    //     console.log(err)
                    // })
                }
                    }, err => {
                        console.log(err.timeout)
                    })
                })
                resolve();  
                }
            });
        }catch(err){
            console.log(err)
        }
    })
}
async function test(){
    const area = ['市直', '蓬江区', '江海区', '新会区', '鹤山市', '开平市', '恩平市', '台山市']
    const links = ['http://zyjy.jiangmen.cn/szqzccggg/', 'http://zyjy.jiangmen.cn/pjqzccggg/',
        'http://zyjy.jiangmen.cn/jhqzccggg/', 'http://zyjy.jiangmen.cn/xhqzccggg/', 'http://zyjy.jiangmen.cn/hsszccggg/',
        'http://zyjy.jiangmen.cn/kpszccggg/', 'http://zyjy.jiangmen.cn/epszccggg/', 'http://zyjy.jiangmen.cn/tsszccggg/'
    ]
    // 市直
    for(let i = 1;i < 224;i++){
        if(i == 1){
            url = links[0] + 'index.htm'
        }
        else{
            url = links[0] + 'index_' + i + '.htm'
        }
        await get(url, area[0])
    }
    // 蓬江区
    for(let i = 1;i < 23;i++){
        if(i == 1){
            url = links[1] + 'index.htm'
        }
        else{
            url = links[1] + 'index_' + i + '.htm'
        }
        await get(url, area[1])
    }
    // 江海区
    for(let i = 1;i < 11;i++){
        if(i == 1){
            url = links[2] + 'index.htm'
        }
        else{
            url = links[2] + 'index_' + i + '.htm'
        }
        await get(url, area[2])
    }
    // 新会区
    for(let i = 1;i < 69;i++){
        if(i == 1){
            url = links[3] + 'index.htm'
        }
        else{
            url = links[3] + 'index_' + i + '.htm'
        }
        await get(url, area[3])
    }
    // 鹤山区
    for(let i = 1;i < 34;i++){
        if(i == 1){
            url = links[4] + 'index.htm'
        }
        else{
            url = links[4] + 'index_' + i + '.htm'
        }
        await get(url, area[4])
    }
    // 开平市
    for(let i = 1;i < 40;i++){
        if(i == 1){
            url = links[5] + 'index.htm'
        }
        else{
            url = links[5] + 'index_' + i + '.htm'
        }
        await get(url, area[5])
    }
    // 恩平市
    for(let i = 1;i < 39;i++){
        if(i == 1){
            url = links[6] + 'index.htm'
        }
        else{
            url = links[6] + 'index_' + i + '.htm'
        }
        await get(url, area[6])
    }
    // 台山市
    for(let i = 1;i < 33;i++){
        if(i == 1){
            url = links[7] + 'index.htm'
        }
        else{
            url = links[7] + 'index_' + i + '.htm'
        }
        await get(url, area[7])
    }
}
// 开始爬取
// const  scheduleCronstyle = ()=>{
//   //每30分定时执行一次:
//     schedule.scheduleJob('30 30 * * * *',()=>{
//         test()
//     }); 
// }


//scheduleCronstyle();
test()
// 休眠函数
var sleep = function(time) {
    var startTime = new Date().getTime() + parseInt(time, 10);
    while(new Date().getTime() < startTime) {}
};