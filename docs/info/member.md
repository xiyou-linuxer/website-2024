---
aside: false
---

<script setup>
import MemberList from '/.vitepress/components/MemberList.vue'
import members from '/.vitepress/data/members'
</script>

# 成员

<member-list :members="members" :from="1" />

## {{ members[0].grade }}成员

{{ members[0].grade }}成员在暑期考核后可能会发生变动，并负责主持下一届纳新。

<member-list :members="members" :from="0" :to="1" />

更新信息请参考 [<i class="fa-solid fa-book"></i>维护手册 - 成员列表组件](/manual/component/member-list)。
