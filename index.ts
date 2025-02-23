/**
 *  ------------  限制用户点击次数
 * ------------- 在规定时间段内 只会触发一次
 * 本人 在vue 框架写的  原生ts 会有类型 不兼容  ---- 升级ts  版本
 */
// ----------------start ---------------------------
type f = (first_Set: Set<number>, timer: any) => void
type tf = (...a: Array<any>) => void

type tv = () => void

interface Utlis {
    limitationCode(ctx: any, times: string, call: tv, Interval: tf): () => void,

    now_timestampInSeconds(): number,

    timeStamp(that: Ut): Set<number>

    timesReg(s: string): [boolean, number];

    getTimer(that: Ut): Set<number>
}

interface Item {
    getItem(k: string): [boolean, string];

    setItem(k: string, v: string): [boolean, number | string];

    removeItem(k: string): [boolean, string];
}

interface Ut extends Utlis {

}


interface Execs {
    firstFnc(ctx: any, nowTime: number, first_Set: Set<number>, call: f, timer_fnc: tf, timer: any, ctime: number): void;

    cFnc(ctx: any, nowTime: number, first_Set: Set<number>, call: f, timer_fnc: tf, timer: any, ctime: number): void;

    lastFnc(time: number): void;

}


class L implements Item {
    getItem(key: string = ""): [boolean, string] {
        if (!key) return [false, `key is unknown`]
        const value = localStorage.getItem(key)

        if (value) {
            return [true, value ? value : ""]
        } else {
            return [false, value ? value : ""]
        }

    }

    setItem(key: string, value: string): [boolean, number | string] {
        if (!key) return [false, `key is unknown`]
        localStorage.setItem(key, value)
        return [true, key]
    }

    removeItem(key: string,): [boolean, string] {
        if (!key) return [false, `key is unknown`]
        localStorage.removeItem(key)
        return [true, key]
    }

}


class Execute extends L implements Execs {
    constructor() {
        super()
    }

    firstFnc(ctx: any, nowTime: number, first_Set: Set<number>, call: f, timer_fnc: tf, timer: any = null, ctime: number) {

        ctx.setItem(
            "timeStampInSeconds",
            nowTime.toString()
        )

        first_Set.add(nowTime)

        if (typeof timer_fnc === 'function') {
            timer = setInterval(() => {
                ctime--;
                if (!ctime) {
                    clearInterval(timer)
                }
                timer_fnc && timer_fnc([ctime])
            }, 1000)
        }

        call && call(first_Set, timer)
        return;
    }

    cFnc(ctx: any, nowTime: number, first_Set: Set<number>, call: f, timer_fnc: tf, timer: any = null, ctime: number) {

        const first_time: number = [...first_Set][0]


        ctx.removeItem("timeStampInSeconds")
        ctx.setItem(
            "timeStampInSeconds",
            nowTime.toString()
        )

        first_Set.delete(first_time)
        first_Set.add(nowTime)


        if (typeof timer_fnc === 'function') {
            timer = setInterval(() => {
                ctime--;
                if (!ctime) {
                    clearInterval(timer)
                }
                timer_fnc && timer_fnc(ctime)
            }, 1000)
        }

        call && call(first_Set, timer)
        return;
    }

    lastFnc(time: number) {
        console.log(`time is not  ${time}s`)
        return;
    }


    cacheFnc(ctx: any, nowTime: number, first_Set: Set<number>, call: f, timer_fnc: tf, timer: any = null, ctime: number) {
        const [_, t] = ctx.getItem("timeStampInSeconds");
        first_Set.add(nowTime)
        if (ctime > nowTime - t) {
            ctime = ctime - (nowTime - t)
            if (typeof timer_fnc === 'function') {
                timer = setInterval(() => {
                    ctime--;
                    if (!ctime) {
                        clearInterval(timer)
                    }
                    timer_fnc && timer_fnc(ctime)
                }, 1000)
            }

            call && call(first_Set, timer)
            return;
        } else {
            console.info("请稍后再试....")
        }

    }
}


export class U extends Execute implements Ut {
    private s: Set<number> = new Set<number>();
    private timer: any;

    constructor() {
        super()
    }

    //  记录  点击的时间


    now_timestampInSeconds() {
        // 1970  到现在    --  将毫秒转换为秒
        const timestampInMilliseconds = Date.now();
        return Math.floor(timestampInMilliseconds / 1000);
    }

    timeStamp(that: Ut) {
        //  上一次的时间
        return (that as any).s
    }

    getTimer(that: Ut) {
        return (that as any).timer
    }

    timesReg(times: string): [boolean, number] {
        const reg = /^\d+s$/;
        let cTime: number = 0
        if (reg.test(times)) {
            cTime = +(times.replace(/s/, ''));
        }
        return [
            reg.test(times),
            cTime
        ]
    }

    limitationCode(ctx: any, times: string, call: tv, Interval: tf): () => void {

        return () => {
            const [ok, cTime] = ctx.timesReg(times);
            if (!ok) {
                console.error("%ccccc 限制的时间不对")
                return;
            }

            // //  当前时间戳秒  1790 - now time
            const nowTime = ctx.now_timestampInSeconds()


            // //  当前Set 结构
            const first_Set = ctx.timeStamp(ctx);
            // //  转换为数组 比较
            const first_Time = [...first_Set][0];
            const timer = ctx.getTimer(ctx)
            const [_, t] = ctx.getItem("timeStampInSeconds");
            switch (true) {

                case  t && !first_Time :
                    ctx.cacheFnc(ctx, nowTime, first_Set, call, Interval, timer, cTime)
                    break;
                case   !t   :
                    ctx.firstFnc(ctx, nowTime, first_Set, call, Interval, timer, cTime)
                    break;
                case  nowTime - (+t) > cTime :
                    ctx.cFnc(ctx, nowTime, first_Set, call, Interval, timer, cTime)
                    break;
                case nowTime - (+t) <= cTime :
                    ctx.lastFnc(nowTime - (+t))
                    break;

            }

        }
    }
}


// ------------------------- end ----------------







//  js  原生使用   -  浏览器 环境下
//  示例
const u = new U();
const btn = document.getElementsByClassName("btns")[0]
if (btn) {
    btn.addEventListener("click", u.limitationCode(u, "20s", (s: Set<number>, t: number) => {
        console.log("执行了", s, t)
    }, (cs: number) => {
//   定时器功能
        console.log("定时器执行了", cs)

    }))
}



//  vue  使用

<script lang="ts" setup>
//  上面的class 类.
import {U} from "@/util/index.ts"
/**
 * s 当前时间戳
 * t  定时器  name 可以手动清除清定时器
 * cs  为 当前过去的时间 单位 / s
 * @fnc limitationCode
 * @params  u 当前实例对象
 * @return   viod
 */
const u = new U()
const onSubmits = u.limitationCode(u, "20s", (s: Set<number>, t: number) => {
    console.log("执行了", s, t)
}, (cs: number) => {
//   定时器功能
    console.log("定时器执行了", cs)

})
</script>

<template>
    <button type="primary" @click="onSubmits" class="login-btn">发送验证码</button>
</template>



