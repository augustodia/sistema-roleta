<template>
  <div style="width: 100%">
    <b-button class="mb-3" style="margin-right: 18px" variant="primary" v-b-modal.modal-novo v-b-modal.modal-deletar>Recomeçar Trismestre</b-button>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Código</th>
          <th scope="col">Nome</th>
          <th scope="col">Pontos no Trimestre</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="aluno in alunos" :key="aluno.id">
          <th scope="row">{{ aluno.id }}</th>
          <td>{{ aluno.nome }}</td>
          <td>{{ (aluno.pontos || 0) .toFixed(2).replace('.',',') }} pontos</td>
        </tr>
      </tbody>
    </table>
    <BModal id="modal-deletar" title="Deletar Registro" @ok="resetarTrimestre">
      <h2>Deseja realmente zerar os pontos?</h2>
    </BModal>
  </div>
</template>

<script>
import { BModal, VBModal } from "bootstrap-vue";
import alunoMixin from '@/mixins/alunoData';
import notificacaoMixin from '@/mixins/notificacaoMixin.js';

export default {
  name: 'Ranking',
  mixins: [alunoMixin, notificacaoMixin],
  components: [BModal],
  directives: {
    "b-modal": VBModal,
  },
  data() {
    return {
      pontos: [
        {idAluno: undefined, pontuacao: ''}
      ]
    }
  },
  methods: {
    async resetarTrimestre() {
      try {
        await fetch('http://localhost:4000/deleteTodosPontos', {method: 'DELETE'})
        await fetch('http://localhost:4000/deleteTodosDesafiosCumprir', {method: 'DELETE'})
        await this.getAlunos();
        let response = await fetch("http://localhost:4000/pontos")
        let data = await response.json();
        data.length ? this.pontos = data : this.pontos = [];
        this.carregaAlunosComPontos()
				this.notificacao('success', 'Dados apagados com sucesso', 'SUCESSO', 1000);
      } catch (error) {
        console.log(error)
				this.notificacao('danger', 'Ocorreu um erro ao apagar os dados', 'ERRO', 5000);
      }
    },
    carregaAlunosComPontos() {
      this.alunos.forEach(aluno => {
        aluno.pontos = this.pontos.filter(p => p.idAluno === aluno.id).reduce((acumulador, valorAtual) =>acumulador + valorAtual.pontuacao,0)
      })

      this.alunos.sort((a, b) => {
        if(a.pontos < b.pontos)
          return 1
        if(a.pontos > b.pontos)
          return -1
        return 0
      })
    }
  },
  async mounted() {
    try {
      await this.getAlunos();
      let response = await fetch("http://localhost:4000/pontos")
      let data = await response.json();
      data.length ? this.pontos = data : this.pontos = [];
      this.carregaAlunosComPontos()
    } catch (error) {
      console.log(error)
    }
  }
}
</script>

<style>

</style>