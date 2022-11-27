<template>
  <div id="app">
    <div class="container-principal">
      <Menu/>
      <router-view/>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/Menu.vue'
export default {
  components: {
    Menu
  },
  data() {
    return {
      db: undefined,
      tabelaAlunos: undefined
    }
  },
}
</script>

<style>
.container-principal {
  display: flex;
  height:100%;
}

#app {
  height:100%;
  padding: 12px;
}
</style>
