const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');

const str = `<div class="tablecont">
<table width="100%" cellspacing="0" cellpadding="0">
  <thead>
      <tr height="30" align="center" valign="middle" style="background-color:#f7f7f7;">
        <td style="border-top:none;width:250px;">询价单号</td>
        <td style="border-top:none;width:400px;">标题</td>
        <td style="border-top:none;width:130px;">生成时间</td>
        <td style="border-top:none;width:160px;">操作</td>
      </tr>
  </thead>
  <tbody>
      
      
      
          
              <tr height="50" align="center" valign="middle">
                  <td>
                      <a href="http://www.eshop.unicom.local:8080/eshop/recruitmentInquiry/detail.do?id=0ed60c0e-1535-4b24-91cc-b832317bb0e2&amp;shopCode=gdjm" target="_blank">INQUIRY-gd-20051517083244951</a>
                  </td>
                  <td>
                      <a href="http://www.eshop.unicom.local:8080/eshop/recruitmentInquiry/detail.do?id=0ed60c0e-1535-4b24-91cc-b832317bb0e2&amp;shopCode=gdjm" target="_blank">开平广播电视台楼盘线缆敷设服务项目</a>
                  </td>
                  <td>
                      2020-05-15
                  </td>
                  <td>
                     <a href="javascript:void(0);" id="archiveBtn_0ed60c0e-1535-4b24-91cc-b832317bb0e2" onclick="inquiryArchiveMakeDraft('0ed60c0e-1535-4b24-91cc-b832317bb0e2','0')" style="text-decoration:underline;color:red;">归档</a>
                  </td>
              </tr>
          
              <tr height="50" align="center" valign="middle">
                  <td>
                      <a href="http://www.eshop.unicom.local:8080/eshop/recruitmentInquiry/detail.do?id=d1784587-906d-4a21-af3d-860e3f0382b4&amp;shopCode=gdjm" target="_blank">INQUIRY-gd-20051410192694834</a>
                  </td>
                  <td>
                      <a href="http://www.eshop.unicom.local:8080/eshop/recruitmentInquiry/detail.do?id=d1784587-906d-4a21-af3d-860e3f0382b4&amp;shopCode=gdjm" target="_blank">凯旋汇光纤到户综合布线项目</a>
                  </td>
                  <td>
                      2020-05-14
                  </td>
                  <td>
                     <a href="javascript:void(0);" id="archiveBtn_d1784587-906d-4a21-af3d-860e3f0382b4" onclick="inquiryArchiveMakeDraft('d1784587-906d-4a21-af3d-860e3f0382b4','0')" style="text-decoration:underline;color:red;">归档</a>
                  </td>
              </tr>
          
      
    
  </tbody>
</table>
</div>`
let flag = 0
let path = "C:\\Users\\83622\\Desktop\\项目归档\\"
$ = cheerio.load(str)
$('a[target=_blank]', '.tablecont').each((i, item) => {
    if(flag === 1){
        let directory = path + $(item).text()
        if(!fs.existsSync(directory)){
            fs.mkdirSync(directory)
        }
        flag = 0
    }
    else{
        flag = 1
    }
})