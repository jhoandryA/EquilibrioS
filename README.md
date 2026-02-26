💰 EquilibrioS — Calculadora de Presupuesto Personal

App de finanzas personales para registrar ingresos y gastos, visualizar en qué categorías gastas más y mantener el control de tu presupuesto mes a mes. Sin backend, sin registro, sin internet después de la primera carga.

# ✨ Equilibrio$ – Calculadora de Presupuesto Personal

Gestiona tus finanzas personales de manera sencilla y visual. 💸  

<details>
<summary>✨ Funcionalidades</summary>

📥 **Ingresos:** Registra tus fuentes de ingreso del mes (sueldo, freelance, etc.).  
📤 **Gastos:** Agrega gastos con categoría, descripción, monto y fecha.  
💰 **Balance:** Resultado de Ingresos − Gastos. Verde si sobra, rojo si gastas de más.  
📊 **Gráfico Donut:** Visualiza en qué categorías va tu dinero.  
📈 **Barra de progreso:** Indica qué % de tu ingreso ya gastaste (verde → naranja → rojo).  
💹 **Tasa de ahorro:** Porcentaje del ingreso que lograste ahorrar ese mes.  
🗓️ **Navegación por mes:** Cada mes tiene sus propios datos independientes.  
🔍 **Filtros:** Ver todo, solo gastos o solo ingresos.  

</details>

<details>
<summary>💡 Balance</summary>

**Balance = Ingresos − Gastos**  

✅ Positivo → Ganaste más de lo que gastaste. Te sobra dinero.  
❌ Negativo → Gastaste más de lo que ganaste. Estás en déficit.  

**Ejemplo:**  
Ingresos: S/ 3,000  
Gastos: - S/ 2,200  
**Balance: + S/ 800 ✅**

</details>

<details>
<summary>🗂️ Categorías de gastos</summary>

🛒 Alimentación · 🚌 Transporte · 🏠 Vivienda · 💊 Salud · 🎮 Entretenimiento · 👗 Ropa · 📚 Educación · 💡 Servicios · 📦 Otro

</details>

<details>
<summary>💾 Persistencia de datos</summary>

Los datos se guardan en el `localStorage` de tu navegador, organizados por mes:  

✅ Sin servidor ni base de datos  
✅ Sin cuenta ni registro  
✅ Funciona offline después de la primera carga  
⚠️ Si limpias el navegador, se borran los datos

</details>

<details>
<summary>📁 Estructura del proyecto</summary>
Equilibrio$/
├── index.html → Estructura de la página
├── style.css → Estilos y diseño visual
├── app.js → Lógica, cálculos y localStorage
└── README.md

</details>

<details>
<summary>🚀 Usar localmente</summary>

```bash
git clone https://github.com/jhoandryA/EquilibrioS.git
# Abre https://jhoandrya.github.io/EquilibrioS/
# No necesitas instalar nada.
