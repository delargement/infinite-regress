<template>
  <div>
    <TInput type="text" placeholder="Search.."/>
    <router-link to="/graph"><button>Search</button></router-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import {TInput} from "vue-tailwind/dist/components";

@Component({
  components: {
    HelloWorld, TInput
  },
})
export default class Home extends Vue {}
</script>
