/**
 * i18n landing page.
 *
 * Strings are extracted into a per-locale dictionary. The active locale is
 * resolved from the visitor's `Accept-Language` header (see `resolveLocale`).
 * Technical tokens (htmldrop, publish_html, MCP, SSE, OG, TTL, agents.md,
 * GitHub) are intentionally left untranslated.
 */

export type Locale = 'en' | 'ko' | 'ja' | 'zh' | 'es' | 'fr' | 'de';

export const DEFAULT_LOCALE: Locale = 'en';

export const SUPPORTED: Locale[] = ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de'];

export const SUPPORTED_LOCALES: readonly Locale[] = SUPPORTED;

/** URL path each locale lives at. English is the root (and the x-default). */
export function localePath(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/' : `/${locale}`;
}

/** Native-language labels for the footer language switcher. */
export const LANGUAGE_LABELS: ReadonlyArray<[Locale, string]> = [
  ['en', 'English'],
  ['ko', '한국어'],
  ['ja', '日本語'],
  ['zh', '中文'],
  ['es', 'Español'],
  ['fr', 'Français'],
  ['de', 'Deutsch'],
];

export const OG_LOCALES: Record<Locale, string> = {
  en: 'en_US',
  ko: 'ko_KR',
  ja: 'ja_JP',
  zh: 'zh_CN',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
};

export interface Strings {
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
  dropTitle: string;
  dropHint: string;
  dropBusy: string;
  dropDone: string;
  dropCopy: string;
  dropCopied: string;
  dropOpen: string;
  dropAgain: string;
  dropErr: string;
  finaleH2: string;
  finaleCta: string;
  howH2: string;
  howP: string;
  s1Title: string;
  s1Desc: string;
  s2Title: string;
  s2Desc: string;
  s3Title: string;
  s3Desc: string;
  faqH2: string;
  faqP: string;
  faq: ReadonlyArray<{ q: string; a: string }>;
  footer: string;
}

export const translations: Record<Locale, Strings> = {
  en: {
    htmlLang: 'en',
    metaTitle: 'htmldrop — Publish anything as a shareable link in seconds',
    metaDesc:
      'Drop a file or POST it to one API and get a shareable link instantly. Free hosting for HTML, Markdown, PDF, and images with social preview cards and an MCP server for AI agents.',
    ogTitle: 'htmldrop — Publish anything as a shareable link in seconds',
    ogDesc: 'POST HTML, Markdown, PDF, or an image — get a shareable link. MCP server included.',
    navApi: 'API',
    navMcp: 'MCP',
    heroLine1: 'Publish anything',
    heroAccent: 'in seconds',
    tagline:
      'htmldrop turns any artifact — HTML, Markdown, PDF, images — into a shareable link with one API call. Anything an agent creates.',
    ctaTryApi: 'Try the API',
    ctaReadAgents: 'Read agents.md',
    apiH2: 'One endpoint. One link.',
    apiP: 'Send HTML as JSON, raw body, or fetch it from a URL. Hosting, preview cards, and expiry are handled for you.',
    apiReturns: '→ returns {"url":"...","id":"...","expires_at":"..."}',
    mcpH3: 'MCP Server at',
    mcpP: 'Connect any MCP client via Server-Sent Events and call publish_html directly from the agent.',
    mcpCta: 'See agents.md',
    featuresH2: 'Built for agents, safe for humans.',
    featuresP: 'Just the essentials, nothing to configure.',
    f1Title: 'MCP over SSE',
    f1Desc: 'Expose publish_html as a tool. Agents publish instantly without reading API docs.',
    f2Title: 'Social cards',
    f2Desc: 'Open Graph + Twitter Cards with a generated preview image, automatically.',
    f3Title: 'Optional password',
    f3Desc: 'Lock artifacts behind a password. The link stays easy to share.',
    f4Title: 'Expires by default',
    f4Desc: 'Every link has a TTL, so shared artifacts don’t live forever.',
    dropTitle: 'Drop a file here',
    dropHint: 'HTML · MD · PDF · images · or click / paste',
    dropBusy: 'Publishing…',
    dropDone: 'Your link is live!',
    dropCopy: 'Copy',
    dropCopied: 'Copied!',
    dropOpen: 'Open',
    dropAgain: 'Publish another',
    dropErr: 'Something went wrong. Try again.',
    finaleH2: 'Ready to publish something?',
    finaleCta: 'Drop a file now',
    howH2: 'How it works',
    howP: 'Three steps from HTML artifact to shareable URL.',
    s1Title: 'Send HTML',
    s1Desc: 'POST JSON, raw HTML, or point us at a URL.',
    s2Title: 'htmldrop hosts it',
    s2Desc: 'We store the file and generate a social preview.',
    s3Title: 'Get a link',
    s3Desc: 'Receive a URL on its own subdomain, ready to share.',
    faqH2: 'Frequently asked questions',
    faqP: 'Everything about uploading and hosting HTML files with htmldrop.',
    faq: [
      {
        q: 'How do I upload and publish an HTML file?',
        a: 'Three ways: drag and drop the file onto this page, POST it to the /publish API, or let an AI agent call the publish_html MCP tool. Either way you get a live URL on its own subdomain in seconds — no account, no build step, no configuration.',
      },
      {
        q: 'Is htmldrop free?',
        a: 'Yes. Publishing HTML with htmldrop is free and requires no sign-up. Drop a file or make one API call and share the link.',
      },
      {
        q: 'How long does a published link stay online?',
        a: 'Every link has a TTL. Anonymous publishes stay up for 7 days by default; publishing with an owner key extends that to 30 days. Expiry is a feature — shared artifacts don’t live on the internet forever.',
      },
      {
        q: 'Can my HTML file use CSS, JavaScript, and images?',
        a: 'Yes. Upload a single self-contained HTML file with inline CSS and JavaScript. External stylesheets, scripts, fonts, and images referenced by absolute URLs (for example from a CDN) work too.',
      },
      {
        q: 'What is the maximum file size?',
        a: 'Up to 25 MB per HTML file — more than enough for reports, dashboards, charts, and interactive demos.',
      },
      {
        q: 'Can I password-protect a published page?',
        a: 'Yes. Pass an optional password when publishing and viewers will be asked for it before the page renders. The link itself stays clean and easy to share.',
      },
      {
        q: 'What is the MCP server for?',
        a: 'AI agents (Claude, and any MCP-compatible client) connect over Server-Sent Events at /mcp and call publish_html directly — no API docs to read. It’s the fastest way for an agent to turn generated HTML into a shareable link.',
      },
    ],
    footer: 'Built for agents',
  },
  ko: {
    htmlLang: 'ko',
    metaTitle: 'htmldrop — 무엇이든 몇 초 만에 공유 링크로',
    metaDesc:
      'HTML·마크다운·PDF·이미지를 끌어다 놓거나 API 한 번 호출로 업로드하면 즉시 공유 링크가 생깁니다. 무료 호스팅에 소셜 미리보기 카드, AI 에이전트용 MCP 서버까지.',
    ogTitle: 'htmldrop — 무엇이든 몇 초 만에 공유 링크로',
    ogDesc: 'HTML·마크다운·PDF·이미지를 POST하면 공유 링크가 나옵니다. MCP 서버 포함.',
    navApi: 'API',
    navMcp: 'MCP',
    heroLine1: '무엇이든 게시,',
    heroAccent: '몇 초면 끝',
    tagline:
      'htmldrop은 API 호출 한 번으로 어떤 결과물이든 — HTML, 마크다운, PDF, 이미지 — 공유 링크로 만들어 줍니다. 에이전트가 만든 무엇이든.',
    ctaTryApi: 'API 사용해 보기',
    ctaReadAgents: 'agents.md 보기',
    apiH2: '엔드포인트 하나, 링크 하나.',
    apiP: 'HTML을 JSON, 원본 본문으로 보내거나 URL에서 가져오세요. 호스팅, 미리보기 카드, 만료까지 알아서 처리합니다.',
    apiReturns: '→ 반환값 {"url":"...","id":"...","expires_at":"..."}',
    mcpH3: 'MCP 서버 위치',
    mcpP: 'Server-Sent Events로 어떤 MCP 클라이언트든 연결하고 에이전트에서 곧바로 publish_html를 호출하세요.',
    mcpCta: 'agents.md 보기',
    featuresH2: '에이전트를 위해 만들고, 사람에게 안전하게.',
    featuresP: '꼭 필요한 것만, 설정 없이.',
    f1Title: 'SSE 기반 MCP',
    f1Desc: 'publish_html를 도구로 노출하세요. 에이전트가 API 문서를 읽지 않고도 바로 게시합니다.',
    f2Title: '소셜 카드',
    f2Desc: 'Open Graph + Twitter 카드와 미리보기 이미지를 자동으로 만들어 줍니다.',
    f3Title: '선택적 비밀번호',
    f3Desc: '결과물을 비밀번호로 잠그세요. 링크는 그대로 공유하기 쉽습니다.',
    f4Title: '만료는 기본',
    f4Desc: '모든 링크에 TTL이 있어, 공유한 결과물이 영원히 남지 않습니다.',
    dropTitle: '여기에 파일을 끌어다 놓으세요',
    dropHint: 'HTML · MD · PDF · 이미지 · 클릭/붙여넣기도 돼요',
    dropBusy: '게시 중…',
    dropDone: '링크가 준비됐어요!',
    dropCopy: '복사',
    dropCopied: '복사됨!',
    dropOpen: '열기',
    dropAgain: '하나 더 게시',
    dropErr: '문제가 생겼어요. 다시 시도해 주세요.',
    finaleH2: '바로 게시해 볼까요?',
    finaleCta: '지금 던져보기',
    howH2: '동작 방식',
    howP: 'HTML 결과물에서 공유 가능한 URL까지 세 단계.',
    s1Title: 'HTML 전송',
    s1Desc: 'JSON, 원본 HTML을 POST하거나 URL을 알려주세요.',
    s2Title: 'htmldrop이 호스팅',
    s2Desc: '파일을 저장하고 소셜 미리보기를 생성합니다.',
    s3Title: '링크 받기',
    s3Desc: '바로 공유할 수 있는 전용 서브도메인 URL을 받으세요.',
    faqH2: '자주 묻는 질문',
    faqP: 'htmldrop으로 HTML 파일을 업로드하고 호스팅하는 것에 대한 모든 것.',
    faq: [
      {
        q: 'HTML 파일은 어떻게 업로드하고 게시하나요?',
        a: '세 가지 방법이 있어요. 이 페이지에 파일을 끌어다 놓거나, /publish API로 POST하거나, AI 에이전트가 publish_html MCP 도구를 호출하면 됩니다. 어느 쪽이든 몇 초 안에 전용 서브도메인 URL이 나옵니다 — 계정도, 빌드도, 설정도 필요 없어요.',
      },
      {
        q: 'htmldrop은 무료인가요?',
        a: '네. htmldrop으로 HTML을 게시하는 것은 무료이고 회원가입도 필요 없습니다. 파일을 던지거나 API를 한 번 호출하고 링크를 공유하세요.',
      },
      {
        q: '게시한 링크는 얼마나 오래 유지되나요?',
        a: '모든 링크에는 TTL이 있습니다. 익명 게시는 기본 7일, 소유자 키를 사용하면 30일까지 유지됩니다. 만료는 의도된 기능이에요 — 공유한 결과물이 인터넷에 영원히 남지 않습니다.',
      },
      {
        q: 'HTML 파일에서 CSS, JavaScript, 이미지를 쓸 수 있나요?',
        a: '네. 인라인 CSS와 JavaScript가 포함된 단일 HTML 파일을 업로드하세요. CDN 등 절대 URL로 참조하는 외부 스타일시트, 스크립트, 폰트, 이미지도 잘 동작합니다.',
      },
      {
        q: '파일 크기 제한은 얼마인가요?',
        a: 'HTML 파일 하나당 최대 25MB입니다. 리포트, 대시보드, 차트, 인터랙티브 데모에 충분한 크기예요.',
      },
      {
        q: '게시한 페이지에 비밀번호를 걸 수 있나요?',
        a: '네. 게시할 때 비밀번호를 지정하면 페이지가 열리기 전에 비밀번호를 묻습니다. 링크 자체는 깔끔하게 유지되어 공유하기 쉽습니다.',
      },
      {
        q: 'MCP 서버는 어디에 쓰나요?',
        a: 'AI 에이전트(Claude 등 MCP 호환 클라이언트)가 /mcp에서 Server-Sent Events로 연결해 publish_html을 직접 호출합니다. API 문서를 읽을 필요 없이, 에이전트가 만든 HTML을 공유 링크로 바꾸는 가장 빠른 방법이에요.',
      },
    ],
    footer: '에이전트를 위해 제작됨',
  },
  ja: {
    htmlLang: 'ja',
    metaTitle: 'htmldrop — なんでも数秒で共有リンクに',
    metaDesc:
      'ファイルをドロップするかAPIを1回呼ぶだけで、すぐに共有リンクを取得。HTML・Markdown・PDF・画像の無料ホスティングに、ソーシャルプレビューカードとAIエージェント向けMCPサーバー付き。',
    ogTitle: 'htmldrop — なんでも数秒で共有リンクに',
    ogDesc: 'HTML・Markdown・PDF・画像をPOSTすれば共有リンクが返ります。MCPサーバー付き。',
    navApi: 'API',
    navMcp: 'MCP',
    heroLine1: 'なんでも公開',
    heroAccent: '数秒で',
    tagline:
      'htmldropはあらゆる成果物 — HTML、Markdown、PDF、画像 — を、API呼び出し1回で共有リンクに変えます。エージェントが作るものすべて。',
    ctaTryApi: 'APIを試す',
    ctaReadAgents: 'agents.mdを読む',
    apiH2: 'エンドポイント1つ、リンク1つ。',
    apiP: 'HTMLをJSON・生のボディで送るか、URLから取得します。ホスティング、プレビューカード、期限切れまで自動で処理します。',
    apiReturns: '→ 戻り値 {"url":"...","id":"...","expires_at":"..."}',
    mcpH3: 'MCPサーバー',
    mcpP: 'Server-Sent Eventsで任意のMCPクライアントを接続し、エージェントから直接publish_htmlを呼び出せます。',
    mcpCta: 'agents.mdを見る',
    featuresH2: 'エージェントのために、人にやさしく。',
    featuresP: '必要なものだけ、設定いらずで。',
    f1Title: 'SSE経由のMCP',
    f1Desc: 'publish_htmlをツールとして公開。エージェントはAPIドキュメントを読まずに即座に公開します。',
    f2Title: 'ソーシャルカード',
    f2Desc: 'Open Graph + Twitterカードとプレビュー画像を自動生成します。',
    f3Title: '任意のパスワード',
    f3Desc: '成果物をパスワードで保護。リンクは共有しやすいままです。',
    f4Title: 'デフォルトで期限切れ',
    f4Desc: 'すべてのリンクにTTLがあり、共有した成果物が永遠に残ることはありません。',
    dropTitle: 'ここにファイルをドロップ',
    dropHint: 'HTML · MD · PDF · 画像 · クリック/貼り付けもOK',
    dropBusy: '公開中…',
    dropDone: 'リンクができました！',
    dropCopy: 'コピー',
    dropCopied: 'コピーしました！',
    dropOpen: '開く',
    dropAgain: 'もう1つ公開',
    dropErr: 'エラーが発生しました。もう一度お試しください。',
    finaleH2: 'さっそく公開してみませんか？',
    finaleCta: '今すぐドロップ',
    howH2: '仕組み',
    howP: 'HTML成果物から共有可能なURLまで3ステップ。',
    s1Title: 'HTMLを送る',
    s1Desc: 'JSON、生のHTMLをPOSTするか、URLを指定します。',
    s2Title: 'htmldropがホスト',
    s2Desc: 'ファイルを保存し、ソーシャルプレビューを生成します。',
    s3Title: 'リンクを取得',
    s3Desc: 'すぐ共有できる専用サブドメインURLを受け取ります。',
    faqH2: 'よくある質問',
    faqP: 'htmldropでのHTMLファイルのアップロードとホスティングについて。',
    faq: [
      {
        q: 'HTMLファイルはどうやってアップロード・公開しますか？',
        a: '方法は3つ。このページにファイルをドラッグ＆ドロップする、/publish APIにPOSTする、またはAIエージェントがpublish_html MCPツールを呼び出す。どの方法でも数秒で専用サブドメインのURLが手に入ります — アカウントもビルドも設定も不要です。',
      },
      {
        q: 'htmldropは無料ですか？',
        a: 'はい。htmldropでのHTML公開は無料で、登録も不要です。ファイルをドロップするかAPIを1回呼んで、リンクを共有するだけ。',
      },
      {
        q: '公開したリンクはどのくらい残りますか？',
        a: 'すべてのリンクにTTLがあります。匿名公開はデフォルトで7日間、オーナーキーを使えば30日間まで延長できます。期限切れは仕様です — 共有した成果物が永遠にインターネットに残ることはありません。',
      },
      {
        q: 'HTMLでCSS・JavaScript・画像は使えますか？',
        a: 'はい。インラインのCSSとJavaScriptを含む単一のHTMLファイルをアップロードしてください。CDNなど絶対URLで参照する外部のスタイルシート、スクリプト、フォント、画像も動作します。',
      },
      {
        q: 'ファイルサイズの上限は？',
        a: 'HTMLファイル1つにつき最大25MB。レポート、ダッシュボード、チャート、インタラクティブなデモには十分な容量です。',
      },
      {
        q: '公開ページにパスワードをかけられますか？',
        a: 'はい。公開時にパスワードを指定すると、ページ表示前にパスワード入力を求めます。リンク自体はクリーンなまま共有しやすい形です。',
      },
      {
        q: 'MCPサーバーは何のためにありますか？',
        a: 'AIエージェント（ClaudeなどMCP対応クライアント）が/mcpにServer-Sent Eventsで接続し、publish_htmlを直接呼び出せます。APIドキュメントを読む必要なし — エージェントが生成したHTMLを共有リンクに変える最速の方法です。',
      },
    ],
    footer: 'エージェントのために構築',
  },
  zh: {
    htmlLang: 'zh-CN',
    metaTitle: 'htmldrop — 几秒内把任何内容变成可分享链接',
    metaDesc:
      '拖放文件或调用一次 API，立即获得可分享链接。免费托管 HTML、Markdown、PDF 和图片，自动生成社交预览卡片，并内置面向 AI 智能体的 MCP 服务器。',
    ogTitle: 'htmldrop — 几秒内把任何内容变成可分享链接',
    ogDesc: 'POST HTML、Markdown、PDF 或图片，即得可分享链接。内置 MCP 服务器。',
    navApi: 'API',
    navMcp: 'MCP',
    heroLine1: '发布任何内容',
    heroAccent: '只需几秒',
    tagline:
      'htmldrop 通过一次 API 调用，将任何产物 — HTML、Markdown、PDF、图片 — 变成可分享的链接。智能体创建的一切。',
    ctaTryApi: '试用 API',
    ctaReadAgents: '阅读 agents.md',
    apiH2: '一个端点，一个链接。',
    apiP: '以 JSON、原始正文发送 HTML，或从 URL 抓取。托管、预览卡片和过期都自动处理。',
    apiReturns: '→ 返回 {"url":"...","id":"...","expires_at":"..."}',
    mcpH3: 'MCP 服务器位于',
    mcpP: '通过 Server-Sent Events 连接任意 MCP 客户端，直接从智能体调用 publish_html。',
    mcpCta: '查看 agents.md',
    featuresH2: '为智能体打造，对人类安全。',
    featuresP: '只保留必需的，无需配置。',
    f1Title: '基于 SSE 的 MCP',
    f1Desc: '将 publish_html 暴露为工具。智能体无需阅读 API 文档即可即时发布。',
    f2Title: '社交卡片',
    f2Desc: '自动生成 Open Graph + Twitter 卡片和预览图片。',
    f3Title: '可选密码',
    f3Desc: '用密码锁定内容，链接依然便于分享。',
    f4Title: '默认过期',
    f4Desc: '每个链接都有 TTL，分享的内容不会永远存在。',
    dropTitle: '将文件拖到这里',
    dropHint: 'HTML · MD · PDF · 图片 · 也可点击/粘贴',
    dropBusy: '发布中…',
    dropDone: '链接已就绪！',
    dropCopy: '复制',
    dropCopied: '已复制！',
    dropOpen: '打开',
    dropAgain: '再发布一个',
    dropErr: '出错了，请重试。',
    finaleH2: '要不要马上发布一个？',
    finaleCta: '立即拖放',
    howH2: '工作原理',
    howP: '从 HTML 内容到可分享 URL，只需三步。',
    s1Title: '发送 HTML',
    s1Desc: 'POST JSON、原始 HTML，或指向一个 URL。',
    s2Title: 'htmldrop 托管',
    s2Desc: '我们保存文件并生成社交预览。',
    s3Title: '获取链接',
    s3Desc: '获得一个可直接分享的专属子域名 URL。',
    faqH2: '常见问题',
    faqP: '关于用 htmldrop 上传和托管 HTML 文件的一切。',
    faq: [
      {
        q: '如何上传并发布 HTML 文件？',
        a: '三种方式：把文件拖放到本页面、POST 到 /publish API，或让 AI 智能体调用 publish_html MCP 工具。任何一种方式都能在几秒内获得专属子域名 URL — 无需账号、无需构建、无需配置。',
      },
      {
        q: 'htmldrop 免费吗？',
        a: '免费。用 htmldrop 发布 HTML 无需注册，拖一个文件或调用一次 API，就能分享链接。',
      },
      {
        q: '发布的链接能保留多久？',
        a: '每个链接都有 TTL。匿名发布默认保留 7 天，使用所有者密钥可延长到 30 天。过期是有意设计的 — 分享的内容不会永远留在互联网上。',
      },
      {
        q: 'HTML 文件里可以用 CSS、JavaScript 和图片吗？',
        a: '可以。上传包含内联 CSS 和 JavaScript 的单个 HTML 文件即可。通过绝对 URL（例如 CDN）引用的外部样式表、脚本、字体和图片也都能正常工作。',
      },
      {
        q: '文件大小限制是多少？',
        a: '每个 HTML 文件最大 25MB — 对报告、仪表盘、图表和交互式演示来说绰绰有余。',
      },
      {
        q: '可以给发布的页面设置密码吗？',
        a: '可以。发布时传入可选密码，访问者需要输入密码才能查看页面。链接本身保持干净，依然易于分享。',
      },
      {
        q: 'MCP 服务器是干什么的？',
        a: 'AI 智能体（Claude 及任何 MCP 兼容客户端）通过 Server-Sent Events 连接 /mcp，直接调用 publish_html — 不用读 API 文档。这是智能体把生成的 HTML 变成分享链接的最快方式。',
      },
    ],
    footer: '为智能体而建',
  },
  es: {
    htmlLang: 'es',
    metaTitle: 'htmldrop — Publica cualquier cosa como enlace en segundos',
    metaDesc:
      'Arrastra un archivo o envíalo a una API y obtén un enlace para compartir al instante. Alojamiento gratis de HTML, Markdown, PDF e imágenes con tarjetas sociales y servidor MCP para agentes de IA.',
    ogTitle: 'htmldrop — Publica cualquier cosa como enlace en segundos',
    ogDesc: 'Envía HTML, Markdown, PDF o una imagen por POST y obtén un enlace. Servidor MCP incluido.',
    navApi: 'API',
    navMcp: 'MCP',
    heroLine1: 'Publica cualquier cosa',
    heroAccent: 'en segundos',
    tagline:
      'htmldrop convierte cualquier artefacto — HTML, Markdown, PDF, imágenes — en un enlace para compartir con una sola llamada a la API. Todo lo que un agente cree.',
    ctaTryApi: 'Probar la API',
    ctaReadAgents: 'Leer agents.md',
    apiH2: 'Un endpoint. Un enlace.',
    apiP: 'Envía HTML como JSON, cuerpo en bruto o recupéralo desde una URL. El alojamiento, las tarjetas de vista previa y la caducidad se gestionan por ti.',
    apiReturns: '→ devuelve {"url":"...","id":"...","expires_at":"..."}',
    mcpH3: 'Servidor MCP en',
    mcpP: 'Conecta cualquier cliente MCP mediante Server-Sent Events y llama a publish_html directamente desde el agente.',
    mcpCta: 'Ver agents.md',
    featuresH2: 'Hecho para agentes, seguro para humanos.',
    featuresP: 'Solo lo esencial, nada que configurar.',
    f1Title: 'MCP sobre SSE',
    f1Desc: 'Expón publish_html como herramienta. Los agentes publican al instante sin leer la documentación de la API.',
    f2Title: 'Tarjetas sociales',
    f2Desc: 'Open Graph + Twitter Cards con imagen de vista previa generada, automáticamente.',
    f3Title: 'Contraseña opcional',
    f3Desc: 'Protege los artefactos con contraseña. El enlace sigue siendo fácil de compartir.',
    f4Title: 'Caduca por defecto',
    f4Desc: 'Cada enlace tiene un TTL: lo compartido no vive para siempre.',
    dropTitle: 'Suelta un archivo aquí',
    dropHint: 'HTML · MD · PDF · imágenes · clic o pegar también',
    dropBusy: 'Publicando…',
    dropDone: '¡Tu enlace está listo!',
    dropCopy: 'Copiar',
    dropCopied: '¡Copiado!',
    dropOpen: 'Abrir',
    dropAgain: 'Publicar otro',
    dropErr: 'Algo salió mal. Inténtalo de nuevo.',
    finaleH2: '¿Listo para publicar algo?',
    finaleCta: 'Suelta un archivo',
    howH2: 'Cómo funciona',
    howP: 'Tres pasos del artefacto HTML a una URL para compartir.',
    s1Title: 'Envía HTML',
    s1Desc: 'POST de JSON, HTML en bruto o indícanos una URL.',
    s2Title: 'htmldrop lo aloja',
    s2Desc: 'Guardamos el archivo y generamos una vista previa social.',
    s3Title: 'Obtén un enlace',
    s3Desc: 'Recibe una URL con su propio subdominio, lista para compartir.',
    faqH2: 'Preguntas frecuentes',
    faqP: 'Todo sobre subir y alojar archivos HTML con htmldrop.',
    faq: [
      {
        q: '¿Cómo subo y publico un archivo HTML?',
        a: 'Hay tres formas: arrastra el archivo a esta página, envíalo por POST a la API /publish, o deja que un agente de IA llame a la herramienta MCP publish_html. En segundos tendrás una URL en su propio subdominio — sin cuenta, sin build, sin configuración.',
      },
      {
        q: '¿htmldrop es gratis?',
        a: 'Sí. Publicar HTML con htmldrop es gratis y no requiere registro. Suelta un archivo o haz una llamada a la API y comparte el enlace.',
      },
      {
        q: '¿Cuánto tiempo permanece online un enlace publicado?',
        a: 'Cada enlace tiene un TTL. Las publicaciones anónimas duran 7 días por defecto; con una clave de propietario se extiende a 30 días. La caducidad es una característica: lo compartido no vive en internet para siempre.',
      },
      {
        q: '¿Mi HTML puede usar CSS, JavaScript e imágenes?',
        a: 'Sí. Sube un único archivo HTML autocontenido con CSS y JavaScript en línea. También funcionan hojas de estilo, scripts, fuentes e imágenes externas referenciadas por URL absoluta (por ejemplo desde un CDN).',
      },
      {
        q: '¿Cuál es el tamaño máximo de archivo?',
        a: 'Hasta 25 MB por archivo HTML: más que suficiente para informes, paneles, gráficos y demos interactivas.',
      },
      {
        q: '¿Puedo proteger una página con contraseña?',
        a: 'Sí. Indica una contraseña opcional al publicar y se pedirá antes de mostrar la página. El enlace se mantiene limpio y fácil de compartir.',
      },
      {
        q: '¿Para qué sirve el servidor MCP?',
        a: 'Los agentes de IA (Claude y cualquier cliente compatible con MCP) se conectan por Server-Sent Events en /mcp y llaman a publish_html directamente, sin leer documentación de la API. Es la vía más rápida para convertir HTML generado en un enlace compartible.',
      },
    ],
    footer: 'Hecho para agentes',
  },
  fr: {
    htmlLang: 'fr',
    metaTitle: 'htmldrop — Publiez tout comme lien partageable en secondes',
    metaDesc:
      'Déposez un fichier ou envoyez-le à une API et obtenez instantanément un lien à partager. Hébergement gratuit pour HTML, Markdown, PDF et images, cartes sociales et serveur MCP pour agents IA.',
    ogTitle: 'htmldrop — Publiez tout comme lien partageable en secondes',
    ogDesc: 'Envoyez HTML, Markdown, PDF ou une image en POST, recevez un lien. Serveur MCP inclus.',
    navApi: 'API',
    navMcp: 'MCP',
    heroLine1: 'Publiez tout',
    heroAccent: 'en quelques secondes',
    tagline:
      'htmldrop transforme n’importe quel artefact — HTML, Markdown, PDF, images — en lien à partager en un seul appel API. Tout ce qu’un agent crée.',
    ctaTryApi: 'Essayer l’API',
    ctaReadAgents: 'Lire agents.md',
    apiH2: 'Un endpoint. Un lien.',
    apiP: 'Envoyez du HTML en JSON, en corps brut ou depuis une URL. Hébergement, cartes d’aperçu et expiration sont gérés pour vous.',
    apiReturns: '→ renvoie {"url":"...","id":"...","expires_at":"..."}',
    mcpH3: 'Serveur MCP sur',
    mcpP: 'Connectez n’importe quel client MCP via Server-Sent Events et appelez publish_html directement depuis l’agent.',
    mcpCta: 'Voir agents.md',
    featuresH2: 'Conçu pour les agents, sûr pour les humains.',
    featuresP: 'Juste l’essentiel, rien à configurer.',
    f1Title: 'MCP via SSE',
    f1Desc: 'Exposez publish_html comme outil. Les agents publient instantanément sans lire la documentation API.',
    f2Title: 'Cartes sociales',
    f2Desc: 'Open Graph + Twitter Cards avec image d’aperçu générée, automatiquement.',
    f3Title: 'Mot de passe optionnel',
    f3Desc: 'Verrouillez les artefacts par mot de passe. Le lien reste facile à partager.',
    f4Title: 'Expiration par défaut',
    f4Desc: 'Chaque lien a un TTL — rien ne reste en ligne pour toujours.',
    dropTitle: 'Déposez un fichier ici',
    dropHint: 'HTML · MD · PDF · images · clic ou collage aussi',
    dropBusy: 'Publication…',
    dropDone: 'Votre lien est prêt !',
    dropCopy: 'Copier',
    dropCopied: 'Copié !',
    dropOpen: 'Ouvrir',
    dropAgain: 'Publier un autre',
    dropErr: 'Une erreur est survenue. Réessayez.',
    finaleH2: 'Prêt à publier quelque chose ?',
    finaleCta: 'Déposez un fichier',
    howH2: 'Comment ça marche',
    howP: 'Trois étapes de l’artefact HTML à une URL partageable.',
    s1Title: 'Envoyez du HTML',
    s1Desc: 'POST de JSON, HTML brut, ou indiquez-nous une URL.',
    s2Title: 'htmldrop l’héberge',
    s2Desc: 'Nous stockons le fichier et générons un aperçu social.',
    s3Title: 'Obtenez un lien',
    s3Desc: 'Recevez une URL avec son propre sous-domaine, prête à partager.',
    faqH2: 'Questions fréquentes',
    faqP: 'Tout sur l’envoi et l’hébergement de fichiers HTML avec htmldrop.',
    faq: [
      {
        q: 'Comment publier un fichier HTML ?',
        a: 'Trois façons : glissez-déposez le fichier sur cette page, envoyez-le en POST à l’API /publish, ou laissez un agent IA appeler l’outil MCP publish_html. Dans tous les cas, vous obtenez en quelques secondes une URL sur son propre sous-domaine — sans compte, sans build, sans configuration.',
      },
      {
        q: 'htmldrop est-il gratuit ?',
        a: 'Oui. Publier du HTML avec htmldrop est gratuit et sans inscription. Déposez un fichier ou faites un appel API, puis partagez le lien.',
      },
      {
        q: 'Combien de temps un lien publié reste-t-il en ligne ?',
        a: 'Chaque lien a un TTL. Les publications anonymes durent 7 jours par défaut ; avec une clé propriétaire, jusqu’à 30 jours. L’expiration est voulue — ce que vous partagez ne reste pas en ligne pour toujours.',
      },
      {
        q: 'Mon HTML peut-il utiliser CSS, JavaScript et des images ?',
        a: 'Oui. Envoyez un fichier HTML autonome avec CSS et JavaScript en ligne. Les feuilles de style, scripts, polices et images externes référencés par URL absolue (par exemple depuis un CDN) fonctionnent aussi.',
      },
      {
        q: 'Quelle est la taille maximale de fichier ?',
        a: 'Jusqu’à 25 Mo par fichier HTML — largement assez pour des rapports, tableaux de bord, graphiques et démos interactives.',
      },
      {
        q: 'Puis-je protéger une page par mot de passe ?',
        a: 'Oui. Indiquez un mot de passe optionnel à la publication : il sera demandé avant l’affichage de la page. Le lien reste propre et facile à partager.',
      },
      {
        q: 'À quoi sert le serveur MCP ?',
        a: 'Les agents IA (Claude et tout client compatible MCP) se connectent en Server-Sent Events sur /mcp et appellent publish_html directement, sans lire la documentation de l’API. C’est le moyen le plus rapide de transformer du HTML généré en lien partageable.',
      },
    ],
    footer: 'Conçu pour les agents',
  },
  de: {
    htmlLang: 'de',
    metaTitle: 'htmldrop — Alles in Sekunden als teilbaren Link veröffentlichen',
    metaDesc:
      'Datei ablegen oder per API senden und sofort einen teilbaren Link erhalten. Kostenloses Hosting für HTML, Markdown, PDF und Bilder mit Social Cards und MCP-Server für KI-Agenten.',
    ogTitle: 'htmldrop — Alles in Sekunden als teilbaren Link veröffentlichen',
    ogDesc: 'HTML, Markdown, PDF oder ein Bild per POST senden, Link erhalten. MCP-Server inklusive.',
    navApi: 'API',
    navMcp: 'MCP',
    heroLine1: 'Alles veröffentlichen',
    heroAccent: 'in Sekunden',
    tagline:
      'htmldrop verwandelt jedes Artefakt — HTML, Markdown, PDF, Bilder — mit einem einzigen API-Aufruf in einen teilbaren Link. Alles, was ein Agent erstellt.',
    ctaTryApi: 'API ausprobieren',
    ctaReadAgents: 'agents.md lesen',
    apiH2: 'Ein Endpoint. Ein Link.',
    apiP: 'Sende HTML als JSON, als Rohtext oder von einer URL. Hosting, Vorschaukarten und Ablauf werden für dich erledigt.',
    apiReturns: '→ liefert {"url":"...","id":"...","expires_at":"..."}',
    mcpH3: 'MCP-Server unter',
    mcpP: 'Verbinde jeden MCP-Client über Server-Sent Events und rufe publish_html direkt aus dem Agenten auf.',
    mcpCta: 'agents.md ansehen',
    featuresH2: 'Für Agenten gebaut, sicher für Menschen.',
    featuresP: 'Nur das Wesentliche, nichts zu konfigurieren.',
    f1Title: 'MCP über SSE',
    f1Desc: 'Stelle publish_html als Tool bereit. Agenten veröffentlichen sofort, ohne API-Doku zu lesen.',
    f2Title: 'Social Cards',
    f2Desc: 'Open Graph + Twitter Cards mit generiertem Vorschaubild, automatisch.',
    f3Title: 'Optionales Passwort',
    f3Desc: 'Sperre Artefakte hinter einem Passwort. Der Link bleibt leicht teilbar.',
    f4Title: 'Läuft standardmäßig ab',
    f4Desc: 'Jeder Link hat eine TTL — Geteiltes bleibt nicht für immer online.',
    dropTitle: 'Datei hier ablegen',
    dropHint: 'HTML · MD · PDF · Bilder · Klicken/Einfügen geht auch',
    dropBusy: 'Wird veröffentlicht…',
    dropDone: 'Dein Link ist live!',
    dropCopy: 'Kopieren',
    dropCopied: 'Kopiert!',
    dropOpen: 'Öffnen',
    dropAgain: 'Noch eins veröffentlichen',
    dropErr: 'Etwas ist schiefgelaufen. Versuch es erneut.',
    finaleH2: 'Bereit, etwas zu veröffentlichen?',
    finaleCta: 'Jetzt Datei ablegen',
    howH2: 'So funktioniert es',
    howP: 'Drei Schritte vom HTML-Artefakt zur teilbaren URL.',
    s1Title: 'HTML senden',
    s1Desc: 'POST von JSON, rohem HTML, oder gib uns eine URL.',
    s2Title: 'htmldrop hostet es',
    s2Desc: 'Wir speichern die Datei und erzeugen eine Social-Vorschau.',
    s3Title: 'Link erhalten',
    s3Desc: 'Erhalte eine URL mit eigener Subdomain, bereit zum Teilen.',
    faqH2: 'Häufige Fragen',
    faqP: 'Alles über das Hochladen und Hosten von HTML-Dateien mit htmldrop.',
    faq: [
      {
        q: 'Wie lade ich eine HTML-Datei hoch und veröffentliche sie?',
        a: 'Drei Wege: Datei auf diese Seite ziehen, per POST an die /publish-API senden, oder einen KI-Agenten das MCP-Tool publish_html aufrufen lassen. In jedem Fall bekommst du in Sekunden eine URL auf eigener Subdomain — ohne Konto, ohne Build, ohne Konfiguration.',
      },
      {
        q: 'Ist htmldrop kostenlos?',
        a: 'Ja. HTML mit htmldrop zu veröffentlichen ist kostenlos und erfordert keine Registrierung. Datei ablegen oder einen API-Aufruf machen und den Link teilen.',
      },
      {
        q: 'Wie lange bleibt ein veröffentlichter Link online?',
        a: 'Jeder Link hat eine TTL. Anonyme Veröffentlichungen bleiben standardmäßig 7 Tage online; mit einem Owner-Key bis zu 30 Tage. Der Ablauf ist gewollt — Geteiltes bleibt nicht für immer im Netz.',
      },
      {
        q: 'Kann meine HTML-Datei CSS, JavaScript und Bilder nutzen?',
        a: 'Ja. Lade eine einzelne, in sich geschlossene HTML-Datei mit Inline-CSS und -JavaScript hoch. Externe Stylesheets, Skripte, Schriften und Bilder über absolute URLs (z. B. von einem CDN) funktionieren ebenfalls.',
      },
      {
        q: 'Wie groß darf die Datei sein?',
        a: 'Bis zu 25 MB pro HTML-Datei — mehr als genug für Berichte, Dashboards, Diagramme und interaktive Demos.',
      },
      {
        q: 'Kann ich eine Seite mit einem Passwort schützen?',
        a: 'Ja. Gib beim Veröffentlichen ein optionales Passwort an — Besucher werden danach gefragt, bevor die Seite erscheint. Der Link selbst bleibt sauber und leicht teilbar.',
      },
      {
        q: 'Wofür ist der MCP-Server?',
        a: 'KI-Agenten (Claude und jeder MCP-kompatible Client) verbinden sich über Server-Sent Events unter /mcp und rufen publish_html direkt auf — ohne API-Doku. Der schnellste Weg, generiertes HTML in einen teilbaren Link zu verwandeln.',
      },
    ],
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
