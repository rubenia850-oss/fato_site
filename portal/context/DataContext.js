// context/DataContext.js — Contexto de dados compartilhado por quase todo componente do portal.
// Extraído de App.jsx na Etapa 2 da quebra do monólito (D98/D100, 05/07/2026).
// Motivo de existir como módulo próprio: 17 componentes usam useData() — se ficasse dentro de
// App.jsx, qualquer componente extraído para components/ ou views/ criaria uma dependência
// circular (App.jsx importa o componente, o componente importa de volta de App.jsx).
import { createContext, useContext } from "react";

export const DataContext = createContext(null);
export const useData = () => useContext(DataContext);
