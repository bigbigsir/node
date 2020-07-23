const { EmailCode, exp } = require('../../mongoose/email_code')
const User = require('../../mongoose/user')
const { md5Encrypt } = require('../../util/util')
const { sendMail } = require('../../util/email')

// 获取注册邮箱验证码
function getEmailCode (req) {
  const { email } = req.body
  const random = Math.round(Math.random() * 28)
  const captcha = md5Encrypt(Date.now().toString())
  req.body.captcha = captcha.substring(random, random + 4)
  // 查找email是否被使用
  return User.findOne({ email }).then(user => {
    if (!user) {
      return new EmailCode(req.body).save().then((data) => {
        return sendMail(data.email, data.captcha).then(() => {
          return {
            code: '0',
            data: {
              exp,
              captchaId: data._id
            }
          }
        }).catch(error => ({
          error,
          code: 'N_000011'
        })) // 邮件发送失败
      }).catch((error) => ({
        error,
        code: 'N_000010'
      }))// Schema验证失败
    }
    return { code: 'N_000012' }
  })
}

// 验证图形验证码
function verifyEmailCode (req) {
  const { captchaId, email, captcha, emailType } = req.body
  return EmailCode.findOne({
    email,
    emailType,
    _id: captchaId
  }).then(data => {
    if (data) {
      if (data.captcha === captcha) {
        return Promise.resolve({ code: '0' })
      } else {
        return Promise.resolve({ code: 'N_000014' })
      }
    } else {
      return Promise.resolve({ code: 'N_000013' })
    }
  })
}

module.exports = {
  getEmailCode,
  verifyEmailCode
}
