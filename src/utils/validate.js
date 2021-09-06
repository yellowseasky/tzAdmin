
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  // Test001管理员，WX001供应商
  const valid_map = ['WX001', '001', 'WX243', 'Test001']
  return valid_map.indexOf(str.trim()) >= 0
}
