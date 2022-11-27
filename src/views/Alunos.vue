<template>
  <div style="width: 100%">
    <b-button class="mb-3" style="margin-right: 18px" variant="primary" v-b-modal.modal-novo>Adicionar novo</b-button>
    <b-button class="mb-3" variant="secondary" v-b-modal.modal-chamada>Fazer chamada</b-button>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Código</th>
          <th scope="col">Nome</th>
          <th scope="col">Desafios a cumprir</th>
          <th scope="col">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="aluno in alunos" :key="aluno.id">
          <th scope="row">{{ aluno.id }}</th>
          <td>{{ aluno.nome }}</td>
          <td>{{ desafiosCumprir.filter(d=> d.idAluno == aluno.id).length }}</td>
          <td>
            <button class="btn btn-primary mx-2" v-b-modal.modal-editar @click="abrirModalEditar(aluno.id)">Editar</button>
            <button class="btn btn-danger" v-b-modal.modal-deletar @click="alunoSelecionado = aluno.id">Deletar</button>
            <button class="btn btn-secondary mx-2" v-b-modal.modal-desafios @click="alunoSelecionado = aluno.id">Desafios a cumprir</button>
            </td>
        </tr>
      </tbody>
    </table>

    <BModal id="modal-novo" title="Adicionar/Alterar aluno" @ok="adicionarAluno">
      <b-row class="my-1">
        <b-col sm="2">
          <label for="input-default">Nome:</label>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="12">
          <b-form-input
            id="input-default"
            v-model="alunoAdicionado.nome"
            @keyup.enter="adicionarAluno"
          ></b-form-input>
        </b-col>
      </b-row>
    </BModal>

    <BModal id="modal-editar" title="Adicionar/Alterar aluno" @ok="editarAluno">
      <b-row class="my-1">
        <b-col sm="2">
          <label for="input-default">Nome:</label>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="12">
          <b-form-input
            id="input-default"
            v-model="alunoEditado.nome"
            @keyup.enter="editarAluno"
          ></b-form-input>
        </b-col>
      </b-row>
    </BModal>

    <BModal id="modal-deletar" title="Deletar Registro" @ok="deletaAluno">
      <h2>Deseja realmente apagar o registro?</h2>
    </BModal>
    <BModal id="modal-desafios" size="xl" title="Desafios a Cumprir">
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Selecione</th>
            <th scope="col">Nome</th>
            <th scope="col">Pontuação</th>
            <th scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="desafio in desafiosCumprir.filter(d => d.idAluno === alunoSelecionado)" :key="desafio.id">
            <th scope="row">{{ desafio.id }}</th>
            <td>{{ desafio.nome }}</td>
            <td>{{ desafio.pontuacao }}</td>
            <td>
              <button class="btn btn-primary mx-2" @click="cumpriuDesafio(desafio.id)">Cumpriu</button>
              <button class="btn btn-danger mx-2" @click="deletaDesafio(desafio.id)">Não cumpriu</button>
              <button class="btn btn-danger"  v-b-modal.modal-compartilhar-pontos @click="desafioSelecionado = desafio">Compartilhar Pontos</button>

              </td>
          </tr>
        </tbody>
      </table>
    </BModal>
    <CompartilharPontos :alunoAtual="alunoSelecionado" :dados="desafioSelecionado" v-if="desafioSelecionado" @finalizouJogada="deletaDesafio(desafioSelecionado.id)"/>
    <BModal id="modal-chamada" title="Fazer chamada" @ok="fazChamada">
    <b-row class="my-1 p-4">
      <b-form-checkbox-group
        v-model="alunosChamada"
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
  </div>
</template>



<script>
import { BButton, BModal, VBModal, BFormInput, BCol, BRow, BFormCheckboxGroup } from "bootstrap-vue";
import CompartilharPontos from '@/components/CompartilharPontos.vue';
import alunoMixin from '@/mixins/alunoData.js';
import notificacaoMixin from '@/mixins/notificacaoMixin.js';


export default {
  name: "Alunos",
  components: { BButton, BModal, BFormInput, BCol, BRow, CompartilharPontos, BFormCheckboxGroup },
  directives: {
    "b-modal": VBModal,
  },
  mixins: [alunoMixin, notificacaoMixin],
  data() {
    return {
      abrirModalAdicionar: false,
      alunoAdicionado: {
        nome: '',
      },
      alunoEditado: {
        nome: ''
      },
      desafiosCumprir: [
        {id: 0, idAluno: 0, nome: "", pontuacao: 0}
      ],
      alunoSelecionado: undefined,
      desafioSelecionado: undefined,
      desafiosAluno: 0,
      alunosChamada: []
    };
  },
  methods: {
    async deletaAluno() {
      if(this.alunoSelecionado !== undefined) {
        try {
          await fetch(`http://localhost:4000/alunos/${this.alunoSelecionado}`, {method: 'DELETE'})
          await this.getAlunos(); //Mixin
          this.alunoAdicionado.nome = '';
          this.alunoSelecionado = undefined;
        } catch(err) {
          console.log('Um erro aconteceu com o servidor', err)
        }
        
      }
    },
    abrirModalEditar(id) {
      this.alunoEditado.nome = this.alunos.filter(a => a.id === id)[0].nome
      this.alunoSelecionado = id
    },
    async editarAluno() {
      try{
        await fetch(`http://localhost:4000/alunos/${this.alunoSelecionado}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.alunoEditado),
          })

        await this.getAlunos(); //Mixin
      } catch(err) {
        console.log(err)
      }
    },
    async adicionarAluno() {
      if(this.alunoAdicionado.nome.length < 3)
        return
      
      try {
        await fetch("http://localhost:4000/alunos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.alunoAdicionado),
          })

        await this.getAlunos(); //Mixin
      } catch(err) {
        console.log(err)
      }
    },
    async getDesafios() {
      try {
        let response = await fetch("http://localhost:4000/desafiosCumprir")
        this.desafiosCumprir =  (await response.json() || [])
      } catch (error) {
        console.log(error);
      }
    },
    cumpriuDesafio(id) {
      this.cumpriu(id);
    },
    async cumpriu(idDesafio) {
      try {
        await fetch(`http://localhost:4000/pontos`, { 
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({idAluno: this.alunoSelecionado, feito: this.desafiosCumprir.find(d => d.id == idDesafio).nome, pontuacao: this.desafiosCumprir.find(d => d.id == idDesafio).pontuacao}),
        })
        this.deletaDesafio(idDesafio)
      } catch (error) {
        console.log(error);
      }				
		},
    async deletaDesafio(id) {
      try {
        await fetch(`http://localhost:4000/desafiosCumprir/${id}`, {
          method: "DELETE",
        })
        this.getDesafios();
      } catch (error) {
        console.log(error)
      }

    },
    fazChamada() {
      let count = 0;
      this.alunosChamada.forEach(async (id) => {
        try {
          let response = await fetch(`http://localhost:4000/pontos`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({idAluno: id, feito: "Chegou antes das 9:00", pontuacao: 5})
          })

          if(response.status == 200 ) {
            count++
            if(this.alunosChamada.length == count) 
              this.notificacao('success', 'Chamada realizada com sucesso', 'SUCESSO', 1000);
          }
          else
            throw 'Ocorreu um erro na chamada'
        } catch (erro) {
          console.log(`Erro ao fazer chamada. Aluno: ${id}`,erro)
          this.notificacao('danger', 'Ocorreu um erro ao fazer a chamada', 'ERRO', 5000);
        }
      })
    }
  },
  // computed: {
  //   // eslint-disable-next-line vue/no-async-in-computed-properties
  //   async alunoDesafio() {
  //     this.alunoSelecionado
  //     // eslint-disable-next-line vue/no-async-in-computed-properties
  //     await this.getDesafios();
  //     return true
  //   }
  // },
  async mounted() {
    try {
      await this.getAlunos(); //Mixin
      await this.getDesafios(); 
    } catch(err) {
      console.log('Erro de conexão com o servidor',err);
    }
  },
};
</script>

<style></style>
