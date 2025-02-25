/**
 *  ------------  限制用户点击次数
 * ------------- 在规定时间段内 只会触发一次
 * 本人 在vue 框架写的  原生ts 会有类型 不兼容  ---- 升级ts  版本
 * ts  原生使用   -  浏览器 环境下
 */
//  示例
import {U} from "@/util/index.ts"
const u = new U();
// 获取dom 元素
const btn = document.getElementsByClassName("btns")[0]

/*
*@fnc u.limitationCode
*@params  u  当前实例对象
*@params  time string  限制的时间  time =20s > 在规定时间内  不会重复触发
*@params  fnc1  (s Set 当前存储的set  , t  number 当前的定时的id) => voild
*@params  fnc2  (cs :number 当前触发的剩余时间  ) => voild 当 cs 为0 时，函数fnc1 会触发
*/
const time = "20s"
if (btn) {
    btn.addEventListener("click", u.limitationCode(u, time, (s: Set<number>, t: number) => {
        console.log("执行了", s, t)
    }, (cs: number) => {
//   定时器功能
        console.log("定时器执行了", cs)
    }))
}
