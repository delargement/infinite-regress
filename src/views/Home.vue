<template>
  <div>
<!--    <img src="../assets/logo.jpg" alt="page logo" height="400">-->
    <section class="banner">
      <v-vanta effect="net" class="banner" />
    </section>
    <h1>Infinite Regress</h1>
    <div>
      <input type="text" v-model="query" placeholder="Search.." class="query-field"/>
      <input type="submit" class="query-button" @click="search()" >
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import VVanta from 'vue-vanta';
@Component({
  components: {
    VVanta
  },
})

export default class Home extends Vue {

  query = '';
  checkQuery(query)  {
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

banner {
  position: absolute; z-index: 0; top: 0px; left: 0px; width: 1903px; height: 363px;
}
body {
  /*padding-top: 5rem;*/
  /*padding-left: 40rem;*/
  /*padding-right: 40rem;*/
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

