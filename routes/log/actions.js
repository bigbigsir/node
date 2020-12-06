const Log = require('../../mongoose/log')
const { formatSortJson } = require('../../util/util')

// 添加日志
function addLog (log) {
  new Log(log).save().catch(e => {
    console.error('记录日志错误：\n', e)
  })
}

// 获取日志列表
function getLogList (req) {
  const select = {
    created: 0,
    updated: 0
  }
  let { sort, page, pageSize, ...filter } = req.body
  const options = {
    sort: formatSortJson(sort)
  }
  page = parseInt(page) || 1
  pageSize = parseInt(pageSize) || 10

  delete filter.loginName

  return Promise.all([
    Log.countDocuments(filter),
    Log.find(filter, select, options).skip((page - 1) * pageSize).limit(pageSize)
  ]).then(([count, data]) => {
    return {
      code: '0',
      data: {
        page,
        pageSize,
        rows: data,
        total: count,
        maxPage: Math.ceil(count / pageSize)
      }
    }
  })
}

// 删除日志
function removeLog (req) {
  const { id } = req.body
  return Log.findByIdAndRemove(id).then(() => {
    return { code: '0' }
  })
}

// 批量删除日志
function removeLogs (req) {
  const { ids } = req.body
  return Log.remove({ _id: { $in: ids } }).then(() => {
    return { code: '0' }
  })
}

module.exports = {
  addLog,
  removeLog,
  removeLogs,
  getLogList
}
