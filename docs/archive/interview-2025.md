---
title: 西邮 Linux 兴趣小组 2025 纳新面试题
date: 2025-10-09 19:29:08
---

<script setup>
import CountDown from "@/components/CountDown.vue"
</script>

# {{ $frontmatter.title }}

> 学长寄语：长期以来，西邮Linux 兴趣小组的面试题以难度之高名扬西邮校内。我们作为出题人也清楚 的知道这份试题略有难度。**请你动手敲一敲代码。** 别担心，若有同学能完成一半的题目，就已经十分优秀。 其次，相比于题目的答案，我们对你的思路和过程更感兴趣，或许你的答案略有瑕疵，但你正确的思路和对 知识的理解足以为你赢得绝大多数的分数。最后，做题的过程也是学习和成长的过程，相信本试题对你更加 熟悉地掌握C语言一定有所帮助。祝你好运。我们东区逸夫楼FZ103见！

- 本题目只作为西邮 Linux 兴趣小组 2025 纳新面试的有限参考。
- 为节省版面，本试题的程序源码省去了 部分 main 函数的 **return 0;** 和 **#include** 指令。
- 本试题中的程序源码仅用于考察 C 语言基础，不应当作为C 语言「代码风格」的范例。
- 所有题目编译并运行于 **x86_64 GNU/Linux** 环境。

## 0. 拼命的企鹅

 一只企鹅在爬山，每隔一段路都会遇到一块石头。第 1 块石头重量是 a，每往上走一段 路，石头重量就会变成上一段的平方。企鹅可以选择把某些石头捡起来，最后把捡到的石头 重量相乘，它怎样捡石头，才能得到重量乘积恰好是 a 的 b 次方的石头？（比如 b=173 时， 要捡哪些石头？）

## 1. 西邮Linux欢迎你啊

请解释以下代码的运行结果。

```c
int main() {
    if (printf("Hi guys! ") || printf("Xiyou Linux ")) {
        printf("%d\n", printf("Welcome to Xiyou Linux 2%d", printf("")));
    }
    return 0;
}
```

## 2. 可以和 \0 组一辈子字符串吗？

你能找到成功打印的语句吗？你能看出每个`if`中函数的返回值吗？这些函数各有什么特点？

```c
int main() {
    char p1[] = { 'W', 'e', 'l', 'c', 'o', 'm', 'e', '\0' };
    char p2[] = "Join us\0", p4[] = "xiyou_linux_group";
    const char* p3 = "Xiyou Linux Group\0\n2025\0";
    if (strcmp(p1, p2)) {
        printf("%s to %s!\n", p1, p2);
    }
    if (strlen(p3) > sizeof(p3)) {
        printf("%s", p3);
    }
    if (sizeof(p1) == sizeof(p2)) {
        printf("%s", p4);
    }
    return 0;
}
```

## 3.数学没问题，浮点数有鬼

这个程序的输出是什么？解释为什么会这样？

```c
int main() {
    float a1 = 0.3, b1 = 6e-1, sum1 = 0.9;
    printf("a1 + b1 %s sum1\n", (a1 + b1 == sum1) ? "==" : "!=");
    float a2 = 0x0.3p0, b2 = 0x6p-4, sum2 = 0x0.9p0;
    printf("a2 + b2 %s sum2\n", (a2 + b2 == sum2) ? "==" : "!=");
    return 0;
}
```

## 4. 不合群的数字

在一个数组中，所有数字都出现了偶数次，只有两个数字出现了奇数次，请聪明的你帮我看看以下的代码是如何找到这两个数字的呢？

```c
void findUndercoverIDs(int nums[], int size) {
    int xorAll = 0,id_a = 0,id_b = 0;
    for (int i = 0; i < size; i++) {
        xorAll ^= nums[i];
    }
    int diffBit = xorAll & -xorAll;
    for (int i = 0; i < size; i++) {
        if(nums[i] & diffBit){
            id_a ^= nums[i];
        } else{
            id_b ^= nums[i];
        }
    }
    printf("These nums are %d %d\n",id_a,id_b);
}
```

## 5. 会一直循环吗？

你了解`argc`和`argv`吗，程序的输出是什么？为什么会这样？

```c
int main(int argc, char* argv[]) {
    printf("argc = %d\n", argc);
    while (argc++ > 0) {
        if(argc < 0){
            printf("argv[0] %s\n", argv[0]);
            break;
        }
    }
    printf("argc = %d\n", argc);
    return 0;
}
```

## 6. const 与指针：谁能动，谁不能动？

```c
struct P {
    int x;
    const int y;
};

int main() {
    struct P p1 = { 10, 20 }, p2 = { 30, 40 };
    const struct P p3 = { 50, 60 };
    struct P* const ptr1 = &p1;
    const struct P* ptr2 = &p2;
    const struct P* const ptr3 = &p3;
    return 0;
}
```

说说下列操作是否合法，并解释原因：

`ptr1->x = 100`
`ptr2->x = 300`
`ptr3->x = 500`

`ptr1->y = 200`
`ptr1 = &p2`
`ptr2->y = 400`

`ptr2 = &p1`
`ptr3->y = 600`
`ptr3 = &p1`

## 7. 指针！数组!

在主函数中定义如下变量:

```c
int main() {
    int a[3] = { 2, 4, 8 };
    int(*b)[3] = &a;
    int* c[3] = { a, a + 1, a + 2 };
    int (*f1(int))(int*, int);
    return 0;
}
```

说说这几个表达式的输出分别是什么？

`a`, 
`*b`, 
`*b + 1`, 
`b`, 
`b + 1`, 
`* (*b + 1)`, 
`c`, 
`sizeof(a)`, 
`sizeof(b)`, 
`sizeof(&a)`
`sizeof(f1)`

## 8. 全局还是局部！！！

观察程序输出，思考为什么？

```c
int g;
int func(){
    static int j = 98;
    i += g;
    return j;
}

int main()
{
    g += 3;
    char arr[6] = {};
    arr[1] = func();
    arr[0] = func();
    arr[2] = arr[3] = func() + 1;
    arr[4] = func() + 1;
    printf("%s linux\n",arr);
    return 0;
}
```

## 8. 宏函数指针

观察程序结果，说说程序运行的过程：

```c
#define CALL_MAIN(main, x) (*(int (*)(int))*main)(x);
#define DOUBLE(x) 2* x
int (*registry[1])(int);
int main(int argc) {
    if (argc > 2e3) return 0;
    printf("%d ", argc + 1);
    *registry = (int(*)(int))main;
    CALL_MAIN(registry, DOUBLE(argc + 1));
    return 0;
}
```

## 10. 拼接 排序 去重

本题要求你编写以下函数，不能改动 main 函数里的代码。实现对arr1和arr2的拼接、排序和去重。你需要自行定义result结构体并使用malloc手动开辟内存。

```c
int main() {
	int arr1[] = { 6, 1, 2, 1, 9, 1, 3, 2, 6, 2 };
	int arr2[] = { 4, 2, 2, 1, 6, 2 };
	int len1 = sizeof(arr1) / sizeof(arr1[0]);
	int len2 = sizeof(arr2) / sizeof(arr2[0]);

	struct result result;
	your_concat(arr1, len1, arr2, len2, result);
	print_result(result);
	your_sort(result);
	print_result(result);
	your_dedup(result);
	print_result(result);
	free(result.arr);
	return 0;
}
```

## 11. 指针魔法

用你智慧的眼睛，透过这指针魔法的表象，看清其本质：

```c
void magic(int(*pa)[6], int** pp) {
    **pp += (*pa)[2];
    *pp = (*pa) + 5;
    **pp -= (*pa)[0];
    *pp = (*pa) + ((*(*pa + 3) & 1) ? 3 : 1);
    *(*pp) += *(*pp - 1);
    *pp = (*pa) + 2;
}
int main() {
    int a[6] = { 2, 4, 6, 8, 10, 12 };
    int* p = a + 1,** pp = &p;
    magic(&a, pp);
    printf("%d %d\n%d %d %d\n%d %d\n",*p,**pp,a[1],a[2],a[3],a[5],p-a);
    return 0;
}
```

## 12. 奇怪的循环

你能看明白这个程序怎样运行吗？试着理解这个程序吧！

```c
union data {
    void **** p;
    char arr[20];
};
typedef struct node {
    int a;
    union data b;
    void (*use)(struct node* n);
    char string[0];
} Node;
void func2(Node* node);

void func1(Node* node) {
    node->use = func2;
    printf("%s\n", node->string);
}
void func2(Node* node) {
    node->use = func1;
    printf("%d\n", ++(node->a));
}
int main() {
    const char* s = "Your journey begins here!";
    Node* P = (Node*)malloc(sizeof(Node) + (strlen(s) + 1) * sizeof(char));
    strcpy(P->string, s);
    P->use = func1;
    P->a = sizeof(Node) * 50 + sizeof(union data);
    while (P->a < 2028) {
        P->use(P);
    }
    free(P);
    return 0;
}
```

## 13. GNU/Linux (选做)

注：嘿！你或许对 Linux 命令不是很熟悉，甚至你没听说过 Linux。但别担心，这是选做题，了解 Linux 是加分项，但不了解也不扣分哦！

1. 你知道`cd`命令的用法与 `/ ~ -` 这些符号的含义吗？
2. 你知道Linux系统如何创建和删除一个目录吗？
3. 请问你还懂得哪些与 GNU/Linux 相关的知识呢？

---

:::tip 结语
🎉 恭喜你完成了所有题目！\\(^▽^)/来到这里已经比绝大部分人强很多了。\
无论结果如何，相信这个过程已经让你对 C 语言和 Linux 有了更深入的了解。\
记住，编程是一个持续学习的过程，保持好奇心和学习的热情。\
我们期待在西邮 Linux 兴趣小组见到你！
:::
