const Menu = require('../../mongoose/menu')
const { formatSortJson } = require('../../util/util')

// 获取树形菜单数据
function getMenus (req) {
  const select = {
    created: 0,
    updated: 0,
    auths: 0
  }
  const { sort, parent, ...filter } = req.body
  const options = {
    sort: formatSortJson(sort),
    stopAuthPopulate: true
  }
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

// 更新菜单
function updateMenu (req) {
  const { id, ...rest } = req.body
  return Menu.findById(id).lean().then(updateMenu).then(updateParent).then(() => ({
    code: '0'
  })).catch((error) => ({
    error,
    code: 'N_000010'
  }))

  function updateMenu (menu) {
    const options = {
      new: true,
      runValidators: true
    }
    if (menu) {
      return Menu.findByIdAndUpdate(menu._id, rest, options).then(newMenu => ({
        old: menu,
        fresh: newMenu
      }))
    }
    return Promise.reject(new Error('菜单ID不存在'))
  }

  function updateParent ({ old, fresh }) {
    const addChildren = { $addToSet: { children: fresh._id } }
    const removeChildren = { $pull: { children: fresh._id } }
    if (String(old.parent) !== String(fresh.parent)) {
      if (old.parent && fresh.parent) {
        return Promise.all([
          Menu.findByIdAndUpdate(fresh.parent, addChildren),
          Menu.findByIdAndUpdate(old.parent, removeChildren)
        ])
      } else if (fresh.parent) {
        return Menu.findByIdAndUpdate(fresh.parent, addChildren)
      } else if (old.parent) {
        return Menu.findByIdAndUpdate(old.parent, removeChildren)
      }
    }
  }
}

// 删除菜单
function removeMenu (req) {
  const { id } = req.body
  return Menu.findByIdAndRemove(id).then(() => ({
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
