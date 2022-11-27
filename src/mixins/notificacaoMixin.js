export default {
  data() {
    return {
      alunos: undefined
    }
  },
  methods: {
    notificacao(variant = null, msg, title, duration) {
			this.$bvToast.toast(msg, {
				title: title,
				variant: variant,
				solid: true,
				autoHideDelay: duration
			})
    }
  }
}