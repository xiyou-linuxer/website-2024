<script setup>
  const curYear = new Date().getFullYear()
</script>

# 成员列表组件

::: tip
你可以参考 VitePress 官方文档的 [在 Markdown 使用 Vue](https://vitepress.dev/zh/guide/using-vue) 一节。
:::

1. `docs/info/member.md`: 这是一个 Markdown 文件，用于显示成员信息页面。
2. `docs/.vitepress/components/MemberList.vue`: 这是一个 Vue 组件，用于渲染成员列表信息。
3. `docs/.vitepress/components/MemberCard.vue`: 这是一个 Vue 组件，用于渲染成员卡片信息。
4. `docs/.vitepress/data/members.ts`: 这是一个 TS 文件，用于定义成员信息的数据。

## 编辑成员信息页面

要编写或修改成员信息页面 (`docs/info/member.md`)，可以按照以下步骤进行操作：

1. 打开 `docs/info/member.md` 文件。
2. 在该文件中，可以看到各个年级的成员信息。
3. 可以按照现有的格式，使用 Markdown 语法编写或修改成员信息。
   - 文件头部应当引入成员信息的 Vue 组件和 TS 文件：
     ```vue
     <script setup>
     import MemberList from '/.vitepress/components/MemberList.vue'
     import members from '/.vitepress/data/members'
     </script>
     ```
   - 将数据传入组件：
     ```vue
     <member-list :members="members" />
     ```
4. 修改完成后保存文件。

## 编辑成员信息

::: tip
如果没有权限修改文档，可以联系现任负责人更新信息。
:::

成员信息应当从在线文档中修改，其中也编写好了用于生成代码的单元格函数，应该类似这样：

```excel
// Excel 语法
// 将某一行中的成员转换为 JavaScript 对象代码
="{name:'"&A3&"',title:'"&C3&"',"&IF(E3="","qq:'"&D3,"github:'"&E3)&"',linkText:'"&F3&"',link:'"&G3&"'},"

// 汇总指定年级的结果，A3为要汇总的年级，成员信息表B列为年级，H列为每一个成员的对象代码
="{grade:'"&A3&"级',members:["&CHAR(10)&TEXTJOIN(CHAR(10),TRUE,FILTER(成员信息!H:H,成员信息!B:B=A3))&CHAR(10)&"]},"
```

最终生成的表格如下：

| 年级          | 符合条件的值拼接                                                                     |
| ------------- | ------------------------------------------------------------------------------------ |
| [代码前缀]    | export default [                                                                     |
| {{curYear}}   | { grade: '{{curYear}}', members: [ ... ]}, <Badge type="info" text="由公式生成" />   |
| {{curYear-1}} | { grade: '{{curYear-1}}', members: [ ... ]}, <Badge type="info" text="由公式生成" /> |
| ...           | ...                                                                                  |
| 2004          | { grade: '2004级', members: [ ... ]}, <Badge type="info" text="由公式生成" />        |
| [代码后缀]    | ];                                                                                   |

直接将第二列含有代码的单元格从上到下选中，复制粘贴到 `docs/.vitepress/data/members.ts` 中，保存文件。

### 成员信息数据结构

在 `docs/.vitepress/data/members.ts` 中，可以看到默认导出对象是一个对象数组，数组中的每个元素的 `grade` 属性代表 [年份] 年级，`members` 属性代表该年级的成员信息。

每个成员以对象的形式表示，包含以下属性：
- `name`: 姓名。
- `title`: 头衔（如`xx级负责人`）或备注（可选）。
- `qq`: 成员的 QQ 号（用于在 GitHub 头像显示失败时显示 QQ 头像）。
- `github`: 成员的 GitHub 用户名。
- `linkText`: 成员自定义的链接名称（可选，如`CSDN`、`独立博客`、`B站`）。
- `link`: 成员的自定义链接地址。
