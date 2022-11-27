<template>
  <div style="width: 100%">
    <b-button class="mb-3" variant="primary" v-b-modal.modal-novo @click="adicionarItem">Adicionar novo</b-button>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Código</th>
          <th scope="col">Nome</th>
          <th scope="col">Pontuação</th>
          <th scope="col">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in itens" :key="item.id">
          <th scope="row">{{ item.id }}</th>
          <td :style="{backgroundColor: item.fillStyle, color: item.textFillStyle, verticalAlign: 'middle'}">{{ item.text }}</td>
          <td>{{ item.pontuacao }}</td>
          <td>
            <button class="btn btn-primary mx-2" v-b-modal.modal-editar @click="itemEditar = item">Editar</button>
            <button class="btn btn-danger" v-b-modal.modal-deletar @click="itemDeletar = item.id">Deletar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <BModal  id="modal-novo" title="Adicionar/Alterar Item" @ok="adicionarItem">
      <b-row class="my-1">
        <b-col sm="6">
          <label for="input-default">Nome:</label>
        </b-col>
        <b-col sm="6">
          <label for="input-default">Potuação:</label>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="6">
          <b-form-input
            id="input-default"
            v-model="itemAdicionado.text"
          ></b-form-input>
        </b-col>
        <b-col sm="6">
          <b-form-input
            id="input-default"
            v-model.number="itemAdicionado.pontuacao"
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="6">
          <label for="input-default">Cor do texto:</label>
        </b-col>
        <b-col sm="6">
          <label for="input-default">Cor de fundo:</label>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="6">
          <input type="color"
            v-model="itemAdicionado.textFillStyle"
          >
        </b-col>
        <b-col sm="6">
          <input type="color"
            v-model="itemAdicionado.fillStyle"
          >
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="6">
          <label for="input-default">Vai cumprir depois</label>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="6">
          <b-form-checkbox
            id="input-default"
            v-model="itemAdicionado.cumprirDepois"
          ></b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="6">
          <label for="input-default">Passa a vez</label>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="6">
          <b-form-checkbox
            id="input-default"
            v-model="itemAdicionado.passaVez"
          ></b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="6">
          <label for="input-default">Ganhe pontos</label>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="6">
          <b-form-checkbox
            id="input-default"
            v-model="itemAdicionado.ganhePontos"
          ></b-form-checkbox>
        </b-col>
      </b-row>
    </BModal>

    <BModal v-if="itemEditar" id="modal-editar" title="Adicionar/Alterar Item" @ok="editarItem">
      <b-row class="my-1">
        <b-col sm="6">
          <label for="input-nome">Nome:</label>
        </b-col>
        <b-col sm="6">
          <label for="input-pontos">Potuação:</label>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="6">
          <b-form-input
            id="input-nome"
            v-model="itemEditar.text"
          ></b-form-input>
        </b-col>
        <b-col sm="6">
          <b-form-input
            id="input-pontos"
            v-model.number="itemEditar.pontuacao"
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="6">
          <label for="input-cor-texto">Cor do texto:</label>
        </b-col>
        <b-col sm="6">
          <label for="input-fundo">Cor de fundo:</label>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="6">
          <input type="color"
            id="input-cor-texto"
            v-model="itemEditar.textFillStyle"
          >
        </b-col>
        <b-col sm="6">
          <input type="color"
            id="input-cor-fundo"
            v-model="itemEditar.fillStyle"
          >
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="6">
          <label for="input-cumprir-depois">Vai cumprir depois</label>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="6">
          <b-form-checkbox
            id="input-cumprir-depois"
            v-model="itemEditar.cumprirDepois"
          ></b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="6">
          <label for="input-passa-vez">Passa a vez</label>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="6">
          <b-form-checkbox
            id="input-passa-vez"
            v-model="itemEditar.passaVez"
          ></b-form-checkbox>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="6">
          <label for="input-ganhe-pontos">Ganhe pontos</label>
        </b-col>
      </b-row>
      <b-row class="my-1">
        <b-col sm="6">
          <b-form-checkbox
            id="input-ganhe-pontos"
            v-model="itemEditar.ganhePontos"
          ></b-form-checkbox>
        </b-col>
      </b-row>
    </BModal>

    <BModal id="modal-deletar" title="Deletar Registro" @ok="deletarItem()">
      <h2>Deseja realmente apagar o registro?</h2>
    </BModal> 
  </div>
</template>

<script>
import { BButton, VBModal, BModal, BFormInput, BFormCheckbox,BCol, BRow} from "bootstrap-vue";
import notificacaoMixin from '@/mixins/notificacaoMixin.js';

export default {
  nome: "Configuracoes",
  components: { BButton, BModal, BFormInput, BFormCheckbox, BCol, BRow},
  directives: {
    "b-modal": VBModal,
  },
  mixins: [notificacaoMixin],
  data() {
    return {
      itens: [],
      itemAdicionado: {
        text: '',
        pontuacao: null,
        textFillStyle: '#ffffff',
        fillStyle: '#000000',
        cumprirDepois: false,
        passaVez: false,
        ganhePontos: false
      },
      itemDeletar: undefined,
      itemEditar: undefined
    }
  },
  methods: {
    async deletarItem() {
      if(!this.itemDeletar)
        return
      try {
        let response = await fetch(`http://localhost:4000/itensRoleta/${this.itemDeletar}`, {
          method: "DELETE"
        })
        if(response.status == 200)
          this.notificacao('success', 'Dados apagados com sucesso', 'SUCESSO', 1000);
        else
          throw 'Deu um erro ao deletar o item';
        this.getItens();
      } catch (err) {
				this.notificacao('danger', 'Ocorreu um erro ao apagar o item', 'ERRO', 5000);
        console.error(err);
      }
    },
    async adicionarItem() {
      if(this.itemAdicionado.text.length < 3)
        return
      try {
        let response = await fetch("http://localhost:4000/itensRoleta", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.itemAdicionado),
        })
        if(response.status == 200)
          this.notificacao('success', 'Dados gravados com sucesso', 'SUCESSO', 1000);
        else
          throw 'Deu um erro ao criar o item';

        let responseGet = await this.getItens();

        if(responseGet.status !== 200) {
          throw 'Deu um erro ao pegar os dados';
        }

        this.itemAdicionado = {
          text: '',
          pontuacao: null,
          textFillStyle: '#rrggbb',
          fillStyle: '#rrggbb',
          cumprirDepois: false,
          passaVez: false,
          ganhePontos: false
        }
      } catch(err) {
				this.notificacao('danger', 'Ocorreu um erro gravar os dados', 'ERRO', 5000);
        console.error(err);
      }
    },
    async editarItem() {
      try {
        let response  = await fetch(`http://localhost:4000/itensRoleta/${this.itemEditar.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.itemEditar),
        })

        if(response.status == 200)
          this.notificacao('success', 'Dados gravados com sucesso', 'SUCESSO', 1000);
        else
          throw 'Deu um erro ao editar o item';

        await this.getItens();

      } catch (err) {
				this.notificacao('danger', 'Ocorreu um erro gravar os dados', 'ERRO', 5000);
        console.error(err);
      }
      this.itemEditar = {}
    },
    getItens() {
      return fetch('http://localhost:4000/itensRoleta')
      .then(response => response.json())
      .then(data => this.itens = data);
    }
  },
  async created() {
    try {
      await this.getItens();
    } catch (error) {
			this.notificacao('danger', 'Ocorreu um erro pegar os dados', 'ERRO', 5000);
    }
  }
}
</script>

<style>

</style>