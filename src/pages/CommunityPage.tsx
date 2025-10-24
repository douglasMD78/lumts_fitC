import { Link } from "react-router-dom";
import { Heart, MessageCircle, Users, Calendar, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const CommunityPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Comunidade <span className="text-pink-500">LumtsFit</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Conecte-se com outras mulheres, compartilhe suas conquistas e encontre apoio em sua jornada fitness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
            <div className="flex items-center mb-4">
              <Heart className="h-8 w-8 text-pink-500 mr-3" />
              <h2 className="text-xl font-bold text-slate-800">Desafios Semanais</h2>
            </div>
            <p className="text-slate-600 mb-4">
              Participe de desafios comunitários para manter a motivação alta e celebrar conquistas juntas.
            </p>
            <Button asChild className="bg-pink-500 hover:bg-pink-600">
              <Link to="/desafios">Ver Desafios</Link>
            </Button>
          </div>

          {/* Removido o link para o Fórum, Conquistas e Eventos, pois as rotas não existem */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 opacity-50 cursor-not-allowed">
            <div className="flex items-center mb-4">
              <MessageCircle className="h-8 w-8 text-gray-400 mr-3" />
              <h2 className="text-xl font-bold text-gray-600">Fórum de Discussão</h2>
            </div>
            <p className="text-gray-500 mb-4">
              Tire dúvidas, compartilhe dicas e conecte-se com outras mulheres em nossa comunidade acolhedora. (Em breve!)
            </p>
            <Button disabled variant="outline" className="border-gray-300 text-gray-400">
              Acessar Fórum
            </Button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 opacity-50 cursor-not-allowed">
            <div className="flex items-center mb-4">
              <Trophy className="h-8 w-8 text-gray-400 mr-3" />
              <h2 className="text-xl font-bold text-gray-600">Conquistas</h2>
            </div>
            <p className="text-gray-500 mb-4">
              Celebre suas conquistas e veja as conquistas de outras mulheres em nossa galeria de sucesso. (Em breve!)
            </p>
            <Button disabled variant="outline" className="border-gray-300 text-gray-400">
              Ver Conquistas
            </Button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 opacity-50 cursor-not-allowed">
            <div className="flex items-center mb-4">
              <Calendar className="h-8 w-8 text-gray-400 mr-3" />
              <h2 className="text-xl font-bold text-gray-600">Eventos ao Vivo</h2>
            </div>
            <p className="text-gray-500 mb-4">
              Participe de lives, workshops e sessões de perguntas e respostas com especialistas. (Em breve!)
            </p>
            <Button disabled className="border-gray-300 text-gray-400">
              Ver Agenda
            </Button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-rose-400 rounded-2xl p-8 text-white text-center">
          <Users className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Junte-se à nossa comunidade!</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Faça parte de um grupo de mulheres que se apoiam mutuamente na jornada fitness.
          </p>
          <Button asChild variant="secondary" className="bg-white text-pink-500 font-bold rounded-full px-8 py-4 h-auto shadow-lg hover:bg-gray-100">
            <Link to="/signup">Criar Conta Grátis</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;