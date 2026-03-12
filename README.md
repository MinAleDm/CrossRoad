# CrossRoad

[![Deploy CrossRoad to GitHub Pages](https://github.com/MinAleDm/CrossRoad/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/MinAleDm/CrossRoad/actions/workflows/deploy-pages.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-online-1f8f4f?logo=github)](https://minaledm.github.io/CrossRoad/)
[![License: MIT](https://img.shields.io/badge/License-MIT-1f8f4f.svg)](LICENSE)

`CrossRoad` - учебный проект платформы для статей и дискуссий в формате чистого frontend-прототипа.

## Что сделано

- Полностью удален legacy/неиспользуемый код
- Оставлен только актуальный стек: `React + TypeScript + Vite`
- Упрощена и выровнена структура репозитория
- Сохранен автодеплой на GitHub Pages

## Структура проекта

```text
CrossRoad/
  .github/workflows/deploy-pages.yml
  docs/
  public/
  src/
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  README.md
```

## Быстрый старт

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
npm run preview
```

## Деплой на GitHub Pages

Workflow деплоя: [./.github/workflows/deploy-pages.yml](./.github/workflows/deploy-pages.yml)

Подробные шаги: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## Документация

- [Архитектура прототипа](docs/ARCHITECTURE.md)
- [Деплой](docs/DEPLOYMENT.md)
- [Дорожная карта](docs/ROADMAP.md)
- [Индекс документации](docs/README.md)

## Лицензии

- Код: [MIT](LICENSE)
- Контент: [CC-BY-NC-SA-4.0](CC-BY-NC-SA-4.0)
