/*
 * script.js
 *
 * Este arquivo implementa a interatividade da plataforma
 * Imunologia Interativa. É responsável por renderizar os flashcards,
 * carregar o banco de questões (questoes.json), construir quizzes
 * individuais por módulo e o gerador de prova simulada. Todo o
 * código utiliza JavaScript ES6 e não depende de bibliotecas externas.
 */

document.addEventListener('DOMContentLoaded', () => {
  /*
   * embeddedQuestions
   *
   * Caso o carregamento do arquivo questoes.json falhe (por exemplo,
   * quando o site é aberto diretamente via file://), utilizamos este
   * objeto embutido como fallback. Ele contém o mesmo conteúdo de
   * questoes.json e serve como banco de questões para quizzes e
   * simulado.
   */
  const embeddedQuestions = [
    {"modulo":1,"nivel":"Basico","caso":"Um estudante de medicina revisa a ontogenia dos linfócitos.","comando":"Em qual órgão ocorre a maturação dos linfócitos T?","alternativas":{"A":"Baço","B":"Timo","C":"Medula óssea","D":"Linfonodo","E":"Fígado"},"correta":"B"},
    {"modulo":1,"nivel":"Basico","caso":"Durante uma aula sobre órgãos linfoides, foi mencionado um tecido responsável por filtrar sangue e remover hemácias envelhecidas.","comando":"Qual é o órgão secundário descrito?","alternativas":{"A":"Baço","B":"Timo","C":"Medula óssea","D":"Apêndice","E":"Tonsila palatina"},"correta":"A"},
    {"modulo":1,"nivel":"Basico","caso":"Uma infecção invasiva ativa células do sistema imune inato.","comando":"Qual célula é um fagócito de vida longa residente em tecidos?","alternativas":{"A":"Eosinófilo","B":"Neutrófilo","C":"Macrófago","D":"Basófilo","E":"Mastócito"},"correta":"C"},
    {"modulo":1,"nivel":"Intermediario","caso":"Após reconhecer um patógeno, certos receptores intracelulares detectam RNA viral e induzem produção de interferons.","comando":"Qual receptor participa desse processo?","alternativas":{"A":"TLR4","B":"RIG-like","C":"MHC I","D":"IL-2 receptor","E":"CD28"},"correta":"B"},
    {"modulo":1,"nivel":"Intermediario","caso":"Uma proteína sérica marca a superfície de uma bactéria para facilitar a fagocitose.","comando":"Qual molécula do sistema complemento exerce essa função?","alternativas":{"A":"C3a","B":"C5a","C":"C1q","D":"C3b","E":"C9"},"correta":"D"},
    {"modulo":1,"nivel":"Intermediario","caso":"Um antígeno pequeno não imunogênico torna-se capaz de induzir resposta ao ser conjugado a uma proteína.","comando":"Como se denomina esse tipo de molécula?","alternativas":{"A":"Epítopo","B":"Hapteno","C":"Parátopo","D":"Adjuvante","E":"Citoquina"},"correta":"B"},
    {"modulo":1,"nivel":"Avancado","caso":"Pesquisadores avaliam a diversidade de receptores de células B e T responsáveis pelo reconhecimento de antígenos.","comando":"Qual mecanismo molecular gera essa diversidade?","alternativas":{"A":"Mutação somática somente em células B","B":"Geração espontânea de genes","C":"Recombinação somática de segmentos gênicos (V(D)J)","D":"Conjugação plasmídica","E":"Fenômeno de epigenética de cromatina"},"correta":"C"},
    {"modulo":1,"nivel":"Avancado","caso":"Durante uma infecção bacteriana, linfócitos B são ativados independentemente de T.","comando":"Que tipo de antígeno pode desencadear essa ativação T-independente?","alternativas":{"A":"Proteínas solúveis","B":"Polissacarídeos repetitivos como do capsular","C":"Lipídios simples","D":"Peptídeos ligados a MHC","E":"DNA viral"},"correta":"B"},
    {"modulo":1,"nivel":"Avancado","caso":"Um anticorpo apresenta forte atividade de neutralização e possui maior meia-vida em circulação.","comando":"Qual classe de imunoglobulina provavelmente está descrita?","alternativas":{"A":"IgM","B":"IgG","C":"IgA","D":"IgE","E":"IgD"},"correta":"B"},
    {"modulo":1,"nivel":"Avancado","caso":"Durante a apresentação de antígeno, linfócitos B reconhecem antígenos nativos enquanto linfócitos T reconhecem peptídeos processados.","comando":"Qual molécula apresenta peptídeos para linfócitos T auxiliares (CD4+)?","alternativas":{"A":"MHC classe I","B":"MHC classe II","C":"BCR de membrana","D":"CD80","E":"TCR"},"correta":"B"},
    {"modulo":2,"nivel":"Basico","caso":"Após uma lesão cutânea em Campina Grande, observa-se rubor, calor e edema no local.","comando":"Qual grupo de mediadores químicos é responsável pela vasodilatação inicial e aumento de permeabilidade vascular?","alternativas":{"A":"Interleucinas anti-inflamatórias","B":"Prostaglandinas e histamina","C":"Anticorpos IgA","D":"Perforinas e granzimas","E":"Moléculas de adesão integrinas"},"correta":"B"},
    {"modulo":2,"nivel":"Basico","caso":"Nos primeiros minutos após uma infecção bacteriana, células sanguíneas migram rapidamente para o tecido afetado.","comando":"Qual leucócito é o primeiro a chegar em maior número ao foco de infecção aguda?","alternativas":{"A":"Eosinófilo","B":"Macrófago","C":"Neutrófilo","D":"Linfócito B","E":"Basófilo"},"correta":"C"},
    {"modulo":2,"nivel":"Basico","caso":"Um complexo imunológico ativa a cascata de complementos.","comando":"Qual via do sistema complemento é ativada por anticorpos IgM ou IgG ligados ao antígeno?","alternativas":{"A":"Via alternativa","B":"Via da lectina","C":"Via clássica","D":"Via terminal","E":"Via MAC"},"correta":"C"},
    {"modulo":2,"nivel":"Intermediario","caso":"Um paciente apresenta deficiência genética no componente C3 do complemento.","comando":"Qual função do sistema complemento estará mais comprometida?","alternativas":{"A":"Fagocitose por opsonização","B":"Produção de histamina","C":"Apresentação de antígenos","D":"Mudança de classe de anticorpos","E":"Produção de interferon"},"correta":"A"},
    {"modulo":2,"nivel":"Intermediario","caso":"A pele secreta β-defensinas e catelicidinas.","comando":"Qual é a principal função desses peptídeos antimicrobianos?","alternativas":{"A":"Ativar linfócitos T","B":"Neutralizar toxinas bacterianas","C":"Perfurar membranas de microrganismos","D":"Inibir a liberação de histamina","E":"Bloquear a síntese proteica viral"},"correta":"C"},
    {"modulo":2,"nivel":"Intermediario","caso":"Durante a fagocitose, após o neutrófilo englobar a bactéria, ocorre a fusão com grânulos lisossômicos.","comando":"Como é denominado o compartimento resultante dessa fusão?","alternativas":{"A":"Phagolisossomo","B":"Endossomo precoce","C":"Fagossomo","D":"Lisossoma","E":"Corpo residual"},"correta":"A"},
    {"modulo":2,"nivel":"Avancado","caso":"Em indivíduos com síndrome de deficiência de adesão leucocitária tipo I, os neutrófilos não conseguem atravessar o endotélio durante a inflamação.","comando":"Qual etapa da migração leucocitária está defeituosa nesses pacientes?","alternativas":{"A":"Rolagem mediada por selectinas","B":"Aderência firme mediada por integrinas","C":"Diapedese através de junções","D":"Quimiotaxia para o tecido","E":"Degranulação citotóxica"},"correta":"B"},
    {"modulo":2,"nivel":"Avancado","caso":"A via alternativa do complemento é constantemente ativada em baixas quantidades.","comando":"Qual mecanismo impede que ela danifique células do hospedeiro?","alternativas":{"A":"Produção de anticorpos naturais","B":"Fatores reguladores como fator H e fator I que inativam C3b na superfície própria","C":"Ausência de C9","D":"Altas concentrações de anticorpos IgA","E":"Sequestro de ferro pela transferrina"},"correta":"B"},
    {"modulo":2,"nivel":"Avancado","caso":"Durante uma infecção fúngica invasiva no pulmão, a resposta imune inata tenta conter o crescimento.","comando":"Qual subpopulação de linfócitos T auxiliares secreta IL‑17 para recrutar neutrófilos nesses casos?","alternativas":{"A":"Th1","B":"Th2","C":"Th17","D":"Treg","E":"Follicular T helper (Tfh)"},"correta":"C"},
    {"modulo":2,"nivel":"Avancado","caso":"Células NK monitoram continuamente células no organismo.","comando":"Qual sinal suprime a ativação de células NK ao interagir com receptores inibitórios?","alternativas":{"A":"Alta expressão de MHC classe I próprio","B":"Presença de anticorpos IgE","C":"Produção de IL-4","D":"Complexos imunológicos circulantes","E":"Fragmentos de C5a"},"correta":"A"},
    {"modulo":3,"nivel":"Basico","caso":"Ao estudar apresentação antigênica, um estudante questiona onde se encontra o MHC classe I.","comando":"Em qual tipo de célula o MHC classe I é expresso constitutivamente?","alternativas":{"A":"Somente linfócitos B","B":"Apenas células apresentadoras de antígeno","C":"Todas as células nucleadas do organismo","D":"Apenas células da medula óssea","E":"Apenas células epiteliais intestinais"},"correta":"C"},
    {"modulo":3,"nivel":"Basico","caso":"Após reconhecer um antígeno apresentado por MHC classe I, um linfócito T se torna efetor.","comando":"Qual é a principal função do linfócito T CD8+ efetor?","alternativas":{"A":"Secreção de anticorpos","B":"Ativação de eosinófilos","C":"Indução de apoptose em células alvo por perforinas e granzimas","D":"Produção de IL-4 para ajudar linfócitos B","E":"Supressão da resposta imune"},"correta":"C"},
    {"modulo":3,"nivel":"Basico","caso":"Em resposta à vacina contra hepatite B, células específicas proliferam e se diferenciam em plasmócitos.","comando":"Qual tipo de célula é responsável pela produção de anticorpos circulantes?","alternativas":{"A":"Linfócito T CD4+","B":"Linfócito T CD8+","C":"Macrófago","D":"Linfócito B/plasmócito","E":"Célula dendrítica"},"correta":"D"},
    {"modulo":3,"nivel":"Intermediario","caso":"A ativação completa de linfócitos T requer um segundo sinal fornecido pela interação de moléculas coestimuladoras.","comando":"Qual par de moléculas representa uma interação coestimuladora essencial?","alternativas":{"A":"TCR–MHC II","B":"CD28–B7 (CD80/CD86)","C":"CD40–CD40L","D":"LFA-1–ICAM-1","E":"BCR–CD79"},"correta":"B"},
    {"modulo":3,"nivel":"Intermediario","caso":"Durante uma resposta imune a helmintos, a produção de IgE é acentuada.","comando":"Qual citocina liberada por linfócitos T auxiliares do tipo Th2 promove a mudança de classe para IgE em linfócitos B?","alternativas":{"A":"IL-2","B":"IFN-γ","C":"IL-4","D":"IL-17","E":"IL-10"},"correta":"C"},
    {"modulo":3,"nivel":"Intermediario","caso":"Para evitar autoimunidade, linfócitos autoreativos são eliminados durante o desenvolvimento.","comando":"Qual processo remove linfócitos T com alta afinidade por antígenos próprios no timo?","alternativas":{"A":"Anergização periférica","B":"Seleção negativa","C":"Recombinação V(D)J","D":"Switch de classe","E":"Mimetismo molecular"},"correta":"B"},
    {"modulo":3,"nivel":"Avancado","caso":"Algumas células apresentadoras de antígenos são capazes de apresentar peptídeos de origem extracelular via MHC I para linfócitos CD8+.","comando":"Como se denomina esse processo?","alternativas":{"A":"Tolerância central","B":"Cross-presentation (apresentação cruzada)","C":"Editing","D":"Cooperação T–B","E":"Imunossupressão"},"correta":"B"},
    {"modulo":3,"nivel":"Avancado","caso":"A diferença na polarização de linfócitos T auxiliares afeta o controle de infecções.","comando":"Qual perfil de subpopulação é mais eficaz contra infecções intracelulares por microrganismos como Mycobacterium tuberculosis?","alternativas":{"A":"Th2","B":"Th1","C":"Th17","D":"Treg","E":"Th9"},"correta":"B"},
    {"modulo":3,"nivel":"Avancado","caso":"Pacientes submetidos a terapias para aumentar Treg podem apresentar menor incidência de rejeição de transplantes.","comando":"Qual mecanismo as células T reguladoras utilizam para suprimir a ativação de outros linfócitos?","alternativas":{"A":"Produção de IL-2 e proliferação","B":"Liberação de perforinas","C":"Secreção de citocinas imunossupressoras como IL-10 e TGF-β","D":"Aumentar a expressão de MHC I","E":"Produção de anticorpos IgM"},"correta":"C"},
    {"modulo":3,"nivel":"Avancado","caso":"Após a resolução de uma infecção viral, algumas células persistem e respondem rapidamente a uma nova exposição ao mesmo vírus.","comando":"Qual propriedade define as células de memória em relação às células naïve?","alternativas":{"A":"Dependência de coestímulo para ativação","B":"Tempo de vida curto","C":"Maior afinidade do receptor e resposta mais rápida e vigorosa","D":"Restrição a tecidos linfóides centrais apenas","E":"Ausência de MHC na superfície"},"correta":"C"},
    {"modulo":4,"nivel":"Basico","caso":"Após picada de mosquito Aedes em João Pessoa, um paciente desenvolve febre, mialgia e exantema.","comando":"Qual arbovírus é endêmico e frequentemente associado a febre hemorrágica na região?","alternativas":{"A":"Zika","B":"Dengue","C":"Chikungunya","D":"Influenza","E":"SARS-CoV-2"},"correta":"B"},
    {"modulo":4,"nivel":"Basico","caso":"Criança recebe vacina de vírus atenuado contra sarampo.","comando":"Qual tipo de imunidade é induzida por essa vacinação?","alternativas":{"A":"Passiva artificial","B":"Ativa artificial","C":"Ativa natural","D":"Passiva natural","E":"Inata"},"correta":"B"},
    {"modulo":4,"nivel":"Basico","caso":"Paciente desenvolve urticária generalizada minutos após ingestão de camarão.","comando":"Qual tipo de hipersensibilidade está ocorrendo?","alternativas":{"A":"Tipo I (imediata)","B":"Tipo II (citotóxica)","C":"Tipo III (imunocomplexos)","D":"Tipo IV (tardia)","E":"Tipo V (estimuladora)"},"correta":"A"},
    {"modulo":4,"nivel":"Intermediario","caso":"Um adulto com lúpus eritematoso sistêmico apresenta depósitos de imunocomplexos em rins.","comando":"Qual tipo de hipersensibilidade explica essa patologia?","alternativas":{"A":"Tipo I","B":"Tipo II","C":"Tipo III","D":"Tipo IV","E":"Tipo V"},"correta":"C"},
    {"modulo":4,"nivel":"Intermediario","caso":"Uma transfusão de sangue ABO-incompatível causa lise das hemácias do receptor.","comando":"Qual mecanismo imune classifica-se nesse tipo de reação?","alternativas":{"A":"Tipo I","B":"Tipo II","C":"Tipo III","D":"Tipo IV","E":"Anérgico"},"correta":"B"},
    {"modulo":4,"nivel":"Intermediario","caso":"Indivíduo com HIV apresenta CD4+ <200 células/µL e infecções oportunistas frequentes.","comando":"Qual categoria de imunodeficiência descreve esse quadro?","alternativas":{"A":"Primária","B":"Secundária (adquirida)","C":"Genética","D":"Autoimune","E":"Iatrogenia por imunossupressores"},"correta":"B"},
    {"modulo":4,"nivel":"Avancado","caso":"Paciente com anemia hemolítica autoimune produz IgG contra antígenos de suas próprias hemácias.","comando":"A que tipo de hipersensibilidade pertence essa doença?","alternativas":{"A":"Tipo I","B":"Tipo II","C":"Tipo III","D":"Tipo IV","E":"Não é hipersensibilidade"},"correta":"B"},
    {"modulo":4,"nivel":"Avancado","caso":"Durante um transplante renal, linfócitos do receptor reconhecem antígenos do enxerto diretamente na superfície de células do doador.","comando":"Como é chamada essa via de reconhecimento de aloantígenos?","alternativas":{"A":"Via indiret","B":"Via direta","C":"Via semi-direta","D":"Via cruzada","E":"Cross-presentation"},"correta":"B"},
    {"modulo":4,"nivel":"Avancado","caso":"Recém-nascido em João Pessoa apresenta petéquias e baixa contagem de plaquetas após infecção viral congênita por Zika.","comando":"Qual principal mecanismo de patogênese explica a microcefalia observada nesses casos?","alternativas":{"A":"Lesão neuronal devido a autoanticorpos maternos","B":"Deficiência de complemento C1","C":"Infecção e destruição de células progenitoras neurais pelo vírus","D":"Reação de hipersensibilidade tipo IV","E":"Defeito na tolerância central"},"correta":"C"},
    {"modulo":4,"nivel":"Avancado","caso":"Durante surto de leishmaniose tegumentar no sertão paraibano, pacientes desenvolvem lesões cutâneas crônicas.","comando":"Qual resposta imune adaptativa é crítica para eliminar Leishmania dentro de macrófagos?","alternativas":{"A":"Produção de IL-4 e IgE por Th2","B":"Ativação de eosinófilos por IL-5","C":"Produção de IFN-γ por Th1 para ativar macrófagos","D":"Resposta humoral de anticorpos IgM","E":"Ação citotóxica direta de NK"},"correta":"C"}
  ];
  /* ------------------------------------------------------------------
   * Carregamento de dados
   *
   * Carregamos inicialmente o arquivo JSON de questões de forma
   * assíncrona e armazenamos em uma variável global `questionsData`.
   */
  // Inicialmente, preenchemos questionsData com as questões embarcadas. Se
  // o carregamento via fetch for bem‑sucedido, esse array será
  // substituído pelos dados vindos de questoes.json. Dessa forma, as
  // funcionalidades de quiz e simulado funcionam mesmo antes da
  // resolução da promessa de fetch.
  let questionsData = embeddedQuestions.slice();
  /*
   * Tentamos carregar o arquivo questoes.json pelo método fetch. Quando a
   * plataforma é hospedada via HTTP (por exemplo, no GitHub Pages), o
   * carregamento ocorrerá normalmente. Todavia, ao abrir diretamente via
   * protocolo file:// em alguns navegadores, o fetch de arquivos locais
   * pode falhar por restrições de segurança. Nesse caso, usamos um
   * fallback com os dados embutidos na constante `embeddedQuestions`.
   */
  fetch('questoes.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Não foi possível carregar o arquivo');
      }
      return response.json();
    })
    .then((data) => {
      questionsData = data;
    })
    .catch((error) => {
      console.warn('Falha ao carregar questoes.json, usando fallback embutido.', error);
      questionsData = embeddedQuestions;
    });

  /* ------------------------------------------------------------------
   * Flashcards
   *
   * Definimos um conjunto de flashcards para cada tópico. Cada
   * entrada no objeto `flashcards` possui um identificador (id do
   * artigo correspondente) e um array de objetos com o texto da
   * frente e do verso. Estes cartões resumem conceitos chave para
   * revisão rápida.
   */
  const flashcards = {
    mod1_org: [
      {
        front: 'Órgãos linfoides primários',
        back: 'Medula óssea: origem de todas as células sanguíneas.\nTimo: maturação dos linfócitos T.'
      },
      {
        front: 'Órgãos linfoides secundários',
        back: 'Linfonodos, baço, amígdalas e MALT concentram linfócitos maduros para encontros com antígenos.'
      },
      {
        front: 'Macrófagos vs. Neutrófilos',
        back: 'Macrófagos residem nos tecidos e removem detritos; neutrófilos são abundantes no sangue e migram rapidamente para infecções.'
      },
      {
        front: 'Células dendríticas',
        back: 'Capturam antígenos em tecidos e apresentam peptídeos via MHC II a linfócitos T auxiliares.'
      },
      {
        front: 'Células NK',
        back: 'Reconhecem células com baixo MHC I e induzem apoptose por liberação de perforinas e granzimas.'
      }
    ],
    mod1_mol: [
      {
        front: 'Receptores de reconhecimento',
        back: 'TLRs, NOD-like e RIG-like detectam padrões moleculares de patógenos e iniciam respostas inatas.'
      },
      {
        front: 'Citocinas',
        back: 'Proteínas secretadas que modulam a atividade de outras células, como interleucinas e interferons.'
      },
      {
        front: 'Quimiocinas',
        back: 'Citocinas que direcionam a migração de células imunes para locais de infecção (quimiotaxia).'
      },
      {
        front: 'Sistema complemento',
        back: 'Cascata de >20 proteínas que opsonizam microrganismos, geram anafilotoxinas e formam o complexo de ataque à membrana.'
      },
      {
        front: 'Receptores de linfócitos',
        back: 'BCR reconhece antígenos nativos; TCR reconhece peptídeos apresentados por MHC.'
      }
    ],
    mod1_ag_ac: [
      {
        front: 'Antígeno',
        back: 'Molécula reconhecida como não‑própria que se liga a receptores imunes e desencadeia resposta adaptativa.'
      },
      {
        front: 'Anticorpo',
        back: 'Imunoglobulina produzida por plasmócitos com duas cadeias pesadas e duas leves; neutraliza e opsoniza.'
      },
      {
        front: 'Hapteno',
        back: 'Molécula de baixo peso que só se torna imunogênica quando conjugada a um carreador.'
      },
      {
        front: 'Classes de imunoglobulinas',
        back: 'IgM, IgG, IgA, IgE, IgD – cada uma com funções distintas (neutralização, opsonização, ativação de complemento, etc.).'
      }
    ],
    mod2_bar: [
      {
        front: 'Função da pele',
        back: 'Barreira física de células queratinizadas e secreções sebáceas que impede a entrada de microrganismos.'
      },
      {
        front: 'Lisozima e fosfolipase A2',
        back: 'Enzimas presentes em secreções (lágrimas, saliva, muco) que degradam componentes da parede bacteriana.'
      },
      {
        front: 'Microbiota comensal',
        back: 'Compete com patógenos por nutrientes e impede sua colonização; modula o pH e o sistema imune.'
      },
      {
        front: 'Peptídeos antimicrobianos',
        back: 'Defensinas e outras pequenas proteínas que perfuram membranas de microrganismos.'
      }
    ],
    mod2_comp: [
      {
        front: 'Ativação clássica do complemento',
        back: 'Dependente de anticorpos ligados ao antígeno que recrutam C1q para iniciar a cascata.'
      },
      {
        front: 'Via alternativa',
        back: 'Ocorre espontaneamente na superfície de patógenos; depende de C3 e fator B.'
      },
      {
        front: 'Função de C3b',
        back: 'Opsoniza microrganismos facilitando a fagocitose por neutrófilos e macrófagos.'
      },
      {
        front: 'Anafilotoxinas',
        back: 'Fragmentos C3a e C5a que aumentam permeabilidade vascular e recrutam leucócitos.'
      },
      {
        front: 'MAC (Complexo de ataque à membrana)',
        back: 'Estrutura formada por C5b‑C9 que cria poros em membranas de células alvo, causando lise.'
      }
    ],
    mod2_fag: [
      {
        front: 'Processo de fagocitose',
        back: '1. Reconhecimento do alvo; 2. Englobamento e formação do fagossomo; 3. Fusão com lisossomos para digestão.'
      },
      {
        front: 'Quimiotaxia',
        back: 'Migração de células (especialmente neutrófilos) para o local de infecção em resposta a quimiocinas.'
      },
      {
        front: 'Inflamação',
        back: 'Caracterizada por rubor, calor, dor e edema, resultante de vasodilatação e aumento de permeabilidade.'
      },
      {
        front: 'Macrófagos versus neutrófilos',
        back: 'Macrófagos são fagócitos de vida longa residentes nos tecidos; neutrófilos são células de resposta rápida circulantes.'
      }
    ],
    mod2_dc_nk: [
      {
        front: 'Células dendríticas',
        back: 'Fagócitos profissionais que apresentam antígenos via MHC II para linfócitos T CD4+.'
      },
      {
        front: 'Células NK',
        back: 'Detectam células sem MHC I (sinal de ausência) e induzem apoptose por perforina e granzima.'
      },
      {
        front: 'Pontes inata‑adaptativa',
        back: 'Dendríticas migram para linfonodos após captura antigênica e iniciam a resposta adaptativa.'
      }
    ],
    mod3_mhc: [
      {
        front: 'MHC Classe I',
        back: 'Expresso em todas as células nucleadas; apresenta peptídeos endógenos a linfócitos CD8+.'
      },
      {
        front: 'MHC Classe II',
        back: 'Expresso em células apresentadoras de antígeno; apresenta peptídeos exógenos a linfócitos CD4+.'
      },
      {
        front: 'Co‑receptores CD4/CD8',
        back: 'Auxiliam na estabilização da interação TCR‑MHC e definem a subpopulação de linfócitos T.'
      },
      {
        front: 'Processamento de antígenos',
        back: 'Inclui degradação proteica, transporte para o retículo endoplasmático e acoplamento ao MHC.'
      }
    ],
    mod3_t: [
      {
        front: 'Linfócitos citotóxicos (CD8+)',
        back: 'Eliminam células infectadas ao liberar perforina e granzimas que induzem apoptose.'
      },
      {
        front: 'Subtipos CD4+',
        back: 'Th1 estimula imunidade celular; Th2 promove resposta humoral; Th17 recruta neutrófilos; Treg suprime autoimunidade.'
      },
      {
        front: 'Sinalização co‑estimuladora',
        back: 'Além do reconhecimento TCR‑MHC, sinais de moléculas como CD28 e B7 são necessários para ativação plena.'
      },
      {
        front: 'Memória T',
        back: 'Células T de memória surgem após a resposta primária e respondem de forma mais rápida a reexposições.'
      }
    ],
    mod3_b: [
      {
        front: 'Ativação de linfócitos B',
        back: 'Requer reconhecimento de antígeno via BCR e ajuda de linfócitos T CD4+ (CD40L e citocinas).'
      },
      {
        front: 'Plasmócitos',
        back: 'Células efectoras derivadas de linfócitos B que secretam grandes quantidades de anticorpos.'
      },
      {
        front: 'Células de memória B',
        back: 'Persistem no organismo após a infecção e produzem resposta mais rápida e eficaz na próxima exposição.'
      },
      {
        front: 'Mudança de classe',
        back: 'Processo guiado por citocinas que altera a classe de IgM para IgG, IgA ou IgE para funções específicas.'
      }
    ],
    mod3_tol: [
      {
        front: 'Tolerância central',
        back: 'Eliminação ou redirecionamento de linfócitos auto‑reativos durante o desenvolvimento no timo e na medula óssea.'
      },
      {
        front: 'Tolerância periférica',
        back: 'Mecanismos como anergia, supressão por Treg e deleção clonal impedem autoimunidade fora dos órgãos linfoides.'
      },
      {
        front: 'Quebra de tolerância',
        back: 'Fatores genéticos, infecções ou inflamação podem desencadear autoimunidade quando a tolerância falha.'
      }
    ],
    mod4_inf: [
      {
        front: 'Respostas antivirais',
        back: 'Produção de interferons, ativação de NK e linfócitos CD8+ para eliminar células infectadas.'
      },
      {
        front: 'Infecções bacterianas',
        back: 'Desencadeiam complemento, fagocitose e anticorpos opsonizantes para neutralização e lise.'
      },
      {
        front: 'Infecções fúngicas',
        back: 'Dependem de neutrófilos e respostas Th17 com produção de IL‑17.'
      },
      {
        front: 'Infecções parasitárias',
        back: 'Helmintos induzem resposta Th2, IgE e ativação de eosinófilos e mastócitos.'
      },
      {
        front: 'Doenças arbovirais no NE',
        back: 'Dengue, Zika e chikungunya são transmitidas por Aedes; esforços de controle vetorial reduzem incidência.'
      }
    ],
    mod4_hip: [
      {
        front: 'Hipersensibilidade Tipo I',
        back: 'Anafilática, mediada por IgE e degranulação de mastócitos; início rápido.'
      },
      {
        front: 'Hipersensibilidade Tipo II',
        back: 'Mediada por IgG/IgM contra antígenos próprios; desencadeia citotoxicidade e complemento.'
      },
      {
        front: 'Hipersensibilidade Tipo III',
        back: 'Depósito de imunocomplexos em tecidos, ativando complemento e inflamação.'
      },
      {
        front: 'Hipersensibilidade Tipo IV',
        back: 'Mediada por linfócitos T e ocorre horas após exposição; exemplo: dermatite de contato.'
      }
    ],
    mod4_auto: [
      {
        front: 'Autoimunidade',
        back: 'Perda da tolerância ao próprio, levando a produção de autoanticorpos e linfócitos auto‑reativos.'
      },
      {
        front: 'Fatores de risco',
        back: 'Genética, infecções, hormônios e danos teciduais podem desencadear doenças autoimunes.'
      },
      {
        front: 'Exemplos',
        back: 'Tireoidite de Hashimoto, artrite reumatoide, diabetes tipo 1, lúpus eritematoso sistêmico.'
      }
    ],
    mod4_def: [
      {
        front: 'Imunodeficiência primária',
        back: 'Distúrbio genético com defeito em componente imune; exemplo: SCID (deficiência combinada severa).'
      },
      {
        front: 'Imunodeficiência secundária',
        back: 'Adquirida; causada por infecções (HIV/AIDS), desnutrição, envelhecimento ou imunossupressores.'
      },
      {
        front: 'Consequências',
        back: 'Predisposição a infecções oportunistas e tumores devido à incapacidade de montar resposta efetiva.'
      }
    ],
    mod4_trans: [
      {
        front: 'Rejeição hiperaguda',
        back: 'Ocorre minutos após transplante quando anticorpos pré‑formados atacam o enxerto.'
      },
      {
        front: 'Rejeição aguda',
        back: 'Mediada por linfócitos T que reconhecem antígenos do enxerto; ocorre dias a semanas após cirurgia.'
      },
      {
        front: 'Imunossupressores',
        back: 'Medicamentos (ciclosporina, glucocorticoides) que inibem respostas imunes para prevenir rejeição.'
      },
      {
        front: 'Vigilância imunológica',
        back: 'Sistema imune reconhece e elimina células tumorais; tumores podem escapar por evasão de MHC I.'
      }
    ],
    mod4_vac: [
      {
        front: 'Vacinas atenuadas',
        back: 'Contêm microrganismos vivos enfraquecidos; induzem forte imunidade com risco mínimo de doença.'
      },
      {
        front: 'Vacinas inativadas',
        back: 'Contêm microrganismos mortos ou partículas virais; requerem doses múltiplas para proteção.'
      },
      {
        front: 'Adjuvantes',
        back: 'Substâncias que intensificam a resposta imune, como hidróxido de alumínio ou saponinas.'
      },
      {
        front: 'Vacinas de subunidades',
        back: 'Usam componentes purificados de um patógeno (proteínas, toxoides), frequentemente combinadas a adjuvantes.'
      }
    ]
  };

  /**
   * Renderiza os flashcards em cada contêiner .flashcards na página.
   */
  function renderFlashcards() {
    const containers = document.querySelectorAll('.flashcards');
    containers.forEach((container) => {
      const topic = container.dataset.topic;
      const cards = flashcards[topic] || [];
      cards.forEach((card) => {
        const cardEl = document.createElement('div');
        cardEl.classList.add('flashcard');
        // Criar faces
        const frontEl = document.createElement('div');
        frontEl.classList.add('front');
        frontEl.textContent = card.front;
        const backEl = document.createElement('div');
        backEl.classList.add('back');
        backEl.textContent = card.back;
        cardEl.appendChild(frontEl);
        cardEl.appendChild(backEl);
        // Alternar viragem ao clicar
        cardEl.addEventListener('click', () => {
          cardEl.classList.toggle('flipped');
        });
        container.appendChild(cardEl);
      });
    });
  }

  /**
   * Embaralha um array (algoritmo de Fisher–Yates) e retorna cópia.
   * @param {Array} array
   * @returns {Array}
   */
  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  /**
   * Constrói e exibe um quiz de módulo específico.
   * @param {number} modulo Número do módulo (1–4)
   * @param {string} nivel Dificuldade (Basico, Intermediario, Avancado)
   * @param {HTMLElement} container Elemento onde o quiz será renderizado
   */
  function buildQuiz(modulo, nivel, container) {
    container.innerHTML = '';
    // Filtrar questões por módulo e nível
    const filtered = questionsData.filter((q) => q.modulo === modulo && q.nivel === nivel);
    if (filtered.length === 0) {
      container.textContent = 'Nenhuma questão disponível para esta seleção.';
      return;
    }
    // Selecionar até 5 questões aleatórias
    const questions = shuffle(filtered).slice(0, Math.min(5, filtered.length));
    // Armazenar respostas corretas
    const answers = [];
    questions.forEach((q, index) => {
      answers.push(q.correta);
      const qDiv = document.createElement('div');
      qDiv.classList.add('question');
      const pCase = document.createElement('p');
      pCase.textContent = q.caso;
      const pComando = document.createElement('p');
      // Utilizar innerHTML para incluir a parte do comando em negrito
      pComando.innerHTML = `<strong>${q.comando}</strong>`;
      qDiv.appendChild(pCase);
      qDiv.appendChild(pComando);
      // Opções
      const optionsDiv = document.createElement('div');
      optionsDiv.classList.add('options');
      ['A','B','C','D','E'].forEach((letter) => {
        const optLabel = document.createElement('label');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `q${index}`;
        radio.value = letter;
        optLabel.appendChild(radio);
        optLabel.insertAdjacentText('beforeend', ` ${letter}) ${q.alternativas[letter]}`);
        optionsDiv.appendChild(optLabel);
      });
      qDiv.appendChild(optionsDiv);
      container.appendChild(qDiv);
    });
    // Botão de envio
    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Enviar Quiz';
    submitBtn.style.marginTop = '1rem';
    submitBtn.classList.add('start-quiz');
    container.appendChild(submitBtn);
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('quiz-result');
    container.appendChild(resultDiv);
    submitBtn.addEventListener('click', () => {
      // Calcular pontuação
      let correctCount = 0;
      questions.forEach((q, idx) => {
        const checked = container.querySelector(`input[name="q${idx}"]:checked`);
        if (checked && checked.value === answers[idx]) {
          correctCount++;
        }
      });
      resultDiv.textContent = `Você acertou ${correctCount} de ${questions.length} questões.`;
      resultDiv.style.display = 'block';
    });
  }

  /**
   * Configura eventos dos quizzes nos quatro módulos.
   */
  function setupQuizzes() {
    const quizDivs = document.querySelectorAll('.quiz');
    quizDivs.forEach((quizDiv) => {
      const modulo = parseInt(quizDiv.dataset.module, 10);
      const startBtn = quizDiv.querySelector('button.start-quiz');
      const nivelSelect = quizDiv.querySelector('.nivel');
      const container = quizDiv.querySelector('.quiz-container');
      startBtn.addEventListener('click', () => {
        const nivel = nivelSelect.value;
        buildQuiz(modulo, nivel, container);
      });
    });
  }

  /**
   * Renderiza o exame simulado a partir de módulos selecionados.
   * @param {Array<number>} modulos Lista de módulos selecionados
   */
  function renderSimulado(modulos) {
    const container = document.getElementById('simulado-container');
    container.innerHTML = '';
    // Filtrar questões que pertencem aos módulos selecionados
    const pool = questionsData.filter((q) => modulos.includes(q.modulo));
    if (pool.length === 0) {
      container.textContent = 'Nenhuma questão disponível para os módulos selecionados.';
      return;
    }
    const selected = shuffle(pool).slice(0, Math.min(10, pool.length));
    const answers = [];
    selected.forEach((q, index) => {
      answers.push(q.correta);
      const qDiv = document.createElement('div');
      qDiv.classList.add('question');
      const pCase = document.createElement('p');
      pCase.textContent = q.caso;
      const pComando = document.createElement('p');
      pComando.innerHTML = `<strong>${q.comando}</strong>`;
      qDiv.appendChild(pCase);
      qDiv.appendChild(pComando);
      const optionsDiv = document.createElement('div');
      optionsDiv.classList.add('options');
      ['A','B','C','D','E'].forEach((letter) => {
        const optLabel = document.createElement('label');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = `simq${index}`;
        radio.value = letter;
        optLabel.appendChild(radio);
        optLabel.insertAdjacentText('beforeend', ` ${letter}) ${q.alternativas[letter]}`);
        optionsDiv.appendChild(optLabel);
      });
      qDiv.appendChild(optionsDiv);
      container.appendChild(qDiv);
    });
    // Botão de envio
    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'Enviar Prova';
    submitBtn.style.marginTop = '1rem';
    submitBtn.classList.add('start-quiz');
    container.appendChild(submitBtn);
    const resultDiv = document.createElement('div');
    resultDiv.classList.add('quiz-result');
    container.appendChild(resultDiv);
    submitBtn.addEventListener('click', () => {
      let correctCount = 0;
      selected.forEach((q, idx) => {
        const checked = container.querySelector(`input[name="simq${idx}"]:checked`);
        if (checked && checked.value === answers[idx]) {
          correctCount++;
        }
      });
      resultDiv.textContent = `Você acertou ${correctCount} de ${selected.length} questões.`;
      resultDiv.style.display = 'block';
    });
  }

  /**
   * Configura o modal de simulado e seu formulário.
   */
  function setupSimulado() {
    const modal = document.getElementById('modal-simulado');
    const openBtn = document.getElementById('btn-open-modal');
    const closeBtn = document.getElementById('fechar-modal');
    const form = document.getElementById('form-simulado');
    // Abrir modal
    openBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });
    // Fechar modal
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
    // Fechar modal clicando fora do conteúdo
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
    // Submissão do formulário de seleção de módulos
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const selecionados = [];
      const checkboxes = form.querySelectorAll('input[name="modulo"]');
      checkboxes.forEach((cb) => {
        if (cb.checked) {
          selecionados.push(parseInt(cb.value, 10));
        }
      });
      if (selecionados.length === 0) {
        alert('Selecione pelo menos um módulo para gerar a prova.');
        return;
      }
      modal.classList.add('hidden');
      renderSimulado(selecionados);
    });
  }

  // Execução inicial
  renderFlashcards();
  setupQuizzes();
  setupSimulado();
});