<script setup>
const curYear = new Date().getFullYear()
</script>

# 成员列表组件

::: tip
你可以参考 VitePress 官方文档的 [在 Markdown 使用 Vue](https://vitepress.dev/zh/guide/using-vue) 一节。
:::

1. `docs/info/member.md`: 成员信息页面。
2. `docs/.vitepress/components/MemberList.vue`: 成员列表 Vue 组件。
3. `docs/.vitepress/components/MemberCard.vue`: 成员卡片 Vue 组件。
4. `docs/.vitepress/data/members.json`: 成员数据。

## 编辑成员数据

::: tip
如果没有权限修改文档，可以联系现任负责人更新信息。
:::

成员信息**应当从在线文档而非 JSON 中修改**，其中也编写好了用于生成代码的单元格函数，应该类似这样：

```c
// Excel 语法
// 将某一行中的成员转换为 JSON 代码
="{ ""name"": """&$A3&""", ""grade"": """&$B3&""", ""title"": """&$C3&""", "&IF($E3="","""qq"": """&$D3,"""github"": """&$E3)&""", ""linkText"": """&$F3&""", ""link"": """&$G3&""", ""feed"": """&$H3&""" }"

// 汇总指定年级的结果，A3为要汇总的年级，成员信息表B列为年级，H列为每一个成员的对象代码
=TEXTJOIN(CHAR(10),TRUE,FILTER(成员信息!I:I,成员信息!B:B=A3)&",")
```

> 注：当填写了 GitHub 信息后，不会导出 QQ 号。

最终生成的表格如下：

| 年级          | 符合条件的值拼接                                                                    |
| ------------- | ----------------------------------------------------------------------------------- |
| [代码前缀]    | [                                                                                   |
| {{curYear}}   | { "name": "x", "grade": "{{curYear}}", <Badge type="info" text="由公式生成" /> },   |
| {{curYear-1}} | { "name": "x", "grade": "{{curYear-1}}", <Badge type="info" text="由公式生成" /> }, |
| ...           | ...                                                                                 |
| 2004          | { "name": "x", "grade": "2004", <Badge type="info" text="由公式生成" /> },          |
| [代码后缀]    | ]                                                                                   |

直接将第二列含有代码的单元格从上到下选中，复制粘贴到 JSON 中保存即可。

### 成员信息数据结构

> 注：为方便订阅源抓取，已经换成更扁平的数据结构。

```ts
export interface Member {
    name: string
    grade: string
    title: string
    qq?: string
    github?: string
    linkText: string
    link: string
    feed: string
}
```

在 `docs/.vitepress/data/members.ts` 中，可以看到默认导出对象是一个对象数组，数组中的每个元素的 `grade` 属性代表 [年份] 年级，`members` 属性代表该年级的成员信息。

每个成员以对象的形式表示，包含以下属性：

- `name`: 姓名。
- `title`: 头衔（如`xx级负责人`）或备注。
- `qq`: 成员的 QQ 号（用于在 GitHub 头像显示失败时显示 QQ 头像）。
- `github`: 成员的 GitHub 用户名，具有此项时不会导出 QQ 号。
- `linkText`: 成员自定义的链接名称（如`CSDN`、`独立博客`、`B站`）。
- `link`: 成员的自定义链接地址。
- `feed`: 成员的 Atom/RSS 订阅地址。

这些都是可选项，但接口类型为何要求这些属性都有值呢？因为在成员 JSON 文件中，**即使没有填写，也会导出为空字符串**。在开发时需要注意。
