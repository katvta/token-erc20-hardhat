
## K3Ltoken - ERC20 Token

![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)
![Hardhat](https://img.shields.io/badge/Hardhat-181A1F?style=for-the-badge&logo=hardhat&logoColor=white)

Um contrato inteligente ERC20 implementado com Hardhat para criação e teste de token na blockchain Ethereum.

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) (v18.x ou superior)
- [npm](https://www.npmjs.com/) (v9.x ou superior)
- [Hardhat](https://hardhat.org/) (v2.x ou superior)

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/katvta/token-erc20-hardhat.git
cd token-erc20-hardhat
```

2. Instale as dependências:
```bash
npm install
```

## 📂 Estrutura do Projeto

```
token-erc20-hardhat/
├── contracts/              # Contratos inteligentes
│   └── k3ltoken.sol        # Implementação do token ERC20
├── scripts/                # Scripts de automação
│   └── deploy.js           # Script para deploy do contrato
├── test/                   # Testes
│   └── k3ltoken.test.js    # Testes unitários
├── hardhat.config.js       # Configuração do Hardhat
└── package.json            # Dependências do projeto
```

## 📜 Contrato Inteligente

### Características do Token
- **Nome:** K3Ltoken
- **Símbolo:** K3L
- **Supply Inicial:** 1,000 tokens
- **Decimais:** 18
- **Padrão:** ERC20

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract K3Ltoken is ERC20 {
    constructor() ERC20("K3Ltoken", "K3L") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }
}
```

## 🛠️ Comandos Úteis

### Executar testes
```bash
npx hardhat test
```

### Iniciar nó local
```bash
npx hardhat node
```

### Fazer deploy local
```bash
npx hardhat run scripts/deploy.ts --network localhost
```

### Verificar contrato na rede Ethereum
```bash
npx hardhat verify --network <network_name> <contract_address>
```

## 🔍 Testes Automatizados

Os testes cobrem:
- Distribuição inicial de tokens
- Transferências entre contas
- Aprovações de gasto
- Tratamento de erros

Exemplo de caso de teste:
```javascript
const { expect } = require("chai");

describe("K3Ltoken", function () {
  it("Deve retornar o supply correto", async function () {
    const [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("K3Ltoken");
    const token = await Token.deploy();
    
    expect(await token.totalSupply()).to.equal(1000n * 10n ** 18n);
    expect(await token.balanceOf(owner.address)).to.equal(1000n * 10n ** 18n);
  });
});
```

## 🌐 Deploy em Redes

1. Configure as redes no `hardhat.config.js`
2. Adicione sua chave privada no `.env`
3. Execute o deploy:

```bash
npx hardhat run scripts/deploy.js --network <network_name>
```

**Desenvolvido por Katriel Amorim**  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/katriel-amorim-a330b4322/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/katvta)
