/**
 * i18n landing page.
 *
 * Strings are extracted into a per-locale dictionary. The active locale is
 * resolved from the visitor's `Accept-Language` header (see `resolveLocale`).
 * Technical tokens (pin_publish, MCP, SSE, R2, OG, X-Robots-Tag, agents.md,
 * GitHub) are intentionally left untranslated.
 */

export type Locale = 'en' | 'ko' | 'ja' | 'zh' | 'es' | 'fr' | 'de';

export const DEFAULT_LOCALE: Locale = 'en';

const SUPPORTED: Locale[] = ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de'];

interface Strings {
  htmlLang: string;
  metaTitle: string;
  metaDesc: string;
  ogTitle: string;
  ogDesc: string;
  navApi: string;
  navMcp: string;
  heroLine1: string;
  heroAccent: string;
  tagline: string;
  ctaTryApi: string;
  ctaReadAgents: string;
  apiH2: string;
  apiP: string;
  apiReturns: string;
  mcpH3: string;
  mcpP: string;
  mcpCta: string;
  featuresH2: string;
  featuresP: string;
  f1Title: string;
  f1Desc: string;
  f2Title: string;
  f2Desc: string;
  f3Title: string;
  f3Desc: string;
  f4Title: string;
  f4Desc: string;
  f5Title: string;
  f5Desc: string;
  f6Title: string;
  f6Desc: string;
  howH2: string;
  howP: string;
  s1Title: string;
  s1Desc: string;
  s2Title: string;
  s2Desc: string;
  s3Title: string;
  s3Desc: string;
  footer: string;
}

const translations: Record<Locale, Strings> = {
  en: {
    htmlLang: 'en',
    metaTitle: 'Pin — Publish HTML for agents',
    metaDesc: 'Publish HTML reports, dashboards, and visualizations with one API call.',
    ogTitle: 'Pin — Publish HTML for agents',
    ogDesc: 'POST HTML, get a link. MCP server included.',
    navApi: 'API',
    navMcp: 'MCP',
    heroLine1: 'Publish HTML',
    heroAccent: 'in seconds',
    tagline:
      'Pin turns any HTML artifact into a public link with one API call. Reports, dashboards, charts, demos — anything an agent creates.',
    ctaTryApi: 'Try the API',
    ctaReadAgents: 'Read agents.md',
    apiH2: 'One endpoint. One link.',
    apiP: 'Send HTML as JSON, raw body, or fetch it from a URL. Pin handles storage, OG images, TTL, and rate limits.',
    apiReturns: '→ returns {"url":"...","id":"...","expires_at":"..."}',
    mcpH3: 'MCP Server at',
    mcpP: 'Connect any MCP client via Server-Sent Events and call pin_publish directly from the agent.',
    mcpCta: 'See agents.md',
    featuresH2: 'Built for agents, safe for humans.',
    featuresP: 'Everything included without configuration creep.',
    f1Title: 'MCP over SSE',
    f1Desc: 'Expose pin_publish as a tool. Agents publish instantly without reading API docs.',
    f2Title: 'Social cards',
    f2Desc: 'Automatic Open Graph + Twitter Cards. Missing images get a generated 1200×630 PNG preview.',
    f3Title: 'Fast & stateless',
    f3Desc: 'Cloudflare R2 or local filesystem. Scales horizontally with no database.',
    f4Title: 'Optional password',
    f4Desc: 'Lock artifacts behind a password. Subdomain URLs stay easy to share.',
    f5Title: 'TTL by default',
    f5Desc: 'Content expires automatically. Configure anonymous and keyed tiers via environment variables.',
    f6Title: 'Rate limits & noindex',
    f6Desc: 'Per-IP and per-key limits with X-Robots-Tag keep the public web sane.',
    howH2: 'How it works',
    howP: 'Three steps from HTML artifact to shareable URL.',
    s1Title: 'Send HTML',
    s1Desc: 'POST JSON, raw HTML, or point us at a URL.',
    s2Title: 'Pin stores it',
    s2Desc: 'We save the file to R2 or disk and generate metadata.',
    s3Title: 'Get a link',
    s3Desc: 'Receive a random-subdomain URL with TTL and OG image.',
    footer: 'Built for agents',
  },
  ko: {
    htmlLang: 'ko',
    metaTitle: 'Pin — 에이전트를 위한 HTML 퍼블리싱',
    metaDesc: 'API 호출 한 번으로 HTML 리포트, 대시보드, 시각화를 게시하세요.',
    ogTitle: 'Pin — 에이전트를 위한 HTML 퍼블리싱',
    ogDesc: 'HTML을 POST하면 링크가 나옵니다. MCP 서버 포함.',
    navApi: 'API',
    navMcp: 'MCP',
    heroLine1: 'HTML 게시,',
    heroAccent: '몇 초면 끝',
    tagline:
      'Pin은 API 호출 한 번으로 모든 HTML 결과물을 공개 링크로 만들어 줍니다. 리포트, 대시보드, 차트, 데모 — 에이전트가 만든 무엇이든.',
    ctaTryApi: 'API 사용해 보기',
    ctaReadAgents: 'agents.md 보기',
    apiH2: '엔드포인트 하나, 링크 하나.',
    apiP: 'HTML을 JSON, 원본 본문으로 보내거나 URL에서 가져오세요. 저장, OG 이미지, TTL, 속도 제한까지 Pin이 처리합니다.',
    apiReturns: '→ 반환값 {"url":"...","id":"...","expires_at":"..."}',
    mcpH3: 'MCP 서버 위치',
    mcpP: 'Server-Sent Events로 어떤 MCP 클라이언트든 연결하고 에이전트에서 곧바로 pin_publish를 호출하세요.',
    mcpCta: 'agents.md 보기',
    featuresH2: '에이전트를 위해 만들고, 사람에게 안전하게.',
    featuresP: '설정 부담 없이 모든 기능이 기본 제공됩니다.',
    f1Title: 'SSE 기반 MCP',
    f1Desc: 'pin_publish를 도구로 노출하세요. 에이전트가 API 문서를 읽지 않고도 바로 게시합니다.',
    f2Title: '소셜 카드',
    f2Desc: 'Open Graph + Twitter 카드 자동 생성. 이미지가 없으면 1200×630 PNG 미리보기를 만들어 줍니다.',
    f3Title: '빠르고 상태 없음',
    f3Desc: 'Cloudflare R2 또는 로컬 파일시스템. 데이터베이스 없이 수평 확장됩니다.',
    f4Title: '선택적 비밀번호',
    f4Desc: '결과물을 비밀번호로 잠그세요. 서브도메인 URL은 공유하기 쉽게 유지됩니다.',
    f5Title: '기본 TTL',
    f5Desc: '콘텐츠가 자동으로 만료됩니다. 익명·키 등급은 환경 변수로 설정하세요.',
    f6Title: '속도 제한 & noindex',
    f6Desc: 'IP별·키별 제한과 X-Robots-Tag로 공개 웹을 깔끔하게 유지합니다.',
    howH2: '동작 방식',
    howP: 'HTML 결과물에서 공유 가능한 URL까지 세 단계.',
    s1Title: 'HTML 전송',
    s1Desc: 'JSON, 원본 HTML을 POST하거나 URL을 알려주세요.',
    s2Title: 'Pin이 저장',
    s2Desc: '파일을 R2 또는 디스크에 저장하고 메타데이터를 생성합니다.',
    s3Title: '링크 받기',
    s3Desc: 'TTL과 OG 이미지가 포함된 랜덤 서브도메인 URL을 받으세요.',
    footer: '에이전트를 위해 제작됨',
  },
  ja: {
    htmlLang: 'ja',
    metaTitle: 'Pin — エージェントのためのHTML公開',
    metaDesc: 'API呼び出し1回でHTMLレポート、ダッシュボード、ビジュアライゼーションを公開。',
    ogTitle: 'Pin — エージェントのためのHTML公開',
    ogDesc: 'HTMLをPOSTすればリンクが返ります。MCPサーバー付き。',
    navApi: 'API',
    navMcp: 'MCP',
    heroLine1: 'HTMLを公開',
    heroAccent: '数秒で',
    tagline:
      'PinはあらゆるHTML成果物を、API呼び出し1回で公開リンクに変えます。レポート、ダッシュボード、チャート、デモ — エージェントが作るものすべて。',
    ctaTryApi: 'APIを試す',
    ctaReadAgents: 'agents.mdを読む',
    apiH2: 'エンドポイント1つ、リンク1つ。',
    apiP: 'HTMLをJSON・生のボディで送るか、URLから取得します。保存、OG画像、TTL、レート制限はPinが処理します。',
    apiReturns: '→ 戻り値 {"url":"...","id":"...","expires_at":"..."}',
    mcpH3: 'MCPサーバー',
    mcpP: 'Server-Sent Eventsで任意のMCPクライアントを接続し、エージェントから直接pin_publishを呼び出せます。',
    mcpCta: 'agents.mdを見る',
    featuresH2: 'エージェントのために、人にやさしく。',
    featuresP: '設定の手間なく、すべて同梱。',
    f1Title: 'SSE経由のMCP',
    f1Desc: 'pin_publishをツールとして公開。エージェントはAPIドキュメントを読まずに即座に公開します。',
    f2Title: 'ソーシャルカード',
    f2Desc: 'Open Graph + Twitterカードを自動生成。画像がない場合は1200×630のPNGプレビューを生成します。',
    f3Title: '高速・ステートレス',
    f3Desc: 'Cloudflare R2またはローカルファイルシステム。データベース不要で水平スケール。',
    f4Title: '任意のパスワード',
    f4Desc: '成果物をパスワードで保護。サブドメインURLは共有しやすいままです。',
    f5Title: 'デフォルトでTTL',
    f5Desc: 'コンテンツは自動的に期限切れになります。匿名・キー付きの階層は環境変数で設定します。',
    f6Title: 'レート制限 & noindex',
    f6Desc: 'IP単位・キー単位の制限とX-Robots-Tagで公開ウェブを健全に保ちます。',
    howH2: '仕組み',
    howP: 'HTML成果物から共有可能なURLまで3ステップ。',
    s1Title: 'HTMLを送る',
    s1Desc: 'JSON、生のHTMLをPOSTするか、URLを指定します。',
    s2Title: 'Pinが保存',
    s2Desc: 'ファイルをR2またはディスクに保存し、メタデータを生成します。',
    s3Title: 'リンクを取得',
    s3Desc: 'TTLとOG画像付きのランダムサブドメインURLを受け取ります。',
    footer: 'エージェントのために構築',
  },
  zh: {
    htmlLang: 'zh-CN',
    metaTitle: 'Pin — 为智能体发布 HTML',
    metaDesc: '一次 API 调用即可发布 HTML 报告、仪表盘和可视化内容。',
    ogTitle: 'Pin — 为智能体发布 HTML',
    ogDesc: 'POST HTML，即得链接。内置 MCP 服务器。',
    navApi: 'API',
    navMcp: 'MCP',
    heroLine1: '发布 HTML',
    heroAccent: '只需几秒',
    tagline:
      'Pin 通过一次 API 调用，将任何 HTML 内容变成公开链接。报告、仪表盘、图表、演示 — 智能体创建的一切。',
    ctaTryApi: '试用 API',
    ctaReadAgents: '阅读 agents.md',
    apiH2: '一个端点，一个链接。',
    apiP: '以 JSON、原始正文发送 HTML，或从 URL 抓取。存储、OG 图片、TTL 和速率限制都由 Pin 处理。',
    apiReturns: '→ 返回 {"url":"...","id":"...","expires_at":"..."}',
    mcpH3: 'MCP 服务器位于',
    mcpP: '通过 Server-Sent Events 连接任意 MCP 客户端，直接从智能体调用 pin_publish。',
    mcpCta: '查看 agents.md',
    featuresH2: '为智能体打造，对人类安全。',
    featuresP: '一切开箱即用，无需繁琐配置。',
    f1Title: '基于 SSE 的 MCP',
    f1Desc: '将 pin_publish 暴露为工具。智能体无需阅读 API 文档即可即时发布。',
    f2Title: '社交卡片',
    f2Desc: '自动生成 Open Graph + Twitter 卡片。缺少图片时会生成 1200×630 的 PNG 预览。',
    f3Title: '快速且无状态',
    f3Desc: 'Cloudflare R2 或本地文件系统。无需数据库即可横向扩展。',
    f4Title: '可选密码',
    f4Desc: '用密码锁定内容。子域名 URL 依然便于分享。',
    f5Title: '默认 TTL',
    f5Desc: '内容会自动过期。通过环境变量配置匿名和带密钥的等级。',
    f6Title: '速率限制与 noindex',
    f6Desc: '按 IP 和按密钥的限制，配合 X-Robots-Tag，让公开网络保持整洁。',
    howH2: '工作原理',
    howP: '从 HTML 内容到可分享 URL，只需三步。',
    s1Title: '发送 HTML',
    s1Desc: 'POST JSON、原始 HTML，或指向一个 URL。',
    s2Title: 'Pin 存储',
    s2Desc: '我们将文件保存到 R2 或磁盘并生成元数据。',
    s3Title: '获取链接',
    s3Desc: '获得带 TTL 和 OG 图片的随机子域名 URL。',
    footer: '为智能体而建',
  },
  es: {
    htmlLang: 'es',
    metaTitle: 'Pin — Publica HTML para agentes',
    metaDesc: 'Publica informes, paneles y visualizaciones HTML con una sola llamada a la API.',
    ogTitle: 'Pin — Publica HTML para agentes',
    ogDesc: 'Envía HTML por POST y obtén un enlace. Servidor MCP incluido.',
    navApi: 'API',
    navMcp: 'MCP',
    heroLine1: 'Publica HTML',
    heroAccent: 'en segundos',
    tagline:
      'Pin convierte cualquier artefacto HTML en un enlace público con una sola llamada a la API. Informes, paneles, gráficos, demos: todo lo que un agente cree.',
    ctaTryApi: 'Probar la API',
    ctaReadAgents: 'Leer agents.md',
    apiH2: 'Un endpoint. Un enlace.',
    apiP: 'Envía HTML como JSON, cuerpo en bruto o recupéralo desde una URL. Pin gestiona almacenamiento, imágenes OG, TTL y límites de tasa.',
    apiReturns: '→ devuelve {"url":"...","id":"...","expires_at":"..."}',
    mcpH3: 'Servidor MCP en',
    mcpP: 'Conecta cualquier cliente MCP mediante Server-Sent Events y llama a pin_publish directamente desde el agente.',
    mcpCta: 'Ver agents.md',
    featuresH2: 'Hecho para agentes, seguro para humanos.',
    featuresP: 'Todo incluido, sin exceso de configuración.',
    f1Title: 'MCP sobre SSE',
    f1Desc: 'Expón pin_publish como herramienta. Los agentes publican al instante sin leer la documentación de la API.',
    f2Title: 'Tarjetas sociales',
    f2Desc: 'Open Graph + Twitter Cards automáticas. Si falta la imagen, se genera una vista previa PNG de 1200×630.',
    f3Title: 'Rápido y sin estado',
    f3Desc: 'Cloudflare R2 o sistema de archivos local. Escala horizontalmente sin base de datos.',
    f4Title: 'Contraseña opcional',
    f4Desc: 'Protege los artefactos con contraseña. Las URL de subdominio siguen siendo fáciles de compartir.',
    f5Title: 'TTL por defecto',
    f5Desc: 'El contenido expira automáticamente. Configura niveles anónimos y con clave mediante variables de entorno.',
    f6Title: 'Límites de tasa y noindex',
    f6Desc: 'Límites por IP y por clave con X-Robots-Tag mantienen sana la web pública.',
    howH2: 'Cómo funciona',
    howP: 'Tres pasos del artefacto HTML a una URL para compartir.',
    s1Title: 'Envía HTML',
    s1Desc: 'POST de JSON, HTML en bruto o indícanos una URL.',
    s2Title: 'Pin lo guarda',
    s2Desc: 'Guardamos el archivo en R2 o en disco y generamos metadatos.',
    s3Title: 'Obtén un enlace',
    s3Desc: 'Recibe una URL de subdominio aleatorio con TTL e imagen OG.',
    footer: 'Hecho para agentes',
  },
  fr: {
    htmlLang: 'fr',
    metaTitle: 'Pin — Publiez du HTML pour les agents',
    metaDesc: 'Publiez des rapports, tableaux de bord et visualisations HTML en un seul appel API.',
    ogTitle: 'Pin — Publiez du HTML pour les agents',
    ogDesc: 'Envoyez du HTML en POST, recevez un lien. Serveur MCP inclus.',
    navApi: 'API',
    navMcp: 'MCP',
    heroLine1: 'Publiez du HTML',
    heroAccent: 'en quelques secondes',
    tagline:
      'Pin transforme n’importe quel artefact HTML en lien public en un seul appel API. Rapports, tableaux de bord, graphiques, démos — tout ce qu’un agent crée.',
    ctaTryApi: 'Essayer l’API',
    ctaReadAgents: 'Lire agents.md',
    apiH2: 'Un endpoint. Un lien.',
    apiP: 'Envoyez du HTML en JSON, en corps brut ou récupérez-le depuis une URL. Pin gère le stockage, les images OG, le TTL et les limites de débit.',
    apiReturns: '→ renvoie {"url":"...","id":"...","expires_at":"..."}',
    mcpH3: 'Serveur MCP sur',
    mcpP: 'Connectez n’importe quel client MCP via Server-Sent Events et appelez pin_publish directement depuis l’agent.',
    mcpCta: 'Voir agents.md',
    featuresH2: 'Conçu pour les agents, sûr pour les humains.',
    featuresP: 'Tout est inclus, sans configuration superflue.',
    f1Title: 'MCP via SSE',
    f1Desc: 'Exposez pin_publish comme outil. Les agents publient instantanément sans lire la documentation API.',
    f2Title: 'Cartes sociales',
    f2Desc: 'Open Graph + Twitter Cards automatiques. À défaut d’image, un aperçu PNG 1200×630 est généré.',
    f3Title: 'Rapide et sans état',
    f3Desc: 'Cloudflare R2 ou système de fichiers local. Mise à l’échelle horizontale sans base de données.',
    f4Title: 'Mot de passe optionnel',
    f4Desc: 'Verrouillez les artefacts par mot de passe. Les URL de sous-domaine restent faciles à partager.',
    f5Title: 'TTL par défaut',
    f5Desc: 'Le contenu expire automatiquement. Configurez les niveaux anonymes et à clé via des variables d’environnement.',
    f6Title: 'Limites de débit & noindex',
    f6Desc: 'Des limites par IP et par clé avec X-Robots-Tag gardent le web public sain.',
    howH2: 'Comment ça marche',
    howP: 'Trois étapes de l’artefact HTML à une URL partageable.',
    s1Title: 'Envoyez du HTML',
    s1Desc: 'POST de JSON, HTML brut, ou indiquez-nous une URL.',
    s2Title: 'Pin le stocke',
    s2Desc: 'Nous enregistrons le fichier sur R2 ou disque et générons les métadonnées.',
    s3Title: 'Obtenez un lien',
    s3Desc: 'Recevez une URL de sous-domaine aléatoire avec TTL et image OG.',
    footer: 'Conçu pour les agents',
  },
  de: {
    htmlLang: 'de',
    metaTitle: 'Pin — HTML für Agenten veröffentlichen',
    metaDesc: 'Veröffentliche HTML-Berichte, Dashboards und Visualisierungen mit einem einzigen API-Aufruf.',
    ogTitle: 'Pin — HTML für Agenten veröffentlichen',
    ogDesc: 'HTML per POST senden, Link erhalten. MCP-Server inklusive.',
    navApi: 'API',
    navMcp: 'MCP',
    heroLine1: 'HTML veröffentlichen',
    heroAccent: 'in Sekunden',
    tagline:
      'Pin verwandelt jedes HTML-Artefakt mit einem einzigen API-Aufruf in einen öffentlichen Link. Berichte, Dashboards, Diagramme, Demos — alles, was ein Agent erstellt.',
    ctaTryApi: 'API ausprobieren',
    ctaReadAgents: 'agents.md lesen',
    apiH2: 'Ein Endpoint. Ein Link.',
    apiP: 'Sende HTML als JSON, als Rohtext oder lade es von einer URL. Pin übernimmt Speicherung, OG-Bilder, TTL und Rate-Limits.',
    apiReturns: '→ liefert {"url":"...","id":"...","expires_at":"..."}',
    mcpH3: 'MCP-Server unter',
    mcpP: 'Verbinde jeden MCP-Client über Server-Sent Events und rufe pin_publish direkt aus dem Agenten auf.',
    mcpCta: 'agents.md ansehen',
    featuresH2: 'Für Agenten gebaut, sicher für Menschen.',
    featuresP: 'Alles inklusive, ohne Konfigurationswildwuchs.',
    f1Title: 'MCP über SSE',
    f1Desc: 'Stelle pin_publish als Tool bereit. Agenten veröffentlichen sofort, ohne API-Doku zu lesen.',
    f2Title: 'Social Cards',
    f2Desc: 'Automatische Open Graph + Twitter Cards. Fehlt ein Bild, wird eine 1200×630-PNG-Vorschau erzeugt.',
    f3Title: 'Schnell & zustandslos',
    f3Desc: 'Cloudflare R2 oder lokales Dateisystem. Skaliert horizontal ohne Datenbank.',
    f4Title: 'Optionales Passwort',
    f4Desc: 'Sperre Artefakte hinter einem Passwort. Subdomain-URLs bleiben leicht teilbar.',
    f5Title: 'TTL standardmäßig',
    f5Desc: 'Inhalte laufen automatisch ab. Konfiguriere anonyme und schlüsselbasierte Stufen über Umgebungsvariablen.',
    f6Title: 'Rate-Limits & noindex',
    f6Desc: 'Limits pro IP und pro Schlüssel mit X-Robots-Tag halten das öffentliche Web gesund.',
    howH2: 'So funktioniert es',
    howP: 'Drei Schritte vom HTML-Artefakt zur teilbaren URL.',
    s1Title: 'HTML senden',
    s1Desc: 'POST von JSON, rohem HTML, oder gib uns eine URL.',
    s2Title: 'Pin speichert es',
    s2Desc: 'Wir speichern die Datei auf R2 oder Disk und erzeugen Metadaten.',
    s3Title: 'Link erhalten',
    s3Desc: 'Erhalte eine zufällige Subdomain-URL mit TTL und OG-Bild.',
    footer: 'Für Agenten gebaut',
  },
};

/**
 * Resolve the best supported locale from an `Accept-Language` header value.
 * Parses quality values, sorts by preference, and matches on the primary
 * language subtag (so `en-US`, `en-GB` → `en`; any `zh-*` → `zh`).
 */
export function resolveLocale(acceptLanguage?: string): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const qParam = params.find((p) => p.trim().startsWith('q='));
      const q = qParam ? Number(qParam.split('=')[1]) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 1 };
    })
    .filter((entry) => entry.tag && entry.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (tag === '*') return DEFAULT_LOCALE;
    const primary = tag.split('-')[0] as Locale;
    if (SUPPORTED.includes(primary)) return primary;
  }

  return DEFAULT_LOCALE;
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

export function landingPageHtml(locale: Locale = DEFAULT_LOCALE): string {
  const t = translations[locale] ?? translations[DEFAULT_LOCALE];
  const baseDomain = process.env.BASE_DOMAIN || 'pin-publish-production.up.railway.app';
  return `<!DOCTYPE html>
<html lang="${t.htmlLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${t.metaTitle}</title>
<meta name="description" content="${escapeAttr(t.metaDesc)}">
<meta property="og:title" content="${escapeAttr(t.ogTitle)}">
<meta property="og:description" content="${escapeAttr(t.ogDesc)}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #faf9f6;
    --paper: #ffffff;
    --ink: #1a1a1a;
    --muted: #6b6b6e;
    --accent: #ef4444;
    --accent-soft: rgba(239, 68, 68, 0.12);
    --blue: #2563eb;
    --blue-soft: rgba(37, 99, 235, 0.10);
    --line: #1a1a1a;
    --shadow: rgba(26, 26, 26, 0.06);
    --shadow-hover: rgba(26, 26, 26, 0.10);
  }
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg);
    color: var(--ink);
    line-height: 1.55;
    background-image: radial-gradient(#e4dfd5 0.7px, transparent 0.7px);
    background-size: 24px 24px;
  }
  .container { max-width: 1000px; margin: 0 auto; padding: 0 1.5rem; }

  /* Hand-drawn helpers */
  .doodle-border {
    border: 2px solid var(--line);
    border-radius: 255px 12px 225px 12px / 12px 225px 12px 255px;
    box-shadow: 5px 5px 0 var(--shadow);
    transition: box-shadow 0.15s ease, transform 0.15s ease;
  }
  .doodle-border:hover { box-shadow: 6px 6px 0 var(--shadow-hover); transform: translateY(-2px) rotate(-0.4deg); }

  h1, h2, h3, .hand { font-family: 'Gaegu', system-ui, cursive; }

  /* Scribble underline draw-in */
  .scribble-underline { position: relative; display: inline; }
  .scribble-underline svg {
    position: absolute; left: -4px; right: -4px; bottom: -2px;
    width: calc(100% + 8px); height: 12px; overflow: visible; pointer-events: none;
  }
  .scribble-underline path {
    stroke: var(--accent); stroke-width: 5; fill: none; stroke-linecap: round;
    stroke-dasharray: 220; stroke-dashoffset: 220;
    animation: draw-underline 0.8s ease-out forwards; animation-delay: 0.4s;
  }
  @keyframes draw-underline { to { stroke-dashoffset: 0; } }

  /* Nav */
  nav { padding: 1.5rem 0 0.5rem; }
  .nav-inner { display: flex; align-items: center; justify-content: space-between; }
  .logo-mark { display: flex; align-items: center; gap: 0.5rem; font-family: 'Gaegu', cursive; font-weight: 700; font-size: 1.4rem; }
  .logo-pin { width: 30px; height: 30px; color: var(--accent); }
  .nav-links { display: flex; gap: 0.5rem; }
  .nav-links a {
    color: var(--muted); text-decoration: none; font-size: 0.9rem; font-weight: 600;
    padding: 0.4rem 0.9rem; border: 2px solid transparent; border-radius: 999px;
    transition: all 0.15s ease;
  }
  .nav-links a:hover { border-color: var(--line); color: var(--ink); transform: rotate(-1deg); }

  /* Hero */
  .hero { padding: 4rem 0 5rem; }
  .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
  .hero h1 { font-size: clamp(3rem, 5.8vw, 4.6rem); line-height: 1.05; letter-spacing: 0.02em; margin: 0 0 1rem; }
  .tagline { font-size: 1.15rem; color: var(--muted); max-width: 420px; margin: 0 0 1.75rem; }
  .hero-actions { display: flex; flex-wrap: wrap; gap: 0.85rem; }
  .btn {
    display: inline-flex; align-items: center; gap: 0.4rem; text-decoration: none; font-weight: 600;
    font-size: 0.95rem; padding: 0.85rem 1.4rem; background: var(--paper); color: var(--ink);
    border: 2px solid var(--line); border-radius: 255px 12px 225px 12px / 12px 225px 12px 255px;
    box-shadow: 4px 4px 0 var(--shadow); transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .btn:hover { transform: translateY(-2px) rotate(-0.8deg); box-shadow: 5px 5px 0 var(--shadow-hover); }
  .btn.primary { background: var(--accent); color: #fff; border-color: var(--accent); }
  .btn.blue { background: var(--blue); color: #fff; border-color: var(--blue); }

  .hero-art { position: relative; display: flex; align-items: center; justify-content: center; min-height: 320px; }
  .hero-art svg.main { width: 100%; max-width: 420px; height: auto; }
  .doodle-star { position: absolute; }
  .doodle-star.top { top: 6%; right: 2%; width: 34px; height: 34px; }
  .doodle-star.bottom { bottom: 18%; left: 4%; width: 26px; height: 26px; }
  .doodle-arrow { position: absolute; width: 60px; bottom: 2%; right: 4%; transform: rotate(-8deg); }

  /* API section */
  section { padding: 3.5rem 0; }
  .section-header { max-width: 560px; margin-bottom: 2rem; }
  .section-header h2 { font-size: clamp(1.8rem, 3.6vw, 2.6rem); margin: 0 0 0.5rem; }
  .section-header p { color: var(--muted); margin: 0; font-size: 1.05rem; }

  .endpoint-bar {
    background: var(--paper); padding: 1rem 1.25rem; display: flex; flex-wrap: wrap;
    gap: 0.5rem; align-items: center; margin-bottom: 1rem;
  }
  .endpoint-bar code {
    background: var(--accent-soft); color: var(--accent); padding: 0.35rem 0.65rem;
    border-radius: 8px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.82rem; font-weight: 700;
  }
  .endpoint-bar span { color: var(--muted); font-size: 0.9rem; }
  .code-card {
    background: var(--ink); color: #f7f7fa; padding: 1.25rem 1.5rem;
    border-radius: 18px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.85rem; line-height: 1.6; overflow-x: auto;
  }

  /* MCP banner */
  .mcp-banner {
    background: linear-gradient(135deg, var(--blue-soft) 0%, var(--paper) 100%);
    padding: 1.75rem 2rem; display: flex; flex-wrap: wrap;
    align-items: center; justify-content: space-between; gap: 1.25rem;
  }
  .mcp-banner h3 { margin: 0; font-size: 1.6rem; display: flex; align-items: center; gap: 0.5rem; }
  .mcp-banner p { margin: 0.3rem 0 0; color: var(--muted); }
  .mcp-banner .endpoint { font-family: ui-monospace, monospace; font-size: 0.85rem; color: var(--blue); font-weight: 700; }

  /* Features */
  .features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
  .feature {
    background: var(--paper); padding: 1.5rem;
  }
  .feature h3 { margin: 0 0 0.4rem; font-size: 1.4rem; display: flex; align-items: center; gap: 0.5rem; }
  .feature p { margin: 0; color: var(--muted); font-size: 0.95rem; }
  .feature-icon {
    width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; border: 2px solid var(--line);
  }
  .feature-icon.accent { background: var(--accent-soft); color: var(--accent); }
  .feature-icon.blue { background: var(--blue-soft); color: var(--blue); }
  .feature-icon.lemon { background: #fff3cd; color: var(--ink); }

  /* Steps */
  .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
  .step {
    text-align: center; padding: 1.5rem; background: var(--paper);
  }
  .step-num {
    display: inline-flex; align-items: center; justify-content: center;
    width: 38px; height: 38px; border-radius: 50%;
    background: var(--ink); color: #fff; font-family: 'Gaegu', cursive;
    font-size: 1.2rem; font-weight: 700; margin-bottom: 0.75rem;
  }
  .step h4 { margin: 0 0 0.3rem; font-family: 'Gaegu', system-ui, cursive; font-size: 1.3rem; }
  .step p { margin: 0; color: var(--muted); font-size: 0.92rem; }

  /* Footer */
  footer { padding: 2.5rem 0; text-align: center; color: var(--muted); font-size: 0.9rem; font-family: 'Gaegu', system-ui, cursive; }
  footer a { color: var(--muted); }
  footer a:hover { color: var(--ink); }

  @media (max-width: 900px) {
    .hero-grid { grid-template-columns: 1fr; }
    .hero { padding: 2.5rem 0 3.5rem; }
    .hero-art { order: -1; min-height: 260px; }
    .features, .steps { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .features, .steps { grid-template-columns: 1fr; }
    .endpoint-bar { flex-direction: column; align-items: flex-start; }
    .mcp-banner { text-align: center; justify-content: center; }
    .nav-links { display: none; }
  }
</style>
</head>
<body>
<div class="container">
  <nav>
    <div class="nav-inner">
      <div class="logo-mark">
        <svg class="logo-pin" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 4.17 3.93 8.11 5.63 9.63.33.29.37.8.37 1.37v.5c0 .28.22.5.5.5h1c.28 0 .5-.22.5-.5v-.5c0-.57.04-1.08.37-1.37C15.07 17.11 19 13.17 19 9c0-3.87-3.13-7-7-7z"/></svg>
        Pin
      </div>
      <div class="nav-links">
        <a href="#api">${t.navApi}</a>
        <a href="#mcp">${t.navMcp}</a>
        <a href="/agents.md">agents.md</a>
        <a href="https://github.com/vin-spiegel/pin-publish" target="_blank" rel="noopener">GitHub</a>
      </div>
    </div>
  </nav>

  <header class="hero">
    <div class="hero-grid">
      <div>
        <h1>${t.heroLine1}<br><span class="scribble-underline">${t.heroAccent}<svg viewBox="0 0 180 12" preserveAspectRatio="none"><path d="M2 7 C 40 2, 70 10, 110 6 S 170 4, 178 9"/></svg></span>.</h1>
        <p class="tagline">${t.tagline}</p>
        <div class="hero-actions">
          <a class="btn primary" href="#api">${t.ctaTryApi}</a>
          <a class="btn" href="/agents.md">${t.ctaReadAgents}</a>
        </div>
      </div>
      <div class="hero-art">
        <svg class="main" viewBox="0 0 400 360" aria-hidden="true">
          <rect x="60" y="50" width="280" height="260" rx="24" fill="#fff" stroke="#1a1a1a" stroke-width="2.5"/>
          <rect x="60" y="87" width="280" height="2" fill="#1a1a1a" opacity="0.12"/>
          <circle cx="88" cy="70" r="5" fill="#ef4444" opacity="0.5"/>
          <circle cx="106" cy="70" r="5" fill="#f59e0b" opacity="0.8"/>
          <circle cx="124" cy="70" r="5" fill="#2563eb" opacity="0.4"/>
          <rect x="90" y="110" width="140" height="16" rx="8" fill="#ef4444" opacity="0.12"/>
          <rect x="90" y="140" width="190" height="12" rx="6" fill="#1a1a1a" opacity="0.08"/>
          <rect x="90" y="164" width="160" height="12" rx="6" fill="#1a1a1a" opacity="0.08"/>
          <g transform="translate(235, 185)">
            <circle cx="0" cy="0" r="44" fill="#ef4444" stroke="#1a1a1a" stroke-width="2.5"/>
            <circle cx="0" cy="-18" r="12" fill="#fff" stroke="#1a1a1a" stroke-width="2.5"/>
            <path d="M0 -6 L0 40" stroke="#1a1a1a" stroke-width="2.8" stroke-linecap="round"/>
            <path d="M-16 24 L16 16" stroke="#1a1a1a" stroke-width="2.8" stroke-linecap="round"/>
          </g>
          <path d="M110 240 Q 150 285, 205 265" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="108" cy="236" r="5" fill="#f59e0b" stroke="#1a1a1a" stroke-width="1.5"/>
        </svg>
        <svg class="doodle-star top" viewBox="0 0 44 44" aria-hidden="true"><path d="M22 4 L26 16 L40 16 L29 24 L34 38 L22 29 L10 38 L15 24 L4 16 L18 16 Z" fill="#f59e0b" stroke="#1a1a1a" stroke-width="2" stroke-linejoin="round"/></svg>
        <svg class="doodle-star bottom" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3 L18 12 L28 12 L20 18 L23 28 L16 22 L9 28 L12 18 L4 12 L14 12 Z" fill="#ef4444" stroke="#1a1a1a" stroke-width="2" stroke-linejoin="round"/></svg>
        <svg class="doodle-arrow" viewBox="0 0 60 40" aria-hidden="true"><path d="M4 20 Q 20 5, 38 18 T 56 14" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round"/><path d="M48 8 L56 14 L50 22" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
    </div>
  </header>
</div>

<section id="api">
  <div class="container">
    <div class="section-header">
      <h2>${t.apiH2}</h2>
      <p>${t.apiP}</p>
    </div>
    <div class="endpoint-bar doodle-border">
      <code>POST /publish</code>
      <code>POST /publish/raw</code>
      <code>POST /publish/from-url</code>
      <span>${t.apiReturns}</span>
    </div>
    <div class="code-card">curl -X POST https://${baseDomain}/publish \\
  -H "Content-Type: application/json" \\
  -d '{"html":"&lt;h1&gt;Hello agents&lt;/h1&gt;","title":"Demo"}'</div>
  </div>
</section>

<section id="mcp" style="background: rgba(26,26,26,0.02);">
  <div class="container">
    <div class="mcp-banner doodle-border">
      <div>
        <h3><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M7 10 L12 13 L17 10" stroke="#2563eb" stroke-width="2.5"/></svg> ${t.mcpH3} <span class="endpoint">/mcp</span></h3>
        <p>${t.mcpP}</p>
      </div>
      <a class="btn blue" href="/agents.md">${t.mcpCta}</a>
    </div>
  </div>
</section>

<section>
  <div class="container">
    <div class="section-header">
      <h2>${t.featuresH2}</h2>
      <p>${t.featuresP}</p>
    </div>
    <div class="features">
      <article class="feature doodle-border">
        <h3><span class="feature-icon accent"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span> ${t.f1Title}</h3>
        <p>${t.f1Desc}</p>
      </article>
      <article class="feature doodle-border">
        <h3><span class="feature-icon blue"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2" fill="#2563eb" opacity=".15" stroke="#2563eb" stroke-width="1.5"/><circle cx="15" cy="12" r="3" fill="#f59e0b" stroke="#1a1a1a" stroke-width="1.5"/><path d="M3 10h18" stroke="#2563eb" stroke-width="1.5"/></svg></span> ${t.f2Title}</h3>
        <p>${t.f2Desc}</p>
      </article>
      <article class="feature doodle-border">
        <h3><span class="feature-icon lemon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></span> ${t.f3Title}</h3>
        <p>${t.f3Desc}</p>
      </article>
      <article class="feature doodle-border">
        <h3><span class="feature-icon blue"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span> ${t.f4Title}</h3>
        <p>${t.f4Desc}</p>
      </article>
      <article class="feature doodle-border">
        <h3><span class="feature-icon accent"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span> ${t.f5Title}</h3>
        <p>${t.f5Desc}</p>
      </article>
      <article class="feature doodle-border">
        <h3><span class="feature-icon lemon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span> ${t.f6Title}</h3>
        <p>${t.f6Desc}</p>
      </article>
    </div>
  </div>
</section>

<section style="background: rgba(26,26,26,0.02);">
  <div class="container">
    <div class="section-header">
      <h2>${t.howH2}</h2>
      <p>${t.howP}</p>
    </div>
    <div class="steps">
      <div class="step doodle-border">
        <div class="step-num">1</div>
        <h4>${t.s1Title}</h4>
        <p>${t.s1Desc}</p>
      </div>
      <div class="step doodle-border">
        <div class="step-num">2</div>
        <h4>${t.s2Title}</h4>
        <p>${t.s2Desc}</p>
      </div>
      <div class="step doodle-border">
        <div class="step-num">3</div>
        <h4>${t.s3Title}</h4>
        <p>${t.s3Desc}</p>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="container">
    ${t.footer} · <a href="/agents.md">agents.md</a> · <a href="https://github.com/vin-spiegel/pin-publish" target="_blank" rel="noopener">GitHub</a>
  </div>
</footer>
</body>
</html>`;
}
