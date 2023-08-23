// build：用于修改项目构建系统或外部依赖项的更新（例如 webpack、npm）。
// chore：用于对项目进行不涉及源代码和测试文件的其他修改。
// ci：用于对项目的持续集成和部署配置的更改（例如 Travis、Circle、BrowserStack）。
// docs：用于仅修改文档的更新。
// feat：用于添加新功能的提交。
// fix：用于修复错误的提交。
// perf：用于对性能进行更改的提交。
// refactor：用于既不修复错误也不添加功能的代码更改（例如重构变量名）。
// revert：用于撤销以前的提交的提交。
// style：用于仅更改样式而不影响功能的提交（例如空格、格式化、缺少分号等）。
// test：用于添加或修改测试用例的提交。
// translation：用于翻译更新的提交。
// security：用于安全性方面的改进，比如增加防御型编程。
// changeset：自定义的提交类型

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'translation',
        'security',
        'changeset',
      ],
    ],
  },
};
