// Carregando as importações necessárias
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"; 
import { expect } from "chai";
import { ethers } from "hardhat";

// Definindo uma suíte de testes (describe) para o token K3Ltoken
describe("K3Ltoken", () => {
 
  // Constante que define quantas casas decimais teremos na nossa moeda
  const DECIMALS = 18n; 
 
  // Função de deploy fixture, que serve para o contrato ser provisionado apenas uma vez e limpo a cada teste
  async function deployFixture() {
    // Obtendo as contas de teste: owner (administrador) e outra conta para testes
    const [owner, otherAccount] = await ethers.getSigners();
    // Criando uma instância da factory do contrato para poder fazer o deploy
    const K3LtokenFactory = await ethers.getContractFactory("K3Ltoken");
    // Fazendo o deploy do contrato
    const k3lToken = await K3LtokenFactory.deploy();
    // Retornando o contrato e as contas para uso nos testes
    return { k3lToken, owner, otherAccount };
  }
  
  // Conjunto de testes para verificar funcionalidades do token
  describe("Testes do token K3Ltoken", function() {
    // Teste para verificar se o total supply foi atribuído ao administrador
    it("Deve colocar o total supply do K3Ltoken na conta do administrador", async () => {
      // Carregando o contrato e o proprietário usando a função fixture
      const { k3lToken, owner } = await loadFixture(deployFixture);
      // Verificando o saldo do proprietário
      const balance = await k3lToken.balanceOf(owner.address);
      // Definindo o valor esperado do total supply (1 token com 18 casas decimais)
      const totalSupply = 1000n * 10n ** 18n;
      // Verificando se o saldo é igual ao total supply
      expect(balance).to.equal(totalSupply, "O total supply não estava na primeira conta.");
    });

    // Teste para verificar se o nome do token está correto
    it("Deve ter o nome correto", async () => {
      // Carregando o contrato usando a função fixture
      const { k3lToken } = await loadFixture(deployFixture);
      // Obtendo o nome do token
      const name = await k3lToken.name();
      // Verificando se o nome está correto
      expect(name).to.equal("K3Ltoken", "O nome está incorreto");
    });

    // Teste para verificar se o símbolo do token está correto
    it("Deve ter o símbolo correto", async () => {
      // Carregando o contrato usando a função fixture
      const { k3lToken } = await loadFixture(deployFixture);
      // Obtendo o símbolo do token
      const symbol = await k3lToken.symbol();
      // Verificando se o símbolo está correto
      expect(symbol).to.equal("K3L", "O símbolo está incorreto");
    });

    // Teste para verificar se o número de casas decimais está correto
    it("Deve ter o número correto de casas decimais", async () => {
      // Carregando o contrato usando a função fixture
      const { k3lToken } = await loadFixture(deployFixture);
      // Obtendo o número de casas decimais
      const decimals = await k3lToken.decimals();
      // Verificando se o número de casas decimais está correto
      expect(decimals).to.equal(DECIMALS, "O número de casas decimais está incorreto");
    });
       
    // Teste para verificar se a transferência de tokens funciona corretamente
    it("Deve transferir tokens corretamente", async () => {
      // Definindo a quantidade a ser transferida (1 token com 18 casas decimais)
      const qty = 1n * 10n ** 18n;
      // Carregando o contrato e as contas usando a função fixture
      const { k3lToken, owner, otherAccount } = await loadFixture(deployFixture);
      // Verificando o saldo do administrador antes da transferência
      const balanceAdminBefore = await k3lToken.balanceOf(owner.address);
      // Verificando o saldo do destinatário antes da transferência
      const balanceToBefore = await k3lToken.balanceOf(otherAccount.address);
      
      // Executando a transferência
      await k3lToken.transfer(otherAccount.address, qty);
      
      // Verificando o saldo do administrador após a transferência
      const balanceAdminNow = await k3lToken.balanceOf(owner.address);
      // Verificando o saldo do destinatário após a transferência
      const balanceToNow = await k3lToken.balanceOf(otherAccount.address);
      
      // Verificando se o saldo do administrador diminuiu corretamente
      expect(balanceAdminNow).to.equal(balanceAdminBefore - qty, "O saldo do administrador está incorreto");
      // Verificando se o saldo do destinatário aumentou corretamente
      expect(balanceToNow).to.equal(balanceToBefore + qty, "O saldo do destinatário está incorreto");
    });
    
    // Teste para verificar se a transferência falha quando não há saldo suficiente
    it("NÃO deve transferir quando não há saldo suficiente", async () => {
      // Definindo uma quantidade acima do total supply
      const aboveSupply = 1001n * 10n ** 18n;
      // Carregando o contrato e as contas usando a função fixture
      const { k3lToken, owner, otherAccount } = await loadFixture(deployFixture);
      
      // Verificando se a transferência é revertida com o erro correto
      await expect(k3lToken.transfer(otherAccount.address, aboveSupply))
        .to.be.revertedWithCustomError(k3lToken, "ERC20InsufficientBalance");
    });

    // Teste para verificar se a aprovação de gastos funciona corretamente
    it("Deve aprovar gastos corretamente", async () => {
      // Definindo a quantidade a ser aprovada (1 token com 18 casas decimais)
      const qty = 1n * 10n ** 18n;
      
      // Carregando o contrato e as contas usando a função fixture
      const { k3lToken, owner, otherAccount } = await loadFixture(deployFixture);
      // Executando a aprovação
      await k3lToken.approve(otherAccount.address, qty);
      // Verificando o valor aprovado
      const allowedAmount = await k3lToken.allowance(owner.address, otherAccount.address);
      
      // Verificando se o valor aprovado está correto
      expect(qty).to.equal(allowedAmount, "O valor aprovado está incorreto");
    });

    // Teste para verificar se a transferência a partir de uma conta autorizada funciona corretamente
    it("Deve transferir a partir de uma conta autorizada", async () => {
      // Definindo a quantidade a ser transferida (1 token com 18 casas decimais)
      const qty = 1n * 10n ** 18n;
      
      // Carregando o contrato e as contas usando a função fixture
      const { k3lToken, owner, otherAccount } = await loadFixture(deployFixture);
      // Verificando a permissão antes da aprovação
      const allowanceBefore = await k3lToken.allowance(owner.address, otherAccount.address);
      // Verificando o saldo do administrador antes da transferência
      const balanceAdminBefore = await k3lToken.balanceOf(owner.address);
      // Verificando o saldo do destinatário antes da transferência
      const balanceToBefore = await k3lToken.balanceOf(otherAccount.address);
      
      // Executando a aprovação
      await k3lToken.approve(otherAccount.address, qty);
      
      // Conectando à instância do contrato como otherAccount para executar transferFrom
      const instance = k3lToken.connect(otherAccount);
      // Executando a transferência a partir da conta aprovada
      await instance.transferFrom(owner.address, otherAccount.address, qty);
      
      // Verificando a permissão após a transferência
      const allowanceNow = await k3lToken.allowance(owner.address, otherAccount.address);
      // Verificando o saldo do administrador após a transferência
      const balanceAdminNow = await k3lToken.balanceOf(owner.address);
      // Verificando o saldo do destinatário após a transferência
      const balanceToNow = await k3lToken.balanceOf(otherAccount.address);
      
      // Verificando se a permissão foi zerada corretamente
      expect(allowanceNow).to.equal(0n, "A permissão não foi atualizada corretamente");
      // Verificando se o saldo do administrador diminuiu corretamente
      expect(balanceAdminNow).to.equal(balanceAdminBefore - qty, "O saldo do administrador está incorreto");
      // Verificando se o saldo do destinatário aumentou corretamente
      expect(balanceToNow).to.equal(balanceToBefore + qty, "O saldo do destinatário está incorreto");
    });

    // Teste para verificar se a transferência falha quando não há permissão suficiente
    it("NÃO deve transferir quando não há permissão", async () => {
      // Definindo a quantidade a ser transferida (1 token com 18 casas decimais)
      const qty = 1n * 10n ** 18n;
      // Carregando o contrato e as contas usando a função fixture
      const { k3lToken, owner, otherAccount } = await loadFixture(deployFixture);
      
      // Verificando se a transferência é revertida com o erro correto
      await expect(k3lToken.transferFrom(owner.address, otherAccount.address, qty))
        .to.be.revertedWithCustomError(k3lToken, "ERC20InsufficientAllowance");
    });
  });
});