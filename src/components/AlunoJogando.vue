<template>
  <div class="situacao-alunos">
    <div class="aluno-anterior">
      <h2>Aluno anterior: </h2>
      <div class="foto">

      </div>
      <p class="nome">{{alunosJogando.idAlunoJogando !== undefined && alunosJogando.index > 0 ? alunosJogando.alunos[alunosJogando.index - 1].nome : ''}}</p>
    </div>
    <div class="aluno-jogando">
      <h2>Aluno atual: </h2>
      <div class="foto">

      </div>
      <p class="nome">{{alunosJogando.idAlunoJogando !== undefined ? alunosJogando.alunos[alunosJogando.index].nome : ''}}</p>
      <div class="botoes">
        <button class="btn btn-primary " @mouseup="pularVez" :pressed="false">Pular a vez</button>
      </div>
    </div>
    <div class="proximo-aluno">
      <h2>Próximo aluno: </h2>
      <div class="foto">

      </div>
      <p class="nome">{{alunosJogando.idAlunoJogando !== undefined && alunosJogando.index !== alunosJogando.alunos.length - 1 ? alunosJogando.alunos[alunosJogando.index + 1].nome : ''}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['alunosJogando'],
  methods: {
    pularVez() {
      this.$emit('pularVez')
    }
  },
  watch: {
    // alunosJogando(newval, oldVal){
    //   console.log(newval, oldVal)
    // }
  }
}
</script>

<style>
.situacao-alunos {
  display: flex;
}

.aluno-jogando, .aluno-anterior, .proximo-aluno {
  text-align: center;
  background-color: #1d1d1d;
  height: 170px;
  padding: 18px;
  color: #fff;
  border-radius:6px;
}

.aluno-jogando {
  margin: 0px 24px;
  animation: aluno-atual .8s infinite alternate ;
}

.aluno-jogando p, .aluno-anterior p, .proximo-aluno p {
  font-size: 24px;
  
}

.aluno-anterior h2, .proximo-aluno h2 {
  color: rgba(255,255,255, 0.7);
  font-size: 24px;
}

@keyframes aluno-atual {
  0% {
    background-color: #CA2929;
    color: #fff;
  } 50% {
    background-color: #CA2929;
    color: #fff;
  } 100% {
    background-color: #fff;
    color: #1d1d1d;
  }
}

</style>