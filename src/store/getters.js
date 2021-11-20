const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.tagsView.visitedViews, // 参观过视图
  cachedViews: state => state.tagsView.cachedViews, // 已缓存视图
  token: state => state.user.token,
  roles: state => state.user.roles,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  permission_routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes
}
export default getters
