const svgCaptcha = require('svg-captcha')
const jwt = require('../../util/token')
const Captcha = require('../../mongoose/captcha')

const { getClientIp } = require('../../util/util')

// 获取token
function createWebToken (req) {
  const ip = getClientIp(req)
  const token = jwt.generateToken({ ip })
  return Promise.resolve({
    code: '0',
    data: token
  })
}

// 生成图片验证码
function createCaptcha () {
  // create 生成随机验证码，createMathExpr 生成数学公式
  const captcha = svgCaptcha.createMathExpr({
    noise: 2,
    width: 120,
    height: 50,
    fontSize: 50,
    ignoreChars: '0o1ilI'
  })
  const instance = new Captcha({
    captcha: captcha.text
  })
  return instance.save().then(data => {
    return {
      code: '0',
      data: {
        exp: 15,
        captchaId: data._id,
        image: captcha.data,
        captcha: captcha.text
      }
    }
  })
}

// 验证图形验证码
function verifyCaptcha (req) {
  const { captcha, captchaId } = req.body
  return Captcha.findById(captchaId).then(data => {
    if (data) {
      if (data.captcha === captcha) {
        return Promise.resolve({ code: '0' })
      } else {
        return Promise.resolve({ code: 'N_000005' })
      }
    } else {
      return Promise.resolve({ code: 'N_000006' })
    }
  })
}

module.exports = {
  createWebToken,
  createCaptcha,
  verifyCaptcha
}
