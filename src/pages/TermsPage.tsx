const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Termos de Uso</h1>
      
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100">
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">1. Aceitação dos Termos</h2>
          <p className="text-slate-600 mb-4">
            Ao acessar e utilizar o LumtsFit, você concorda em cumprir estes termos de uso e todas as leis e regulamentos aplicáveis.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">2. Uso do Serviço</h2>
          <p className="text-slate-600 mb-4">
            O LumtsFit oferece ferramentas e conteúdo educativo para apoiar sua jornada fitness. O uso do serviço é permitido apenas para usuários registrados.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">3. Responsabilidade do Usuário</h2>
          <p className="text-slate-600 mb-4">
            Você é responsável por manter a confidencialidade de sua conta e senha, e por todas as atividades que ocorrem em sua conta.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">4. Propriedade Intelectual</h2>
          <p className="text-slate-600 mb-4">
            Todo o conteúdo do LumtsFit, incluindo textos, gráficos, logotipos e software, é de propriedade exclusiva da LumtsFit e protegido por leis de direitos autorais.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">5. Alterações nos Termos</h2>
          <p className="text-slate-600">
            Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após serem publicadas no site.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;