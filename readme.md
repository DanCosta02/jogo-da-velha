# Jogo da Velha Inteligente com Aprendizado de Máquina

Este projeto implementa um **Jogo da Velha** utilizando JavaScript para a lógica do jogo, com um toque especial: a máquina é capaz de aprender e se aprimorar ao longo do tempo através de **Q-learning**, uma técnica de aprendizado por reforço. Além disso, a máquina emprega heurísticas simples, como bloquear o oponente e escolher as melhores posições, simulando o comportamento estratégico de um jogador humano.

## Tecnologias Utilizadas

- **HTML5**: Estrutura do jogo e interface gráfica com uma disposição simples dos elementos na tela.
- **CSS3**: Estilos para a formatação visual do tabuleiro e feedback visual das jogadas.
- **JavaScript**: Controle total da lógica do jogo, atualizações do tabuleiro e tomada de decisões da máquina.

## Inteligência Artificial

- **Q-Learning**: A máquina usa esta técnica de aprendizado por reforço para melhorar sua estratégia a cada jogo, aprendendo com as suas jogadas anteriores.
- **Heurísticas de Decisão**: Além do aprendizado, a máquina foi equipada com estratégias comuns de jogadores humanos, como:
  - Tentar ganhar sempre que possível.
  - Bloquear o jogador adversário de vencer.
  - Priorizar o centro e os cantos do tabuleiro.

## Armazenamento

- **Local Storage**: As experiências aprendidas pela máquina são salvas no navegador do usuário, permitindo que a inteligência da máquina continue evoluindo ao longo de múltiplas sessões de jogo.

## Destaques

- O jogo oferece um equilíbrio entre decisões estratégicas de curto prazo, simulando o pensamento humano, e aprendizado contínuo, melhorando a performance da máquina ao longo do tempo.
- A máquina reduz sua taxa de exploração conforme mais partidas são jogadas, preferindo estratégias aprendidas ao invés de arriscar jogadas aleatórias.

## Como Usar

1. Clone o repositório:
    ```bash
    git clone https://github.com/seu-usuario/jogo-da-velha-inteligente.git
    ```
2. Abra o arquivo `index.html` no seu navegador para jogar.

## Contribuindo

Se você deseja contribuir para o projeto, fique à vontade para criar uma **issue** ou **pull request**. Qualquer contribuição será bem-vinda!

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
