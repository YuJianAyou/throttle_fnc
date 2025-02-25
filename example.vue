
<script lang="ts" setup>
import {ref, reactive} from 'vue'
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
const onSubmits = u.limitationCode(u, "10s", (s: Set<number>, t: number) => {
  console.log("执行了", s, t)
}, (cs: number) => {
//   定时器功能
  console.log("定时器执行了", cs)

})
