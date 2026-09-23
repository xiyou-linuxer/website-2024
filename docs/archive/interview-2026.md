---
title: 西邮 Linux 兴趣小组 2026 纳新面试题
date: 2026-9-23 22:00:00
---

# {{ $frontmatter.title }}

> 学长寄语：长期以来，西邮 Linux 兴趣小组的面试题以难度之高名扬西邮校内。我们作为出题人也清楚的知道这份试题略有难度。**请你动手敲一敲代码**。别担心，若有同学能完成一半的题目，就已经十分优秀。其次，相比于题目的答案，我们对你的思路和过程更感兴趣，或许你的答案略有瑕疵，但你正确的思路和对知识的理解足以为你赢得绝大多数的分数。最后，做题的过程也是学习和成长的过程，相信本试题对你更加熟悉地掌握 C 语言一定有所帮助。祝你好运。我们东区逸夫楼 FZ103 见！

- 本题目只作为西邮 Linux 兴趣小组 2026 纳新面试的有限参考。
- 为节省版面，本试题的程序源码省去了 `#include` 指令和部分 `main` 函数的 `return 0;`。
- 本试题中的程序源码仅用于考察 C 语言基础，不应当作为 C 语言「代码风格」的范例。
- 所有题目编译并运行于 **x86_64 GNU/Linux** 环境。

## 0. 树懒闪电的二进制车牌

树懒闪电要办一张二进制车牌：16 个按钮里有四个连续按钮的数是 21、34、55、89，每个按钮最多按一次、不能按相邻的两个，按下数字之和即车牌号。

屏幕显示 `11010100101`，该按哪几个按钮？其十进制是多少？

> **提示：** 这 16 个数构成递推数列，每项等于前两项之和。

## 1. 一句印不完的欢迎词

这句欢迎词是永无止境的吗？请解释运行结果：`printf` 的返回值扮演了什么角色，`while` 是否真的停不下来？

```c
int main() {
    while (1) {
        printf("Hi! ");
        if (!printf("The 202%d, Welcome to Xiyou Linux Group!\n",
                    printf("guys! "))) {
            break;
        }
    }
}
```

## 2. 失忆的交换生

两位交换生都帮 `a` 和 `b` 换座位：第一位换完就忘，第二位却成功了。请解释运行结果：函数修改外部变量的必要条件是什么？

```c
void swap_val(int x, int y) {
    int tmp = x;
    x = y;
    y = tmp;
}

void swap_ptr(int *x, int *y) {
    int tmp = *x;
    *x = *y;
    *y = tmp;
}

int main() {
    int a = 10, b = 20;
    swap_val(a, b);
    printf("swap_val: a=%d, b=%d\n", a, b);
    swap_ptr(&a, &b);
    printf("swap_ptr: a=%d, b=%d\n", a, b);
}
```

## 3. `sizeof` 的视力表

请预测输出，并解释每个 `sizeof` 和 `strlen` 的结果：注意字符串中间的 `\0`、数组退化与指针类型。

```c
void inspect(char text[], int (*matrix)[4]) {
    printf("%zu %zu %zu %zu\n",
           sizeof(text), sizeof(matrix),
           sizeof(*matrix), strlen(text));
}

int main() {
    char a[] = "Linux\0Group";
    char *p = a;
    int b[2][4] = {{1, 2, 3, 4}, {5, 6, 7, 8}};

    printf("%zu %zu %zu\n",
           sizeof(a), sizeof(p), sizeof(a + 0));
    printf("%d %d\n", a[5] == '\0', strcmp(a, "Linux"));
    inspect(a, b);
}
```

## 4. XOR 密钥：藏在字节里的悄悄话

一串数字里藏着一句悄悄话。请解释代码如何用位运算把数字还原成字符：`mask` 怎么构造，为什么异或后恰好是原文？

```c
int main() {
    int nums[] = {167, 150, 134, 144, 138, 179, 150, 145,
                  138, 135, 184, 141, 144, 138, 143};
    int size = sizeof(nums) / sizeof(nums[0]);

    for (int i = 0; i < size; i++) {
        int mask = 0;
        int bitval = 1;
        int bits = 8;
        while (bits-- > 0) {
            mask | = bitval;
            bitval << = 1;
        }

        printf("%c", nums[i] ^ mask);
        if (i == size - 1) {
            printf("\n");
        }
    }
}
```

## 5. 宏召唤术：括号去哪儿了

这两个宏看着人畜无害，展开后却各有脾气。请写出四行 `printf` 的输出，并解释原因。

```c
#define SQUARE(x) x * x
#define MAX(a, b) ((a) > (b) ? (a) : (b))

int main() {
    int i = 3;
    printf("%d\n", SQUARE(i + 1));
    printf("%d\n", MAX(i, 5));
    printf("%d\n", MAX(i++, 5));
    printf("%d\n", i);
}
```

## 6. p 与 q 的步幅之争

`p` 和 `q` 指向同一个数组，“步幅”却大不相同。输出是什么？`p + 1` 和 `q + 1` 各跨过多少字节？

```c
int main() {
    int a[4] = {1, 2, 3, 4};
    int *p = a;
    int (*q)[4] = &a;

    printf("%td %td\n",
           (char *)(p + 1) - (char *)p,
           (char *)(q + 1) - (char *)q);
    printf("%d %d\n", *(p + 2), *(*q + 2));
}
```

## 7. 记性特别好的 x

这个 `x` 走遍千山万水仍记得来时的路。请预测每行输出，并解释 `static` 局部变量在递归中的行为。

```c
int visit(int n) {
    static int x = 0;
    if (n == 0)
        return x;

    x += n;
    printf("before %d %d\n", n, x);
    int result = visit(--n);
    printf("after %d %d %d\n", n, x, result);
    return x + result;
}

int main() {
    printf("first = %d\n", visit(3));
    printf("second = %d\n", visit(2));
}
```

## 8. 谁能动 const 大神的奶酪

一眼以为“const 就全不能动”，逐条判断却错一片。请判断九个操作是否合法，并说明原因。

```c
struct P { int x; const int y; };

int main() {
    struct P p1 = {11, 22}, p2 = {33, 44};
    const struct P p3 = {55, 66};
    struct P* const ptr1 = &p1;
    const struct P* ptr2 = &p2;
    const struct P* const ptr3 = &p3;

    ptr1->x = 111; ptr2->x = 333; ptr3->x = 555;
    ptr1->y = 222; ptr1 = &p2;    ptr2->y = 444;
    ptr2 = &p1;    ptr3->y = 666; ptr3 = &p1;
}
```

## 9. 当函数变成了数字

在这里，函数既能装进数组，也能被加减乘除。这段代码写得标准吗？注意 `INT_MIN` 和 `0xFFFFFFFF`。

```c
typedef int (*BinOp)(int, int);

int add(int a, int b) { return a + b; }
int sub(int a, int b) { return a - b; }
int mul(int a, int b) { return a * b; }

BinOp ops[3] = { add, sub, mul };

int (*get_op(char c))(int, int) {
    switch (c) {
        case '+': return add;
        case '-': return sub;
        default: return mul;
    }
}

int main() {
    printf("%d\n", get_op('*')(7, -2));
    printf("%d\n", ops[1](INT_MIN, 20));
    printf("%d\n", get_op('+')(0xFFFFFFFF, 2027));
}
```

## 10. 字节战队排排站：大端、小端与内存对齐

同一片内存，不同视角看到不同世界。请写出全部输出，并解释大端、小端与内存对齐的原理。

```c
struct data_box {
    int num;
    union {
        unsigned int u32_val;
        unsigned char bytes[4];
        char string[32];
    } un;
    short tag;
    long long magic;
    int buf[4];
};

int main() {
    int arr[] = {0x00000000, 0x6F796958, 0x694C2075,
                 0x2078756E, 0x756F7247, 0x00000070,
                 0x44556677, 0x8899aabb};

    printf("%s\n", ((struct data_box *)arr)->un.string);
    printf("byte0 = 0x%02X\n", ((struct data_box *)arr)->un.bytes[0]);
    printf("byte1 = 0x%02X\n", ((struct data_box *)arr)->un.bytes[1]);
    printf("byte2 = 0x%02X\n", ((struct data_box *)arr)->un.bytes[2]);
    printf("byte3 = 0x%02X\n", ((struct data_box *)arr)->un.bytes[3]);
}
```

## 11. GNU/Linux & AI（选做）

注： 嘿！你或许对 Linux 命令不是很熟悉，甚至没听说过 Linux；你或许对 AI 的了解仅仅止步于豆包，甚至只是听说过。但别担心，这是选做题，了解 Linux 和 AI 是加分项，但不了解也不扣分哦！

### GNU/Linux

- 你知道 `ps aux` 命令所展示的结果是什么吗？
- 请你在 shell 下创建一个目录，然后在目录内创建几个文件并且列出它们，最后完整地删除整个目录。操作完成之后，请你解释一下，每个命令在整个流程中都起什么作用？请你进一步思考一下，Linux 系统的目录结构是什么？
- 你还了解哪些 Linux 的发行版？如果条件允许，你可以尝试安装一个你最喜欢的版本。

### AI

- 模型（model）和智能体（agent）的区别是什么？你可以举一个实际的例子说明一下。
- skill 可以强化一个 agent 在某个问题上回答的专业能力，但是 skill 越多越好吗？
- 如果现在要求你使用 agent 来快速 vibe coding 一个项目，目前较为公认的流程是什么？如果条件允许，你可以尝试实现一个。

---

:::tip 结语

🎉 恭喜你完成了所有题目！`\(^▽^)/` 来到这里已经比绝大部分人强很多了。无论结果如何，相信这个过程已经让你对 C 语言和 Linux 有了更深入的了解。记住，编程是一个持续学习的过程，保持好奇心和学习的热情。

我们期待在西邮 Linux 兴趣小组见到你！
:::
