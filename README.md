# PDV — Sistema de Ponto de Venda (Desktop)

Projeto **PDV** é um sistema de ponto de venda **desktop**, local-first, desenvolvido com foco em:
- arquitetura limpa
- controle total de estado
- independência de nuvem
- clareza para evolução e versionamento

Este repositório também funciona como **projeto de estudo sério**, portfólio técnico e base real para evolução profissional.

---

## 🎯 Objetivo do Projeto

Criar um **PDV local** capaz de:

- Rodar offline
- Controlar produtos, vendas e regras de negócio
- Ter interface simples, funcional e objetiva
- Separar claramente UI, regras de negócio e infraestrutura
- Ser versionado de forma limpa (commits pequenos e significativos)

---

## 🧱 Visão Geral da Arquitetura

Fluxo lógico do sistema:

[ Hardware ]
↓
[ Sistema Operacional ]
↓
[ Backend Local (Node.js) ]
↓
[ Regras de Negócio / Domínio ]
↓
[ API Interna ]
↓
[ Interface (UI Desktop) ]
↓
[ UX / Feedback Visual ]



---

## 📂 Estrutura de Pastas
```text
pdv/
├── app/
│   ├── application/
│   ├── backend/
│   ├── domain/
│   ├── infrastructure/
│   │   ├── database/
│   │   └── repositories/
│   ├── interfaces/
│   │   └── http/
│   ├── shared/
│   └── ui/
│       ├── scripts/
│       ├── styles/
│       └── index.html
│
├── database/
├── node_modules/
├── main.js
├── package.json
├── package-lock.json
├── pdv.sqlite
├── .gitignore
└── README.md
```


---

## ⚙️ Tecnologias Utilizadas

- **Node.js** — backend local
- **Express** — API interna
- **SQLite** — banco de dados local
- **HTML / CSS / JavaScript puro** — interface
- **Git + GitHub** — versionamento
- **VS Code** — ambiente de desenvolvimento

*(Electron será integrado posteriormente para empacotamento desktop)*

---

## 🚦 Estado Atual do Projeto

- ✅ Repositório inicial criado
- ✅ Estrutura de pastas definida
- ✅ Backend inicial funcionando
- ✅ Express configurado
- ✅ Banco de dados implementado
- ✅ UI funcional
- ✅ Integração completa (UI ↔ Backend ↔ DB)
- ✅ -  MLP do PDV concluído

---

## 🧠 Princípios Seguidos

- Cada pasta tem **uma responsabilidade**
- Nada de “mágica”
- Commits pequenos e rastreáveis
- Evolução sempre para frente (sem remendos)
- Código legível > código esperto

---

## 📌 Observações

Este projeto está sendo construído **passo a passo**, com decisões conscientes.
Nada aqui é boilerplate jogado.

Se você está lendo este README, este projeto **existe de verdade**.