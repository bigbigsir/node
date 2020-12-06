const Message = require('../../mongoose/message')
const { formatSortJson } = require('../../util/util')

// 添加消息
function addMessage (req) {
  const { loginName, ...body } = req.body
  body.creator = loginName
  return new Message(body).save().then(data => {
    return {
      code: '0',
      data
    }
  }).catch((error) => ({
    error,
    code: 'N_000010'
  }))
}

// 更新消息
function updateMessage (req) {
  const { id } = req.body
  const ops = {
    new: true,
    runValidators: true
  }
  return Message.findByIdAndUpdate(id, req.body, ops).then(() => {
    return { code: '0' }
  })
}

// 删除消息
function removeMessage (req) {
  const { id } = req.body
  return Message.findByIdAndRemove(id).then(() => {
    return { code: '0' }
  })
}

// 获取消息列表
function getMessageList (req) {
  let { sort, page, pageSize, zhCN, zhTW, enUS, ...filter } = req.body
  const options = {
    sort: formatSortJson(sort)
  }

  page = parseInt(page) || 1
  pageSize = parseInt(pageSize) || 10

  zhCN && (filter.zhCN = { $regex: zhCN })
  zhTW && (filter.zhTW = { $regex: zhTW })
  enUS && (filter.enUS = { $regex: enUS })
  delete filter.loginName

  return Promise.all([
    Message.countDocuments(filter),
    Message.find(filter, undefined, options).skip((page - 1) * pageSize).limit(pageSize)
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

// 获取单条消息
function getMessage (code) {
  return Message.findOne({ code })
}

module.exports = {
  getMessage,
  addMessage,
  updateMessage,
  removeMessage,
  getMessageList
}
