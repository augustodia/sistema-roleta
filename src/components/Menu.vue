<template>
  <div id="menu">
    <ul>
      <router-link to="/"><li class="menu-link"><book-open-icon size="1.5x" class="icon-menu"></book-open-icon><span>Classe</span></li></router-link>
      <router-link to="/alunos"><li class="menu-link"><users-icon size="1.5x" class="icon-menu"></users-icon><span>Alunos</span></li></router-link>
      <router-link to="/ranking"><li class="menu-link"><award-icon size="1.5x" class="icon-menu"></award-icon><span>Ranking</span></li></router-link>
      <router-link to="/configuracoes"><li class="menu-link"><sliders-icon size="1.5x" class="icon-menu"></sliders-icon><span>Config.</span></li></router-link>
    </ul>
  </div>
</template>

<script>
import { BookOpenIcon, UsersIcon, AwardIcon, SlidersIcon } from 'vue-feather-icons'
export default {
  components: {
    BookOpenIcon,
    UsersIcon,
    AwardIcon,
    SlidersIcon  
  }
}
</script>

<style>
#menu {
  background-color: #1D1D1D;
  border-radius: 10px;
  display: block;
  height: 100%;
  margin-right: 12px;
}

#menu ul {
  list-style: none;
  padding: 0 24px 0px 12px;
}

#menu ul a {
  text-decoration: none;
}
#menu .menu-link {
  display: flex;
  align-items: center;
  padding: 10px 0;
  color: #FFFFFF;

}

#menu .icon-menu {
  margin-right: 18px;
}

</style>