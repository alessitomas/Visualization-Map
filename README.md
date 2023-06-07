# PTV-SP

Autores: Enzo Quental, Esdras Gomes, Júlia Karine, Júlia Paiva, Tomás Alessi

# Descrição 

O PTV-SP é uma ferramenta de análise origem-destino, para visualizar o deslocamento de professores na cidade de São Paulo. Com ela, é possível:
 
- analisar rotas de deslocamento dos professores;
- visualizar meios de transporte utilizados;
- encontrar o tempo médio que o docente leva para chegar até a escola;
- detectar deslocamentos de grupos;
- inserir novas rotas;
- deletar rotas.

1. Como executar o projeto?

Acesse o link da versão executável do projeto: http://projeto-origem-destino.s3-website-sa-east-1.amazonaws.com/. Após clicar em "explorar", é possível visualizar o mapa com as rotas presentes na base de dados. Pode-se regular o zoom, filtrar por meio de transporte, entre outras funcionalidades.

2. Dependências

Construímos o backend em Flask e o frontend usando React e CSS. Como banco de dados, decidimos usar o Sqlite3. Em relação ao mapa, utilizamos o Leaflet, uma biblioteca em JavaScript de mapas interativos. A lista completa de dependências pode ser encontrada no arquivo "requirements.txt".

# Documentação

### Rotas

- /
    - Landing page
    - Descreve o projeto de forma sucinta, e possuí um botão para ir para a página do mapa
- /map
    - Pagina principal
    - Mapa interativo
        - Filtros no topo direito para visualizar/esconder áreas, rotas, macro-rotas e marcações
        - Zoom, com os botões do topo esquerdo ou scroll do mouse
        - Popups descritivos, com cliques do mouse
        - Arrastar o mapa, com um clique-e-arrasta do mouse
    - Dropdowns
        - Filtro por tipo de transporte, inclui a pé, carro, bicicleta ou todos
        - Seleção de cores das rotas, com cores aleatórias, por distância ou por tempo
    - Sliders
        - Filtrar as rotas por tempo, em horas, por uma quantidade mínima e máxima
        - Filtrar as rotas por tamanho, por uma distância mínima e máxima