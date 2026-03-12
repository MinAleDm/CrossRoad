# Деплой CrossRoad на GitHub Pages

## 1. Требования

- Репозиторий на GitHub
- Права на настройку `Pages` и `Actions`

## 2. Что уже настроено

- Workflow: `.github/workflows/deploy-pages.yml`
- Сборка запускается из корня проекта
- Артефакт автоматически деплоится в GitHub Pages

## 3. Как включить Pages

1. Откройте `Settings -> Pages`.
2. В секции `Build and deployment` выберите `Source: GitHub Actions`.

## 4. Запуск деплоя

- Запушить изменения в `main` или `master`
- Или запустить workflow вручную (`Run workflow`)

## 5. Проверка

После успешного workflow сайт будет доступен по URL из шага `Deploy to GitHub Pages`.

## 6. Локальная проверка production

```bash
npm install
npm run build
npm run preview
```
