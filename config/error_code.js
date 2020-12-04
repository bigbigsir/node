/**
 * @description 错误码对象，统一定义管理错误码，剔除业务中定义
 * message 返回给前端的信息
 * description 错误码释义，不做任何返回，以及处理
 * */
const code = {
  0: { // 请求处理成功
    code: 'N_000000',
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
  // 数据中的token，超过时间已自动删除
  N_000003: {
    code: 'N_000003',
    message: '长时间未操作，请重新登录'
  },
  // token数据已标记为失效
  N_000004: {
    code: 'N_000004',
    message: '登录失效，请重新登录'
  },
  N_000005: {
    code: 'N_000005',
    message: '图形验证码不正确'
  },
  N_000006: {
    code: 'N_000006',
    message: '图形验证码已失效'
  },
  N_000007: {
    code: 'N_000007',
    message: 'webHooks验证不通过'
  },
  N_000008: {
    code: 'N_000008',
    message: 'webHooks子进程错误'
  },
  // 注册，用户名已存在
  N_000009: {
    code: 'N_000009',
    message: '用户名已注册'
  },
  // Schema字段验证失败
  N_000010: {
    code: 'N_000010',
    message: '请求数据不符合规范，请检查后重试'
  },
  // 发送邮件失败
  N_000011: {
    code: 'N_000011',
    message: '验证码发送失败'
  },
  // 邮箱被注册
  N_000012: {
    code: 'N_000012',
    message: '邮箱已注册'
  },
  N_000013: {
    code: 'N_000013',
    message: '邮箱验证码已失效'
  },
  N_000014: {
    code: 'N_000014',
    message: '邮箱验证码不正确'
  },
  N_000015: {
    code: 'N_000015',
    message: 'Token已失效，请重新获取'
  },
  N_000016: {
    code: 'N_000016',
    message: '没有此用户'
  },
  N_000017: {
    code: 'N_000017',
    message: '编译项目不存在'
  },
  // 权限key已存在
  N_000018: {
    code: 'N_000018',
    message: '权限标识已存在'
  },
  // 权限key已存在
  N_000019: {
    code: 'N_000019',
    message: '此用户已被禁用，请联系管理员'
  }
}

module.exports = code
