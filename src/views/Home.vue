<template>
  <div>

    <h1>Infinite Regress</h1>
    <img src="../assets/logo.jpg" alt="page logo" height="400">
    <div>
      <input type="text" v-model="query" placeholder="Search.." class="query-field"/>
      <input type="submit" class="query-button" @click="search()" >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
  components: {
    HelloWorld
  },
})
export default class Home extends Vue {
  query = '';
  checkQuery(query: string) : boolean {
    return query.length > 0;
  }
  search() {
    if (!this.checkQuery(this.query))
      return;

    this.$router.push({
      name: 'Graph',
      params: {query: this.query}
    });
  }
}
</script>
<style>

body {
  padding-top: 5rem;
  padding-left: 40rem;
  padding-right: 40rem;
}

img {
  margin: 2rem;
}

.query-field {
  /*margin-top: 20rem ;*/

  /*width: 20%;*/
  /*height: 30px;*/
  /*border: 1px solid #ccc;*/
  /*border-radius: 4px;*/
  /*padding: 5px;*/
}




</style>

if __name__ == init():
  args = argv[]

  if arg[0] == 'generate':
    print(generate(args[2]))
