# 🔐 Login System

Современная система авторизации с 2FA, построенная на React, TypeScript, Ant Design, Zustand и React Query.

## 🚀 Быстрый Старт

### Установка зависимостей
```bash
npm install
```

### Запуск для разработки

**Вариант 1: Два терминала (рекомендуется)**
```bash
# Терминал 1 - API сервер
npm run dev:server

# Терминал 2 - Frontend
npm run dev
```

**Вариант 2: Один терминал**
```bash
npm run dev:full
```

### Открыть приложение
- **Frontend**: `http://localhost:5173` (или 5174)
- **API**: `http://localhost:3001`

## 🧪 Тестовые Аккаунты

- **Обычный пользователь**: `user@company.com` / `test123` (без 2FA)
- **Администратор**: `admin@company.com` / `test123` (с 2FA)
- **2FA код**: `131311` (только для администратора)

## 🏗️ Технологии

- **React 19** + **TypeScript**
- **Ant Design** - UI компоненты
- **Zustand** - управление состоянием
- **React Query** - серверное состояние
- **React Router** - маршрутизация

## 📁 Структура

```
src/
├── components/
│   ├── LoginForm.tsx      # Форма авторизации
│   ├── TwoFactorAuth.tsx  # 2FA верификация
│   └── Dashboard.tsx      # Защищенная панель
├── stores/
│   └── authStore.ts       # Zustand store
├── hooks/
│   └── useAuth.ts         # React Query хуки
├── services/
│   └── authService.ts     # Mock API
└── providers/
    └── QueryProvider.tsx  # React Query провайдер
```

## ✨ Особенности

- ✅ Полная обработка ошибок API
- ✅ Двухфакторная аутентификация
- ✅ Персистентное состояние
- ✅ Адаптивный дизайн
- ✅ TypeScript типизация
- ✅ Современная архитектура

## 🔧 Команды

```bash
# Разработка
npm run dev          # Запуск frontend (Vite)
npm run dev:server   # Запуск API сервера
npm run dev:full     # Запуск обоих серверов

# Сборка
npm run build        # Сборка для production
npm run preview      # Предварительный просмотр
```

## ⚠️ Важные моменты

- **API сервер** должен быть запущен для работы логина
- Если порт 3001 занят: `lsof -ti:3001 | xargs kill -9`
- Frontend может работать на разных портах (5173, 5174, 5175...)