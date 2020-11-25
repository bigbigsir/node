const Log = require('../../mongoose/log')

// 添加日志
function addLog (log) {
  new Log(log).save()
}

// 获取日志列表
function getLogList (req) {
  let { page, pageSize } = req.body
  const options = {
    sort: {
      created: -1
    }
  }
  const filter = { ...req.body }
  page = parseInt(page) || 1
  pageSize = parseInt(pageSize) || 10

  delete filter.page
  delete filter.pageSize
  delete filter.loginName

  return Promise.all([
    Log.count(filter),
    Log.find(filter, undefined, options).skip((page - 1) * pageSize).limit(pageSize)
  ]).then(([count, data]) => {
    return {
      code: '0',
      data: {
        page: page,
        pageSize: pageSize,
        total: count,
        maxPage: Math.ceil(count / pageSize),
        rows: data
      }
    }
  })
}

module.exports = {
  addLog,
  getLogList
}
