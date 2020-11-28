const Menu = require('../../mongoose/menu')

// 获取树形菜单数据
function getMenus (req) {
  const select = {
    created: 0,
    updated: 0,
    auths: 0
  }
  const options = {
    sort: {
      sort: 1
    },
    stopAuthPopulate: true
  }
  const { parent, ...filter } = req.body
  filter.parent = parent
  delete filter.loginName
  return Menu.find(filter, select, options).then(data => {
    return {
      code: '0',
      data
    }
  })
}

// 获取树形菜单数据和权限
function getMenusAndAuths () {
  const filter = { parent: undefined }
  const select = {
    created: 0,
    updated: 0
  }
  const options = {
    sort: {
      sort: 1
    }
  }

  return Menu.find(filter, select, options).then(data => {
    return {
      code: '0',
      data: recursion(JSON.parse(JSON.stringify(data)))
    }

    function recursion (menus) {
      return menus.map(item => {
        return {
          ...item,
          auths: undefined,
          children: [...recursion(item.children), ...item.auths]
        }
      })
    }
  })
}

// 添加菜单
function addMenu (req) {
  const body = req.body
  const menu = new Menu(body)
  return menu.save().then(data => {
    const hasParent = data.parent
    const update = { $addToSet: { children: data._id } }
    if (hasParent) return Menu.findByIdAndUpdate(data.parent, update)
  }).then(() => ({
    code: '0'
  })).catch((error) => ({
    error,
    code: 'N_000010'
  }))
}

// 更新菜单（待优化）
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

// 删除菜单
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
  updateMenu,
  getMenusAndAuths
}
