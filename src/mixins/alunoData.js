export default {
  data() {
    return {
      alunos: undefined
    }
  },
  methods: {
    getAlunos() {
      return fetch("http://localhost:4000/alunos")
        .then((response) => response.json())
        .then((data) => (this.alunos = data));
    }
  }
}