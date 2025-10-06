# 资料存档

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

## 内部资料

- [维护手册](/manual/)
- [更新日志](/changelog)
- [生活指南](/life/)
