/**
 * lint-staged — pre-commit 钩子规则（CLAUDE.md §7.3）
 */
module.exports = {
  '*.{ts,tsx}': ['prettier --write', 'oxlint'],
  '*.{js,cjs,mjs}': ['prettier --write'],
  '*.{json,md,css}': ['prettier --write'],
};
