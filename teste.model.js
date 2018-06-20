function AutoTeste (aplicacao, versao, horaExecucao, massa, recurso) {
  this.aplicacao = aplicacao;
  this.versao = versao;
  this.horaExecucao = horaExecucao;
  this.massaTeste = massa;
  this.recurso = recurso;
  this.cenarios = [];
  this.statusGeral = false;
  this.tempoTotal = 0;

}

module.exports = AutoTeste;
