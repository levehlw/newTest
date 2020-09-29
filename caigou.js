const superagent = require('superagent');
//const {exec, escape} = require('./mysql')
const cheerio = require('cheerio');
const fs = require('fs');
const schedule = require('node-schedule');
let url = ''
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
                        let serialNum = ''
                        let budget = ''
                        let customerName = ''
                        $ = cheerio.load(res.text)
                        let paper = $('.newsTex')
                        // 标题
                        let title = $(paper).find('.neirong').text().trim()
                        if(title.indexOf("更正")!==-1||title.indexOf("更改")!==-1||title.indexOf("补充")!==-1||title.indexOf("澄清")!==-1||title.indexOf("暂停")!==-1){
                            return;
                        }
                        let paperText = $(paper).find('.newsCon').text().trim()
                        paperText = paperText.replace(/[¥，。：,）（》；《“”/、]/g, "")
                        paperText = paperText.replace(/\s/g,"")
                        //查找项目编号
                        if(paperText.match(/编号[^\u4e00-\u9fa5]+/) != null)
                        {
                            serialNum = paperText.match(/编号[^\u4e00-\u9fa5]+/)[0].replace('编号', '')
                        } 
                        // 特殊情况特殊处理
                        else if(paperText.match(/编号[\u4e00-\u9fa5]*[^\u4e00-\u9fa5]+/) != null){
                            let serialNumTemp = paperText.match(/编号[\u4e00-\u9fa5]*[^\u4e00-\u9fa5]+/)[0]
                            serialNum = serialNumTemp.match(/[^\u4e00-\u9fa5]+/)[0]
                        }
                        // 查找项目预算金额
                        if(paperText.match(/预算[\u4e00-\u9fa5]+[^\u4e00-\u9fa5]+[\u4e00-\u9fa5]?元?/) != null)
                        {
                            let tempBudget = paperText.match(/预算[\u4e00-\u9fa5]+[^\u4e00-\u9fa5]+[\u4e00-\u9fa5]?元?/)[0]
                            budget = tempBudget.match(/[^\u4e00-\u9fa5]+万?元?/)[0]
                        } 
                        // 特殊情况
                        else if(paperText.match(/\d+万元?/) != null){
                            budget = paperText.match(/\d+万元?/)[0]
                        }
                        // 联系信息
                        if(paperText.match(/联系\S+我要报名/) != null){
                            let detail = paperText.match(/联系\S+我要报名/)[0]
                            if(detail.match(/采购人(信息)?(名称)?[\u4e00-\u9fa5]+地址/) != null)
                                customerName = detail.match(/采购人(信息)?(名称)?[\u4e00-\u9fa5]+地址/)[0].replace(/采购人(信息)?(名称)?/, "").replace("地址", "")   
                            else if(detail.match(/联系人(信息)?(名称)?[\u4e00-\u9fa5]+(联系)?(地址)?/ != null)){
                                customerName = detail.match(/联系人(信息)?(名称)?[\u4e00-\u9fa5]+(联系)?(地址)?/)[0].replace(/\d{1}.联系人(信息)?(名称)?/, "").replace(/(联系)?(地址)?/g, "")
                            }                    
                        }
                        console.log(title, customerName)
                    }
                    }, err => {
                        console.log(err.timeout)
                    })
                })
                resolve();  
                }
            }).catch(err=>{
                console.log(err)
            })
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



test()
// 休眠函数
var sleep = function(time) {
    var startTime = new Date().getTime() + parseInt(time, 10);
    while(new Date().getTime() < startTime) {}
};