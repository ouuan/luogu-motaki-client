# Luogu Motaki Client

(Work in progress :construction:)

洛谷冬日绘板助手 Luogu Motaki 的客户端，[项目主仓库](https://github.com/ouuan/luogu-motaki)

## 配置

配置放在运行目录下的 `motaki-config.txt` 中。

配置文件被分隔符 `---` 分成若干块，每一块中有若干 token，服务器地址和任务名称。不同块之间相互独立，但是同一个 uid 的 token 只能放在一块里面。

以 `http` 开头的一行表示任务，由服务器地址和可选的任务名称组成。若没有任务名称则会画这个服务器上的所有任务，否则只会画指定名称的任务。每一行指定的所有任务地位相同，不同行之间越靠上优先级越高。

token 放在单独的一行，表示这个 token 会用来画这一块。

不符合上述格式的内容会被直接忽略。

例如：

```
49742:0rQPZC4ds5l6oRj1
114514:ikUaNfO9ypACpIpY
https://motaki.ouuan.moe 我最想画的任务一 我最想画的任务二
https://motaki.ouuan.moe
https://motaki.someoneelse.io
你可以直接写不符合格式要求的内容当作注释
# 但是为了看起来舒服还是可以加个注释符号
---
# 上面有个分割线，下面就是新的一块
# 比如说，你可以新开一块来帮别人画
23333:pkVrXzZu9Knwv9Gd
https://motaki.someoneelse.io sometask
https://motaki.someoneelse.io
# 别人画好了，让他以最低的优先级帮你画（
https://motaki.ouuan.moe
# token 放在最后面也是可以的
66666:CqozWA6ayLuk36Wr
```
