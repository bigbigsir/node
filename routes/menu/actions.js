const Menu = require('../../mongoose/menu')

// 注册，查找用户名是否注册=>保存新用户=>登录
function getMenus (req) {
  const options = {
    sort: {
      sort: 1
    }
  }
  const select = '-created -updated'
  const { name, path, parent } = req.body
  const filter = {
    parent
  }
  name && (filter.name = name)
  path && (filter.path = path)
  return Menu.find(filter, select, options).then(data => {
    return {
      code: '0',
      data
    }
  })
}

function addMenu (req) {
  const body = req.body
  const menu = new Menu(body)
  return menu.save().then(data => {
    const update = { $addToSet: { children: data._id } }
    if (data.parent) {
      return Menu.findByIdAndUpdate(data.parent, update).then(() => ({
        code: '0'
      }))
    }
    return {
      code: '0'
    }
  }).catch((error) => ({
    error,
    code: 'N_000010'
  }))
}

function updateMenu (req) {
  const { id, ...rest } = req.body
  return Menu.findById(id).lean().then(data => {
    if (data) {
      return Menu.findByIdAndUpdate(id, rest, { new: true }).then(newData => ({
        o: data,
        n: newData
      }))
    }
    throw new Error('N_000010')
  }).then(({ o, n }) => {
    const removeChildren = { $pull: { children: n._id } }
    const addChildren = { $addToSet: { children: n._id } }
    if (String(o.parent) !== String(n.parent)) {
      if (o.parent && n.parent) {
        return Promise.all([
          Menu.findByIdAndUpdate(n.parent, addChildren),
          Menu.findByIdAndUpdate(o.parent, removeChildren)
        ])
      } else if (o.parent) {
        return Menu.findByIdAndUpdate(o.parent, removeChildren)
      } else if (n.parent) {
        return Menu.findByIdAndUpdate(n.parent, addChildren)
      }
    }
    return { code: '0' }
  }).then(() => ({
    code: '0'
  })).catch((error) => ({
    error,
    code: 'N_000010'
  }))
}

function removeMenu (req) {
  const { id } = req.body
  return Menu.findByIdAndRemove(id).then(data => ({
    code: '0'
  })).catch((error) => ({
    error,
    code: 'N_000010'
  }))
}

module.exports = {
  addMenu,
  getMenus,
  removeMenu,
  updateMenu
}
