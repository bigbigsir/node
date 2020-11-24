const Log = require('../../mongoose/log')

// 添加日志
function addLog (log) {
  new Log({ log }).save()
}

// 获取日志列表
function getLogList (req) {
  let { page, pageSize, search } = req.body
  const options = {
    sort: {
      created: -1
    }
  }
  const filter = {
    log: { $regex: search }
  }
  !search && delete filter.log
  page = parseInt(page) || 1
  pageSize = parseInt(pageSize) || 10
  return Promise.all([
    Log.count(),
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
