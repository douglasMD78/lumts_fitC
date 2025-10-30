"use client";

const CookiesPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Política de Cookies</h1>
      
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100">
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">1. O que são Cookies?</h2>
          <p className="text-slate-600 mb-4">
            Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um site. Eles são amplamente utilizados para fazer os sites funcionarem de forma mais eficiente e para fornecer informações aos proprietários do site.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">2. Como Usamos Cookies</h2>
          <p className="text-slate-600 mb-4">
            Utilizamos cookies para autenticação, lembrar suas preferências, analisar o desempenho do site, personalizar conteúdo e publicidade, e para fins de segurança.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">3. Tipos de Cookies Utilizados</h2>
          <ul className="list-disc list-inside text-left text-slate-600 mb-4 space-y-1">
            <li><strong>Cookies Essenciais:</strong> Necessários para o funcionamento básico do site.</li>
            <li><strong>Cookies de Desempenho:</strong> Coletam informações sobre como você usa o site para melhorar sua funcionalidade.</li>
            <li><strong>Cookies de Funcionalidade:</strong> Lembram suas escolhas e preferências para oferecer uma experiência mais personalizada.</li>
            <li><strong>Cookies de Publicidade:</strong> Usados para exibir anúncios relevantes para você.</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">4. Gerenciamento de Cookies</h2>
          <p className="text-slate-600 mb-4">
            Você pode controlar e gerenciar cookies através das configurações do seu navegador. No entanto, desativar certos cookies pode afetar a funcionalidade do site.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-4">5. Alterações na Política de Cookies</h2>
          <p className="text-slate-600">
            Podemos atualizar esta política periodicamente. Recomendamos que você a revise regularmente para se manter informado sobre o uso de cookies.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CookiesPolicyPage;