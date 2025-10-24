import { Link } from "react-router-dom";
import { Heart, Instagram, Youtube, Mail } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile

const Footer = () => {
  const isMobile = useIsMobile(); // Use the hook

  if (isMobile) {
    return null; // Não renderiza o footer no mobile
  }

  return (
    <footer className="bg-slate-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              lumts<span className="font-light">fit</span>
            </h3>
            <p className="text-slate-300 mb-4">
              Transformando vidas de mulheres através de uma abordagem única de fitness e nutrição.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-300 hover:text-pink-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-300 hover:text-pink-400 transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-300 hover:text-pink-400 transition-colors">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Navegação</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-slate-300 hover:text-pink-400 transition-colors">Início</Link></li>
              <li><Link to="/meu-espaco" className="text-slate-300 hover:text-pink-400 transition-colors">Meu Espaço</Link></li>
              <li><Link to="/calculadora-macros" className="text-slate-300 hover:text-pink-400 transition-colors">Calculadora de Macros</Link></li>
              <li><Link to="/calculadora-agua" className="text-slate-300 hover:text-pink-400 transition-colors">Calculadora de Água</Link></li>
              <li><Link to="/calculadora-jejum" className="text-slate-300 hover:text-pink-400 transition-colors">Calculadora de Jejum</Link></li>
              <li><Link to="/rastreador-alimentos" className="text-slate-300 hover:text-pink-400 transition-colors">Rastreador de Alimentos</Link></li>
              <li><Link to="/meus-planos-jejum" className="text-slate-300 hover:text-pink-400 transition-colors">Meus Planos de Jejum</Link></li>
              <li><Link to="/ebook" className="text-slate-300 hover:text-pink-400 transition-colors">Ebook</Link></li>
              <li><Link to="/blog" className="text-slate-300 hover:text-pink-400 transition-colors">Blog</Link></li>
              <li><Link to="/comunidade" className="text-slate-300 hover:text-pink-400 transition-colors">Comunidade</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/termos" className="text-slate-300 hover:text-pink-400 transition-colors">Termos de Uso</Link></li>
              <li><Link to="/privacidade" className="text-slate-300 hover:text-pink-400 transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/cookies" className="text-slate-300 hover:text-pink-400 transition-colors">Política de Cookies</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Contato</h4>
            <ul className="space-y-2">
              <li className="text-slate-300">contato@lumtsfit.com</li>
              <li className="text-slate-300">São Paulo, Brasil</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p className="flex items-center justify-center">
            Feito com <Heart className="h-4 w-4 text-pink-500 mx-1" /> para mulheres incríveis
          </p>
          <p className="mt-2">© {new Date().getFullYear()} LumtsFit. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;