
<script lang="ts" setup>
import {ref, reactive} from 'vue'
import {U} from "@/util/index.ts"

/*
*@fnc u.limitationCode
*@params  u  当前实例对象
*@params  time string  限制的时间  time =20s > 在规定时间内  不会重复触发
*@params  fnc1  (s Set 当前存储的set  , t  number 当前的定时的id) => voild
*@params  fnc2  (cs :number 当前触发的剩余时间  ) => voild 当 cs 为0 时，函数fnc1 会触发
*/
const u = new U()
const onSubmits = u.limitationCode(u, "10s", (s: Set<number>, t: number) => {
  console.log("执行了", s, t)
}, (cs: number) => {
//   定时器功能
  console.log("定时器执行了", cs)
})
</script>
