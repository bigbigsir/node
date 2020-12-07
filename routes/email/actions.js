const { EmailCode, exp } = require('../../mongoose/email_code')
const { random } = require('../../util/util')
const { sendMail } = require('../../util/email')

// 获取注册邮箱验证码
function getEmailCode (req) {
  req.body.captcha = random()
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

// 验证邮箱验证码
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
