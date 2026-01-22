# PDV — Sistema de Ponto de Venda

Documentação inicial de arquitetura e decisões de design.





[ Hardware ]
     ↓
[ Drivers / SO ]
     ↓
[ Backend Local ]
     ↓
[ Regras de Negócio ]
     ↓
[ API Interna ]
     ↓
[ Interface (UI) ]
     ↓
[ UX / Feedback Visual ]



pdv/
├─ app/
│  ├─ ui/
│  │  ├─ index.html
│  │  ├─ styles/
│  │  │  ├─ base.css
│  │  │  ├─ layout.css
│  │  │  ├─ components.css
│  │  │  └─ theme.css
│  │  ├─ scripts/
│  │  │  ├─ ui.js
│  │  │  └─ state.js
│  │
│  ├─ backend/
│  │  ├─ server.js
│  │  ├─ db.js
│  │  ├─ products.js
│  │  ├─ sales.js
│  │  └─ fiscal.js
│
│  └─ shared/
│     ├─ constants.js
│     └─ utils.js
│
├─ database/
│  └─ pdv.sqlite
│
├─ main.js        ← Electron
├─ package.json
└─ README.md
