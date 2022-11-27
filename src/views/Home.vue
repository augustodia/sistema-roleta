<template>
  <div class="home">
    <!-- <button id="resetar-trimestre">INICIAR NOVO TRIMESTRE</button> -->
		<div class="conteudo">
			<VueWinwheel
			@roletaGirada="roletaGirada"
			:proximaRodada="proximaRodada"
			class="roleta"
      :segments="itensRoleta"
      :wheelSize="wheelSize"
      :lineWidth="lineWidth"
      :btnColor="btnColor"
      :btnText="btnText"
      :spin="3"
      :duration="duration"
			:textFontSize="textFontSize"
			:girarNovamente="giraNovamente"
			/>
			
			<div class="dadosRoleta">
				<AlunoJogando
					v-if="alunosJogando.alunos"
					:alunosJogando="alunosJogando"
					@pularVez="naoCumpriuOuCompartilhou"
				/>
				<!-- <button class="btn btn-success btn-lg mt-4" style="width: 200px; margin: 0 auto" @click="">Girar novamente</button> -->
				<h1 v-if="dadosRoleta" class="mt-5 text-center">{{dadosRoleta.text}}</h1>
				<div v-if="dadosRoleta && !dadosRoleta.ganhePontos && !dadosRoleta.passaVez" class="mt-4 dadosRoleta-botoes d-flex justify-content-around">
					<button class="btn btn-success btn-lg" @click="cumpriu" v-if="!dadosRoleta.cumprirDepois">CUMPRIU</button>
					<button class="btn btn-danger btn-lg" v-if="!dadosRoleta.cumprirDepois" @click="naoCumpriuOuCompartilhou">NÃO CUMPRIU</button>
					<button class="btn btn-secondary btn-lg" v-else-if="!dadosRoleta.passaVez" @click="vaiCumprir">VAI CUMPRIR</button>
					<button class="btn btn-danger btn-lg"  v-b-modal.modal-compartilhar-pontos v-if="!dadosRoleta.cumprirDepois">COMPARTILHAR PONTOS</button>
					<button class="btn btn-danger btn-lg" v-else-if="!dadosRoleta.passaVez" @click="naoCumpriuOuCompartilhou">NÃO VAI CUMPRIR</button>
				</div>
			</div>

			<CompartilharPontos :alunoAtual="alunosJogando" :dados="dadosRoleta" @finalizouJogada="naoCumpriuOuCompartilhou" v-if="dadosRoleta"/>
			<BModal id="modal-nome-desafio" title="Nome do desafio" @ok="vaiCumprir">
				<b-row class="my-1">
					<b-col sm="2">
						<label for="input-nome">Nome:</label>
					</b-col>
				</b-row>
				<b-row class="my-1">
        <b-col sm="12">
          <b-form-input
            id="input-nome"
          ></b-form-input>
        </b-col>
      </b-row>
			</BModal>
		</div>
  </div>
</template>

<script>
import VueWinwheel from '@/components/vue-winwheel-reversion/vue-winwheel';
import AlunoJogando from '@/components/AlunoJogando';
import CompartilharPontos from '@/components/CompartilharPontos.vue';
import alunoMixin from '@/mixins/alunoData.js';
import notificacaoMixin from '@/mixins/notificacaoMixin.js';

import {VBModal, BModal} from "bootstrap-vue";
export default {
  name: 'Home',
  components:{VueWinwheel, AlunoJogando, CompartilharPontos, BModal},
	directives: {
    "b-modal": VBModal,
  },
	mixins: [alunoMixin, notificacaoMixin],
  data(){
    return {
			alunosJogando: {
				idAlunoJogando: undefined,
				alunos: undefined,
				index: 0
			},
			dadosRoleta: undefined,
			itensRoleta: [
				{
					textFillStyle: '#fff',
					fillStyle: '#000',
					text:'Desafio'
				},
			],
			proximaRodada: false,
      pageTitle: "Vue-Wheel",
      wheelSize: 750,
      btnColor: "",
      btnText: "Girar",
      lineWidth: 3,
      duration: 3,
      spin: 12,
			textFontSize: 24,
			giraNovamente: false,
    }
  },
  methods: {
		async cumpriu() {
			try {
				let response = await this.setPontos();
				if(response.status == 200) {
					this.notificacao('success', 'Ponto salvo com sucesso', 'SUCESSO', 1000);
					//Atualizo o aluno que vai jogar
					this.verificaProximoAluno();

					try {
						//Salvo o aluno no banco
						await this.setUltimoAluno(this.alunosJogando.idAlunoJogando);
					} catch(err) {
						console.log(err);
						this.notificacao('danger', 'Ocorreu um erro ao gravar o novo aluno a jogar', 'ERRO', 5000);
					} 			
					this.resetRoleta();
				}
				else
					throw(`Servidor respondeu com erro ${response.status}`)
			} catch(err) {
				console.error(err);
				this.notificacao('danger', 'Erro ao salvar o ponto', 'ERRO', 5000);
			}

			
		},
		async naoCumpriuOuCompartilhou(){
			//Atualizo o aluno que vai jogar
			this.verificaProximoAluno();		

			try {
				//Salvo o aluno no banco
				await this.setUltimoAluno(this.alunosJogando.idAlunoJogando);
			} catch(err) {
				console.log(err);
				this.notificacao('danger', 'Ocorreu um erro ao gravar o novo aluno a jogar', 'ERRO', 5000);
			}

			this.resetRoleta();
		},
		async vaiCumprir() {
			this.alunosJogando.idAlunoJogando = this.alunos[this.alunosJogando.index].id
			try {
				await fetch(`http://localhost:4000/desafiosCumprir`, { 
					method: 'POST',
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({idAluno: this.alunosJogando.idAlunoJogando, nome: this.dadosRoleta.text, pontuacao: this.dadosRoleta.pontuacao })
				})
				this.notificacao('success', 'Desafio a cumprir gravado', 'SUCESSO', 1000);
			} catch (err) {
				console.log(err);
				this.notificacao('danger', 'Ocorreu um erro ao gravar o desafio para cumprir', 'ERRO', 5000);
			}
			//Atualizo o aluno que vai jogar
			this.verificaProximoAluno();

			try {
				await this.setUltimoAluno(this.alunosJogando.idAlunoJogando);
				this.resetRoleta();
			} catch(err) {
				console.log(err);
				this.notificacao('danger', 'Ocorreu um erro ao gravar o novo aluno a jogar', 'ERRO', 5000);
			}
			
		},
		roletaGirada(event) {
			if(event.passaVez){
				setTimeout(() => this.naoCumpriuOuCompartilhou(),1000)
			}
			if(event.ganhePontos) {
				setTimeout(() => this.cumpriu(),1000)
			}
			this.dadosRoleta = event;
			this.proximaRodada = false
			setTimeout(() => this.proximaRodada = true, 0);
		},
		setaAlunosJogando() {
			let _this = this
			return fetch('http://localhost:4000/dadosTrimestre')
			.then(response => response.json())
			.then(data => {
				if(data.length)
					this.alunosJogando.idAlunoJogando = data[0].idAlunoJogando
					let temAluno = false
					this.alunos.forEach((aluno, index) => {
						if(aluno.id == this.alunosJogando.idAlunoJogando) {
							temAluno = true 
							this.alunosJogando.index = index
							}
						})
				if(!temAluno) {
					_this
					this.alunos.length > 1 ? this.alunosJogando.idAlunoJogando = this.alunos[0].id : this.alunosJogando.idAlunoJogando = 0
				}
				this.alunosJogando.alunos = this.alunos;
			})
		},
		setPontos() {
			return fetch(`http://localhost:4000/pontos`, { 
				method: 'POST',
				headers: {
          "Content-Type": "application/json",
        },
				body: JSON.stringify({idAluno: this.alunosJogando.idAlunoJogando, feito: this.dadosRoleta.text, pontuacao: this.dadosRoleta.pontuacao}),
			})
		},
		setUltimoAluno(id) {
			return fetch(`http://localhost:4000/dadosTrimestre/1`, { 
				method: 'PUT',
				headers: {
          "Content-Type": "application/json",
        },
				body: JSON.stringify({idAlunoJogando: id}),
			})
		},
		resetRoleta() {
			this.dadosRoleta = undefined;
		},
		setaItensRoleta() {
			return fetch('http://localhost:4000/itensRoleta')
			.then(response => response.json())
			.then(data => {
				this.itensRoleta = data
			})
		},
		verificaProximoAluno() {
			if(this.alunosJogando.index == this.alunos.length - 1) {
				this.alunosJogando.index = 0
				this.alunosJogando.idAlunoJogando = this.alunos[this.alunosJogando.index].id
			}
			else {
				this.alunosJogando.index++
				this.alunosJogando.idAlunoJogando = this.alunos[this.alunosJogando.index].id
			}
		}
  },
	// computed: {
		
	// },
	async created() {
		try {
			await this.getAlunos(); //Mixin
			await this.setaAlunosJogando();
			await this.setaItensRoleta()
			// this.makeToast('danger');
		} catch(err) {
			console.log('Erro', err)
			this.notificacao('danger', 'Ocorreu um erro ao pegar os dados do servidor', 'ERRO', 5000);
		}
		
	}
}
</script>

<style>
.roleta {
	margin-top: 24px;
}

.home {
	width: 100%;
}

#resetar-trimestre {
  background-color: #CA3939;
  border: none;
  padding: 8px 24px;
  color: #FFFFFF;
  border-radius:6px;
  cursor: pointer;
}

.conteudo {
	display: flex;
	justify-content: space-between;
}

.dadosRoleta {
	display: flex;
	flex-direction: column;
}
</style>
