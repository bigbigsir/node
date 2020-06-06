/**
 * @description 错误码对象，统一定义管理错误码，剔除业务中定义
 * message 返回给前端的信息
 * description 错误码释义，不做任何返回，以及处理
 * */
const code = {
  0: { // 请求处理成功
    code: '0',
    message: '操作成功'
  },
  N_000001: { // 代码或系统级别错误
    code: 'N_000001',
    message: '系统繁忙'
  },
  N_000002: { // 登录验证不通过
    code: 'N_000002',
    message: '账户或密码不正确，请重新输入'
  },
  N_000003: { // 数据中的token，超过时间已自动删除
    code: 'N_000003',
    message: '长时间未操作，请重新登录'
  },
  N_000004: { // token数据已标记为失效
    code: 'N_000004',
    message: 'token无效，请重新登录'
  },
  N_000005: {
    code: 'N_000005',
    message: '图形验证码不正确'
  },
  N_000006: {
    code: 'N_000006',
    message: '图形验证码已过期'
  }
}

module.exports = code
