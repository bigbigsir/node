const nodemailer = require('nodemailer') // 引入模块
// node_modules/nodemailer/lib/well-known/services.json
// 查看相关的配置，如果使用qq邮箱，就查看qq邮箱的相关配置
// pass 不是邮箱账户的密码而是stmp的授权码（必须是相应邮箱的stmp授权码）
// 邮箱---设置--账户--POP3/SMTP服务---开启---获取stmp授权码
const transporter = nodemailer.createTransport({
  service: 'qq',
  port: 465,
  secure: true,
  auth: {
    user: 'www.60kg.top@qq.com', // 发送方的邮箱
    pass: 'qzqjnltrsfymbiad' // smtp 的授权码
  }
})

function sendMail (mail, code) {
  // 发送的配置项
  const mailOptions = {
    from: '60KG Admin <www.60kg.top@qq.com>', // 发送方
    to: mail, // 接收者邮箱，多个邮箱用逗号间隔
    subject: '验证消息', // 标题
    text: '验证码：' + code, // 文本内容
    html: `<p style="text-align: center;">验证码：${code}</p>`
    // 发送附件
    // attachments: [
    //   {
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

// 测试发送
// sendMail('228712612@qq.com', '404044').then(e => {
//   console.log(e)
// }).catch(e => {
//   console.log(e)
// })
module.exports = {
  sendMail
}
