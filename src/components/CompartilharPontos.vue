<template>
  <BModal id="modal-compartilhar-pontos" title="Compartilhar pontos" @ok="handleOk">
    <b-row class="my-1 p-3">
      <b-form-checkbox-group
        v-model="alunosSelecionados"
        stacked
        class="mb-3"
        name="checkbox"
        value-field="id"
        text-field="nome"
        :options="alunos"
      >
      </b-form-checkbox-group>
    </b-row>
  </BModal>
</template>

<script>
import { BFormCheckboxGroup, BModal, VBModal, BRow } from "bootstrap-vue";
import notificacaoMixin from '@/mixins/notificacaoMixin.js';

export default {
  name: "CompartilharPontos",
  components: { BFormCheckboxGroup, BModal, BRow },
  props: ['alunoAtual', 'dados'],
  directives: {
    "b-modal": VBModal,
  },
  mixins: [notificacaoMixin],
  data() {
    return {
      alunosSelecionados: [],
      alunos: [
        { nome:'', id: 0}
      ],
    }
  },
  methods: {
    handleOk() {
      this.alunosSelecionados.push(this.todosOsAlunos.find(a=> a.id === (this.alunoAtual.idAlunoJogando || this.alunoAtual)).id)
      let qtdPontos = this.dados.pontuacao / this.alunosSelecionados.length
      this.alunosSelecionados.forEach(async (id) => {  
          try {
            await fetch(`http://localhost:4000/pontos`, { 
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({idAluno: id, feito: (this.dados.text ||  this.dados.nome), pontuacao: qtdPontos}),
            })
            this.notificacao('success', `Ponto compartilhado com ${this.todosOsAlunos.find(a=> a.id === id).nome}`, 'SUCESSO', 1500);
          } catch (error) {
            console.log(error);
            this.notificacao('danger', 'Erro ao compartilhar os pontos', 'ERRO', 5000);
          }
          
      })

      this.$emit('finalizouJogada', this.dados.id)

    }
  },
  computed: {
    getAlunos() {
      let alunos = [];
      // eslint-disable-next-line vue/no-async-in-computed-properties
      fetch("http://localhost:4000/alunos")
      .then((response) => response.json())
      .then((data) => {
        this.todosOsAlunos = data;
        this.alunos = data.filter(a => a.id !== (this.alunoAtual.idAlunoJogando || this.alunoAtual))
      })
      .catch(err => {
        console.log(err);
				this.notificacao('danger', 'Erro ao pegar os dados do servidor', 'ERRO', 5000);
      })

      return this.alunoAtual ? alunos.filter(a => a.id !== this.alunoAtual.idAlunoJogando || this.alunoAtual) : alunos;
    }
  },
  async created() {
    this.getAlunos
  }
}
</script>