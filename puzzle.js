const PUZZLE = {
  rows: 10,
  cols: 16,
  entries: [
    { word: "DUALCORE", row: 0, col: 11, dir: "down", number: 1, clue: "Processador que possui dois núcleos de execução." },
    { word: "FLASH", row: 0, col: 14, dir: "down", number: 2, clue: "Memória não volátil que pode ser apagada e regravada eletricamente." },
    { word: "UC", row: 1, col: 11, dir: "across", number: 3, clue: "Coordena e controla a execução das instruções dentro do processador." },
    { word: "DMA", row: 3, col: 3, dir: "down", number: 4, clue: "Permite transferir dados entre memória e periféricos sem intervenção contínua do processador." },
    { word: "CACHE", row: 4, col: 11, dir: "across", number: 5, clue: "Memória pequena e rápida que mantém cópias de dados frequentemente acessados." },
    { word: "CPU", row: 4, col: 13, dir: "down", number: 6, clue: "Componente que interpreta e executa instruções de programas." },
    { word: "EEPROM", row: 4, col: 15, dir: "down", number: 7, clue: "Memória não volátil que permite apagar e gravar bytes eletricamente." },
    { word: "DATABUS", row: 5, col: 2, dir: "across", number: 8, clue: "Caminho que transporta informações entre componentes do computador." },
    { word: "ULA", row: 5, col: 7, dir: "down", number: 9, clue: "Bloco responsável por cálculos matemáticos e comparações lógicas." },
    { word: "ROM", row: 6, col: 9, dir: "down", number: 10, clue: "Armazena instruções permanentes necessárias à inicialização do sistema." },
    { word: "REGISTRADORES", row: 7, col: 0, dir: "across", number: 11, clue: "Pequenas posições internas que guardam temporariamente valores usados pelo processador." },
    { word: "RAM", row: 7, col: 0, dir: "down", number: 11, clue: "Guarda temporariamente programas e dados em uso; perde conteúdo sem energia." }
  ]
};
