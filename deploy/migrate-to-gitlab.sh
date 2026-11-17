#!/usr/bin/env bash
# =============================================================================
# Переезд сайта АО «Москоллектор» и CMS с GitHub во внутренний GitLab.
#
# Что делает:
#   1. Проверяет GitLab (версия ≥ 16.3 — требование Sveltia CMS) и проект.
#   2. Клонирует main с GitHub со всей историей.
#   3. Сверяет с внутренним репозиторием: если внутри уже есть коммиты, которых
#      нет на GitHub, — останавливается (ничего не перетирает).
#   4. Переключает CMS на GitLab: backend, вход через OAuth (PKCE), пути без
#      префикса GitHub Pages «/-mk/», CSP админки в nginx-конфиге.
#   5. Собирает сайт (проверка, что после правок всё собирается).
#   6. С флагом --push отправляет коммит во внутренний GitLab (без force).
#
# Запуск — на машине, откуда доступны и GitHub, и внутренний GitLab
# (там же, где сейчас идёт клонирование с GitHub):
#
#   GITLAB_URL=https://git.example.local \
#   GITLAB_PROJECT=web/moscollector-site \
#   GITLAB_APP_ID=<Application ID OAuth-приложения> \
#   GITLAB_TOKEN=<личный токен, scope read_api> \
#   ./migrate-to-gitlab.sh            # сухой прогон: всё готовит, ничего не отправляет
#   ./migrate-to-gitlab.sh --push     # то же + отправка во внутренний GitLab
#
# Флаги:
#   --push        отправить результат во внутренний GitLab
#   --vendor-cms  положить скрипт Sveltia CMS в сам сайт (версия фиксируется),
#                 вместо загрузки с unpkg.com. См. GITLAB_MIGRATION.md.
#
# Переменные (необязательные):
#   SITE_URL      адрес сайта            (по умолчанию https://moscollector.ru)
#   SOURCE_REPO   откуда брать код       (по умолчанию GitHub krylosophy-hue/-mk)
#   PUSH_URL      куда отправлять        (по умолчанию $GITLAB_URL/$GITLAB_PROJECT.git)
#   BRANCH        ветка                  (по умолчанию main)
#   WORKDIR       рабочая папка скрипта  (по умолчанию ./mk-gitlab-migration)
#   GITLAB_TOKEN  токен для проверок версии GitLab и проекта (рекомендуется)
#
# Подробно: deploy/GITLAB_MIGRATION.md
# =============================================================================
set -euo pipefail

PUSH=0
VENDOR_CMS=0
for arg in "$@"; do
  case "$arg" in
    --push) PUSH=1 ;;
    --vendor-cms) VENDOR_CMS=1 ;;
    -h|--help) awk 'NR>1 && /^#/ {sub(/^# ?/, ""); print; next} NR>1 {exit}' "$0"; exit 0 ;;
    *) echo "Неизвестный параметр: $arg (см. --help)" >&2; exit 2 ;;
  esac
done

SITE_URL="${SITE_URL:-https://moscollector.ru}"
SOURCE_REPO="${SOURCE_REPO:-https://github.com/krylosophy-hue/-mk.git}"
BRANCH="${BRANCH:-main}"
WORKDIR="${WORKDIR:-$PWD/mk-gitlab-migration}"

say()  { printf '\n\033[1;34m▶ %s\033[0m\n' "$*"; }
ok()   { printf '  \033[32m✓\033[0m %s\n' "$*"; }
warn() { printf '  \033[33m!\033[0m %s\n' "$*"; }
die()  { printf '\n\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

# --- 0. Параметры и инструменты ----------------------------------------------
say "Проверка параметров и инструментов"
[ -n "${GITLAB_URL:-}" ]     || die "Не задан GITLAB_URL (например https://git.example.local)"
[ -n "${GITLAB_PROJECT:-}" ] || die "Не задан GITLAB_PROJECT (группа/проект, например web/moscollector-site)"
[ -n "${GITLAB_APP_ID:-}" ]  || die "Не задан GITLAB_APP_ID (Application ID OAuth-приложения в GitLab, см. GITLAB_MIGRATION.md)"
GITLAB_URL="${GITLAB_URL%/}"
SITE_URL="${SITE_URL%/}"
case "$GITLAB_URL" in https://*|http://*) ;; *) die "GITLAB_URL должен начинаться с https:// или http://" ;; esac
PUSH_URL="${PUSH_URL:-$GITLAB_URL/$GITLAB_PROJECT.git}"
# Origin GitLab (схема + хост + порт) — для CSP админки
GITLAB_ORIGIN="$(printf '%s' "$GITLAB_URL" | sed -E 's#^(https?://[^/]+).*#\1#')"

for t in git node npm curl perl tar; do
  command -v "$t" >/dev/null 2>&1 || die "Не найдена программа: $t"
done
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
[ "$NODE_MAJOR" -ge 20 ] || die "Нужен Node.js 20 или новее (сейчас $(node -v))"
ok "git, Node $(node -v), npm, curl, perl"
ok "GitLab: $GITLAB_URL, проект: $GITLAB_PROJECT"
ok "Отправка в: $PUSH_URL"

# --- 1. Проверки GitLab через API --------------------------------------------
say "Проверка GitLab"
if [ -n "${GITLAB_TOKEN:-}" ]; then
  api() { curl -fsS --max-time 20 -H "PRIVATE-TOKEN: $GITLAB_TOKEN" "$GITLAB_URL/api/v4/$1"; }
  VER_JSON="$(api version)" || die "Не удалось обратиться к $GITLAB_URL/api/v4/version (адрес, токен, сеть?)"
  VER="$(printf '%s' "$VER_JSON" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).version))')"
  if node -e 'const [a,b]=process.argv[1].split(".").map(Number);process.exit(a>16||(a===16&&b>=3)?0:1)' "$VER"; then
    ok "Версия GitLab $VER (нужна ≥ 16.3)"
  else
    die "Версия GitLab $VER — Sveltia CMS работает с GitLab 16.3 и новее. Нужно обновить GitLab."
  fi
  PROJ_ENC="$(printf '%s' "$GITLAB_PROJECT" | sed 's#/#%2F#g')"
  PROJ_JSON="$(api "projects/$PROJ_ENC")" || die "Проект $GITLAB_PROJECT не найден или нет доступа. Создайте его в GitLab (пустой) или проверьте путь."
  printf '%s' "$PROJ_JSON" | node -e '
    let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
      const p=JSON.parse(s);
      console.log("  \x1b[32m✓\x1b[0m Проект найден: " + p.web_url);
      if (p.mirror) console.log("  \x1b[33m!\x1b[0m В проекте включено зеркалирование (pull mirror). Его надо ОТКЛЮЧИТЬ до переезда, иначе зеркало будет конфликтовать с правками из CMS.");
    })'
else
  warn "GITLAB_TOKEN не задан — версию GitLab (нужна ≥ 16.3) и проект не проверяю"
fi

# --- 2. Клон с GitHub --------------------------------------------------------
say "Получение кода из $SOURCE_REPO ($BRANCH)"
REPO="$WORKDIR/repo"
mkdir -p "$WORKDIR"
if [ -d "$REPO" ]; then
  [ -f "$WORKDIR/.mk-migration" ] || die "$WORKDIR существует и создан не этим скриптом — укажите другой WORKDIR"
  rm -rf "$REPO"
fi
touch "$WORKDIR/.mk-migration"
git clone --quiet --branch "$BRANCH" --single-branch "$SOURCE_REPO" "$REPO"
cd "$REPO"
git config user.name  >/dev/null 2>&1 || git config user.name  "Site migration"
git config user.email >/dev/null 2>&1 || git config user.email "site-migration@localhost"
ok "Склонировано: $(git log --oneline -1)"
ok "Коммитов в истории: $(git rev-list --count HEAD)"

# --- 3. Сверка с внутренним репозиторием -------------------------------------
say "Сверка с внутренним репозиторием"
if INTERNAL_SHA="$(git ls-remote "$PUSH_URL" "refs/heads/$BRANCH" 2>/dev/null | cut -f1)" ; then
  if [ -n "$INTERNAL_SHA" ]; then
    git fetch --quiet "$PUSH_URL" "refs/heads/$BRANCH:refs/remotes/internal/$BRANCH" \
      || die "Не удалось получить $BRANCH из $PUSH_URL"
    if git merge-base --is-ancestor "internal/$BRANCH" HEAD; then
      AHEAD="$(git rev-list --count "internal/$BRANCH..HEAD")"
      ok "Внутренний $BRANCH (${INTERNAL_SHA:0:7}) — часть истории GitHub, отстаёт на $AHEAD коммит(ов). Перезаписи не будет."
    else
      die "Во внутреннем $BRANCH есть коммиты, которых нет на GitHub (${INTERNAL_SHA:0:7}).
  Возможно, переезд уже выполнен или внутри правили напрямую. Скрипт ничего не перетирает.
  Посмотреть расхождение: git log --oneline HEAD..internal/$BRANCH (в $REPO)"
    fi
  else
    ok "Внутренний репозиторий пуст — будет залит целиком"
  fi
else
  die "Нет доступа к $PUSH_URL (адрес, права, git-учётка для GitLab?)"
fi

# --- 4. Переключение CMS на GitLab -------------------------------------------
say "Переключение CMS на GitLab"
CFG=public/admin/config.yml
ADMIN_HTML=public/admin/index.html
NGINX=deploy/nginx-moscollector.conf
[ -f "$CFG" ] && [ -f "$ADMIN_HTML" ] || die "Не найдены файлы CMS ($CFG, $ADMIN_HTML)"
grep -qE '^backend:' "$CFG" || die "В $CFG нет блока backend"
grep -qE '^  name: gitlab' "$CFG" && die "В $CFG уже backend gitlab — переезд, похоже, уже сделан"

export MK_GITLAB_URL="$GITLAB_URL" MK_GITLAB_PROJECT="$GITLAB_PROJECT" \
       MK_GITLAB_APP_ID="$GITLAB_APP_ID" MK_SITE_URL="$SITE_URL" MK_BRANCH="$BRANCH" \
       MK_GITLAB_ORIGIN="$GITLAB_ORIGIN"

# 4a. Блок backend: GitHub + воркер Cloudflare → GitLab + PKCE (прокси не нужен)
perl -0pi -e '
  my $b = "backend:\n"
        . "  name: gitlab\n"
        . "  repo: $ENV{MK_GITLAB_PROJECT}\n"
        . "  branch: $ENV{MK_BRANCH}\n"
        . "  base_url: $ENV{MK_GITLAB_URL}\n"
        . "  api_root: $ENV{MK_GITLAB_URL}/api/v4\n"
        . "  auth_type: pkce\n"
        . "  app_id: $ENV{MK_GITLAB_APP_ID}\n";
  s/^backend:\n(?:[ \t]+.*\n)+/$b/m or die "backend block not replaced\n";
' "$CFG"
ok "backend → gitlab ($GITLAB_PROJECT), вход через OAuth PKCE"

# 4b. Пути без префикса GitHub Pages «/-mk/» и адрес сайта
perl -pi -e '
  s{^public_folder:[ \t]*"?/-mk/uploads"?[ \t]*$}{public_folder: "/uploads"};
  s{^logo_url:\s*/-mk/}{logo_url: /};
  s{^site_url:.*$}{site_url: $ENV{MK_SITE_URL}};
  s{^display_url:.*$}{display_url: $ENV{MK_SITE_URL}};
' "$CFG"
perl -pi -e 's{href="/-mk/images/}{href="/images/}g' "$ADMIN_HTML"
ok "public_folder → /uploads, site_url → $SITE_URL (старые пути /-mk/ в контенте сайт по-прежнему понимает)"

# 4c. Скрипт CMS: с unpkg (по умолчанию) или внутри сайта (--vendor-cms)
if [ "$VENDOR_CMS" = 1 ]; then
  CMS_VER="$(npm view @sveltia/cms version)" || die "Не удалось узнать версию @sveltia/cms из npm-реестра"
  TMP_PACK="$(mktemp -d)"
  ( cd "$TMP_PACK" && npm pack --silent "@sveltia/cms@$CMS_VER" >/dev/null && tar -xzf ./*.tgz )
  [ -f "$TMP_PACK/package/dist/sveltia-cms.js" ] || die "В пакете @sveltia/cms@$CMS_VER нет dist/sveltia-cms.js"
  rm -rf public/admin/sveltia && mkdir -p public/admin/sveltia
  cp "$TMP_PACK/package/dist/sveltia-cms.js" public/admin/sveltia/
  [ -d "$TMP_PACK/package/dist/chunks" ] && cp -R "$TMP_PACK/package/dist/chunks" public/admin/sveltia/
  printf '%s\n' "$CMS_VER" > public/admin/sveltia/VERSION
  rm -rf "$TMP_PACK"
  perl -pi -e 's{<script[^>]*src="https://unpkg\.com/\@sveltia/cms[^"]*"[^>]*></script>}{<script src="/admin/sveltia/sveltia-cms.js"></script>}' "$ADMIN_HTML"
  grep -q '/admin/sveltia/sveltia-cms.js' "$ADMIN_HTML" || die "Не удалось заменить подключение скрипта в $ADMIN_HTML"
  ok "Sveltia CMS $CMS_VER положена в public/admin/sveltia/ (обновлять — повторным --vendor-cms, см. инструкцию)"
else
  # Скрипт Sveltia не ES-модуль — убираем type="module", о котором она предупреждает
  perl -pi -e 's{<script type="module" (src="https://unpkg\.com/\@sveltia/cms[^"]*")></script>}{<script $1></script>}' "$ADMIN_HTML"
  ok "Скрипт CMS остаётся на unpkg.com (у компьютеров редакторов должен быть интернет)"
fi

# 4d. CSP админки в nginx-конфиге: GitHub-хосты → внутренний GitLab
if [ -f "$NGINX" ]; then
  perl -0pi -e '
    my $o = $ENV{MK_GITLAB_ORIGIN};
    s{(location /admin/ \{.*?connect-src[^;]*?) https://api\.github\.com https://\*\.githubusercontent\.com https://www\.githubstatus\.com https://sveltia-cms-auth\.krylosophy\.workers\.dev}{$1 $o}s
      or die "admin CSP connect-src not found in nginx config\n";
  ' "$NGINX"
  ok "nginx: CSP админки разрешает $GITLAB_ORIGIN вместо GitHub"
else
  warn "$NGINX не найден — CSP админки на сервере поправьте вручную (connect-src $GITLAB_ORIGIN)"
fi

# --- 5. Проверочная сборка ---------------------------------------------------
say "Проверочная сборка (npm ci && npm run build)"
npm ci --no-audit --no-fund --loglevel=error >/dev/null
npm run build >/dev/null 2>"$WORKDIR/build.log" || { tail -30 "$WORKDIR/build.log"; die "Сборка упала (лог: $WORKDIR/build.log)"; }
grep -q '^  name: gitlab' dist/admin/config.yml || die "В собранной админке нет backend gitlab"
[ -f dist/index.html ] || die "Нет dist/index.html"
ok "Сборка прошла: $(du -sh dist | cut -f1), админка с backend gitlab"

# --- 6. Коммит и отправка ----------------------------------------------------
say "Коммит"
git add -A public/admin "$NGINX" 2>/dev/null || git add -A public/admin
git commit --quiet -m "Переезд CMS на внутренний GitLab

backend gitlab ($GITLAB_PROJECT), вход через OAuth PKCE,
пути без префикса GitHub Pages, CSP админки под $GITLAB_ORIGIN.
Сделано скриптом deploy/migrate-to-gitlab.sh."
git --no-pager show --stat --oneline HEAD | sed 's/^/  /'

if [ "$PUSH" = 1 ]; then
  say "Отправка во внутренний GitLab"
  git push "$PUSH_URL" "HEAD:refs/heads/$BRANCH"
  git push --quiet "$PUSH_URL" --tags || warn "Теги не отправлены (не критично)"
  ok "Готово: $PUSH_URL ($BRANCH)"
  cat <<EOF

Дальше (подробно — deploy/GITLAB_MIGRATION.md, раздел «После переезда»):
  1. Убедиться, что синхронизация GitHub → GitLab остановлена.
  2. Проверить пайплайн: $GITLAB_URL/$GITLAB_PROJECT/-/pipelines
  3. Открыть $SITE_URL/admin/ из внутренней сети → «Войти через GitLab».
  4. Перевести репозиторий на GitHub в архив (только чтение).
EOF
else
  cat <<EOF

Сухой прогон завершён — во внутренний GitLab ничего не отправлено.
Результат: $REPO (коммит выше). Посмотреть изменения: git -C "$REPO" show
Отправить: запустите скрипт ещё раз с флагом --push.
EOF
fi
