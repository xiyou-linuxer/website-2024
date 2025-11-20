---
titleTemplate: :title - Xiyou Linux Group
layout: home

hero:
  name: 西邮Linux兴趣小组
  text: <small>Free Open Share</small>
  tagline:
  image:
    src: /logo2023_compressed.webp
    alt: 西邮 Linux 兴趣小组 Logo 2023
  actions:
    - theme: brand
      text: 介绍
      link: /info/
    - theme: alt
      text: 成员
      link: /info/member
    - theme: alt
      text: 加入我们
      link: /info/join
features:
  - icon: <i class="fa-solid fa-blog"></i>
    title: 群博 Blog
    details: 西邮 Linux 兴趣小组历届成员博客集合，由 Nitro 强力驱动。
    link: blog
    linkText: 查看
  - icon: <i class="fa-solid fa-list-check"></i>
    title: 培养 Plan
    details: 培养计划，已开源并部署到网站，尽情探索研究吧！
    link: https://plan.xiyoulinux.com/
    linkText: 探索
  - icon: <i class="fa-solid fa-book-bookmark"></i>
    title: 西邮 Wiki
    details: 纯公益的非官方校园生活百科，欢迎阅读、贡献。
    link: https://wiki.cooo.site/
    linkText: 阅读
  - icon: <i class="fa-solid fa-compass"></i>
    title: CO 导航
    details: 更适合西邮宝宝体质的网址导航，学习网站、签到缴费，应有尽有。
    link: https://www.cooo.site/
    linkText: 访问
---

<script setup>
import { data } from "@/data/archive.data"
const posts = data.filter(post => post.frontmatter.title)
</script>

## 最近更新

<ul>
  <li v-for="post of posts">
    <a :href="post.url">{{ post.frontmatter.title }}</a>
  </li>
</ul>

<style>
.VPHomeHero .comm-group {
  margin: 1em auto 0;
  font-size: 1.2em;
}

@media (min-width: 960px) {
  .VPHomeHero .comm-group{
    margin-inline: 0;
  }
}
</style>
