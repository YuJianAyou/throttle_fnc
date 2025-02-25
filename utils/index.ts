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
                timer_fnc && timer_fnc([ctime])
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
                    timer_fnc && timer_fnc([ctime])
                }, 1000)
            }
            console.info("请稍后再试....")
            return;
        }
        call && call(first_Set, timer)
    }

    execFnc(ctx: any, nowTime: number, first_Set: Set<number>, call: f, timer_fnc: tf, timer: any = null, ctime: number) {
        call && call(first_Set, timer)
        timer_fnc && timer_fnc(ctime)
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


            //  当前时间戳秒  1790 - now time
            const nowTime = ctx.now_timestampInSeconds()


            //  当前Set 结构
            const first_Set = ctx.timeStamp(ctx);
            // //  转换为数组 比较
            const first_Time = [...first_Set][0];

            //  获取到定时器的 name  number || null
            const timer = ctx.getTimer(ctx)

            //  获取本地存储的localStorage存储的时间
            const [_, t] = ctx.getItem("timeStampInSeconds");


            switch (true) {
                case   cTime === 0   :
                    ctx.execFnc(ctx, nowTime, first_Set, call, Interval, timer, cTime)
                    break;
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


