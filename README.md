# 西邮 Linux 兴趣小组官网

2024年3月14日立项，采用 VitePress 构建，由 `@纸鹿` 和现任负责人维护。

## 项目介绍与周边

本项目与以下几个项目紧密协作：

- 腾讯文档的成员列表：内部文档，由 `@纸鹿` 和现任负责人维护表格，通过 Excel 函数自动生成 JSON 文件，再手动更新到本仓库。
- [xiyou-linuxer/blog-feed](https://github.com/xiyou-linuxer/blog-feed)：本网站“群博 Blog”文章列表使用的 API 源，由 `@纸鹿` 维护。这个项目会自动获取本仓库的 [`/docs/.vitepress/data/members.json`](/docs/.vitepress/data/members.json) 成员列表，爬取列表中涉及的订阅源，并以 JSON API / OPML / RSS 的方式提供文章列表。
- [xupt-wiki/xupt-wiki](https://github.com/xupt-wiki/xupt-wiki)：西邮 Wiki，由校内多个实验室的成员、热心学子共同编写，由 `@纸鹿` 维护。
- [xupt-wiki/xupt-nav](https://github.com/xupt-wiki/xupt-nav)：西邮网址导航，非常简易的前端实现，由 `@纸鹿` 维护。

## 维护信息

- [维护手册网页](https://xiyoulinux.com/manual/)，仓库内维护文档在 [`/docs/manual/`](/docs/manual/) 文件夹下。
- [更新日志网页](https://xiyoulinux.com/changelog.html)，仓库内更新日志在 [`/docs/changelog.md`](/docs/changelog)
- 欢迎提交 PR，请先阅读维护手册。
