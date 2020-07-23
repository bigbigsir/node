const nodemailer = require('nodemailer') // 引入模块
const transporter = nodemailer.createTransport({
  // node_modules/nodemailer/lib/well-known/services.json  查看相关的配置，如果使用qq邮箱，就查看qq邮箱的相关配置
  service: 'qq',
  port: 465,
  secure: true,
  auth: {
    user: '519628061@qq.com', // 发送方的邮箱
    pass: 'qzqjnltrsfymbiad' // smtp 的授权码
  }
})
// pass 不是邮箱账户的密码而是stmp的授权码（必须是相应邮箱的stmp授权码）
// 邮箱---设置--账户--POP3/SMTP服务---开启---获取stmp授权码

function sendMail (mail, code) {
  // 发送的配置项
  const mailOptions = {
    from: 'Sender Name <519628061@qq.com>', // 发送方
    to: mail, // 接收者邮箱，多个邮箱用逗号间隔
    subject: '欢迎来到"Express-demo"', // 标题
    text: 'Hello world?' + code, // 文本内容
    html: `<p style="text-align: center;">注册验证码：${code}</p>`
    // attachments: [
    //   { // 发送文件
    //     filename: 'index.html', // 文件名字
    //     path: './index.html' // 文件路径
    //   },
    //   {
    //     filename: 'sendEmail.js', // 文件名字
    //     content: 'sendEmail.js' // 文件路径
    //   }
    // ]
  }

  // 发送函数
  return transporter.sendMail(mailOptions)
}

//
// sendMail('228712612@qq.com', '404').then(e => {
//   console.log(e)
// }).catch(e => {
//   console.log(e)
// })
module.exports = {
  sendMail
}
