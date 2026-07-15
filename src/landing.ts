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

const SUPPORTED: Locale[] = ['en', 'ko', 'ja', 'zh', 'es', 'fr', 'de'];

export const SUPPORTED_LOCALES: readonly Locale[] = SUPPORTED;

/** URL path each locale lives at. English is the root (and the x-default). */
export function localePath(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/' : `/${locale}`;
}

/** Native-language labels for the footer language switcher. */
const LANGUAGE_LABELS: ReadonlyArray<[Locale, string]> = [
  ['en', 'English'],
  ['ko', '한국어'],
  ['ja', '日本語'],
  ['zh', '中文'],
  ['es', 'Español'],
  ['fr', 'Français'],
  ['de', 'Deutsch'],
];

const OG_LOCALES: Record<Locale, string> = {
  en: 'en_US',
  ko: 'ko_KR',
  ja: 'ja_JP',
  zh: 'zh_CN',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
};

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

const translations: Record<Locale, Strings> = {
  en: {
    htmlLang: 'en',
    metaTitle: 'htmldrop — Upload & Publish HTML Online in Seconds',
    metaDesc:
      'Drop an HTML file or POST it to one API and get a shareable link instantly. Free HTML hosting with social preview cards and an MCP server for AI agents.',
    ogTitle: 'htmldrop — Upload & Publish HTML Online in Seconds',
    ogDesc: 'POST HTML, get a link. MCP server included.',
    navApi: 'API',
    navMcp: 'MCP',
    heroLine1: 'Publish HTML',
    heroAccent: 'in seconds',
    tagline:
      'htmldrop turns any HTML artifact into a shareable link with one API call. Reports, dashboards, charts, demos — anything an agent creates.',
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
    metaTitle: 'htmldrop — HTML 파일 업로드, 몇 초 만에 공유 링크로',
    metaDesc:
      'HTML 파일을 끌어다 놓거나 API 한 번 호출로 업로드하면 즉시 공유 링크가 생깁니다. 무료 HTML 호스팅에 소셜 미리보기 카드, AI 에이전트용 MCP 서버까지.',
    ogTitle: 'htmldrop — HTML 파일 업로드, 몇 초 만에 공유 링크로',
    ogDesc: 'HTML을 POST하면 링크가 나옵니다. MCP 서버 포함.',
    navApi: 'API',
    navMcp: 'MCP',
    heroLine1: 'HTML 게시,',
    heroAccent: '몇 초면 끝',
    tagline:
      'htmldrop은 API 호출 한 번으로 모든 HTML 결과물을 공유 링크로 만들어 줍니다. 리포트, 대시보드, 차트, 데모 — 에이전트가 만든 무엇이든.',
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
    metaTitle: 'htmldrop — HTMLファイルをアップロードして数秒で公開',
    metaDesc:
      'HTMLファイルをドロップするかAPIを1回呼ぶだけで、すぐに共有リンクを取得。無料のHTMLホスティングに、ソーシャルプレビューカードとAIエージェント向けMCPサーバー付き。',
    ogTitle: 'htmldrop — HTMLファイルをアップロードして数秒で公開',
    ogDesc: 'HTMLをPOSTすればリンクが返ります。MCPサーバー付き。',
    navApi: 'API',
    navMcp: 'MCP',
    heroLine1: 'HTMLを公開',
    heroAccent: '数秒で',
    tagline:
      'htmldropはあらゆるHTML成果物を、API呼び出し1回で共有リンクに変えます。レポート、ダッシュボード、チャート、デモ — エージェントが作るものすべて。',
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
    metaTitle: 'htmldrop — 上传 HTML 文件，几秒内发布上线',
    metaDesc:
      '拖放 HTML 文件或调用一次 API，立即获得可分享链接。免费 HTML 托管，自动生成社交预览卡片，并内置面向 AI 智能体的 MCP 服务器。',
    ogTitle: 'htmldrop — 上传 HTML 文件，几秒内发布上线',
    ogDesc: 'POST HTML，即得链接。内置 MCP 服务器。',
    navApi: 'API',
    navMcp: 'MCP',
    heroLine1: '发布 HTML',
    heroAccent: '只需几秒',
    tagline:
      'htmldrop 通过一次 API 调用，将任何 HTML 内容变成可分享的链接。报告、仪表盘、图表、演示 — 智能体创建的一切。',
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
    metaTitle: 'htmldrop — Sube y publica HTML online en segundos',
    metaDesc:
      'Arrastra un archivo HTML o envíalo a una API y obtén un enlace para compartir al instante. Alojamiento HTML gratis con tarjetas sociales y servidor MCP para agentes de IA.',
    ogTitle: 'htmldrop — Sube y publica HTML online en segundos',
    ogDesc: 'Envía HTML por POST y obtén un enlace. Servidor MCP incluido.',
    navApi: 'API',
    navMcp: 'MCP',
    heroLine1: 'Publica HTML',
    heroAccent: 'en segundos',
    tagline:
      'htmldrop convierte cualquier artefacto HTML en un enlace para compartir con una sola llamada a la API. Informes, paneles, gráficos, demos: todo lo que un agente cree.',
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
    metaTitle: 'htmldrop — Publiez un fichier HTML en ligne en secondes',
    metaDesc:
      'Déposez un fichier HTML ou envoyez-le à une API et obtenez instantanément un lien à partager. Hébergement HTML gratuit, cartes sociales et serveur MCP pour agents IA.',
    ogTitle: 'htmldrop — Publiez un fichier HTML en ligne en secondes',
    ogDesc: 'Envoyez du HTML en POST, recevez un lien. Serveur MCP inclus.',
    navApi: 'API',
    navMcp: 'MCP',
    heroLine1: 'Publiez du HTML',
    heroAccent: 'en quelques secondes',
    tagline:
      'htmldrop transforme n’importe quel artefact HTML en lien à partager en un seul appel API. Rapports, tableaux de bord, graphiques, démos — tout ce qu’un agent crée.',
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
    metaTitle: 'htmldrop — HTML-Datei hochladen & in Sekunden online',
    metaDesc:
      'HTML-Datei ablegen oder per API senden und sofort einen teilbaren Link erhalten. Kostenloses HTML-Hosting mit Social Cards und MCP-Server für KI-Agenten.',
    ogTitle: 'htmldrop — HTML-Datei hochladen & in Sekunden online',
    ogDesc: 'HTML per POST senden, Link erhalten. MCP-Server inklusive.',
    navApi: 'API',
    navMcp: 'MCP',
    heroLine1: 'HTML veröffentlichen',
    heroAccent: 'in Sekunden',
    tagline:
      'htmldrop verwandelt jedes HTML-Artefakt mit einem einzigen API-Aufruf in einen teilbaren Link. Berichte, Dashboards, Diagramme, Demos — alles, was ein Agent erstellt.',
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

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/** Serialize JSON-LD so it can be embedded inside a <script> tag safely. */
function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function landingPageHtml(locale: Locale = DEFAULT_LOCALE): string {
  const t = translations[locale] ?? translations[DEFAULT_LOCALE];
  const baseDomain = process.env.BASE_DOMAIN || 'htmldrop.link';
  const origin = `https://${baseDomain}`;
  // Site-ownership verification tags (Naver Search Advisor, etc.) — set the
  // env var to the `content` value from the verification snippet.
  const naverVerification = process.env.NAVER_SITE_VERIFICATION
    ? `\n<meta name="naver-site-verification" content="${escapeAttr(process.env.NAVER_SITE_VERIFICATION)}">`
    : '';
  const canonical = `${origin}${localePath(locale)}`;
  const ogImage = `${origin}/og.png`;

  const hreflangLinks = SUPPORTED.map(
    (l) => `<link rel="alternate" hreflang="${l === 'zh' ? 'zh-CN' : l}" href="${origin}${localePath(l)}">`
  ).join('\n');

  const ogLocaleAlternates = SUPPORTED.filter((l) => l !== locale)
    .map((l) => `<meta property="og:locale:alternate" content="${OG_LOCALES[l]}">`)
    .join('\n');

  const appLd = jsonLd({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'htmldrop',
    url: origin,
    description: t.metaDesc,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires a modern web browser',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    inLanguage: t.htmlLang,
  });

  const faqLd = jsonLd({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: t.htmlLang,
    mainEntity: t.faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  });

  const langSwitch = LANGUAGE_LABELS.map(
    ([l, label]) =>
      l === locale
        ? `<span aria-current="true">${label}</span>`
        : `<a href="${localePath(l)}" hreflang="${l}" lang="${l}">${label}</a>`
  ).join('\n      ');

  const faqItems = t.faq
    .map(
      ({ q, a }, i) => `      <details class="faq-item doodle-border"${i === 0 ? ' open' : ''}>
        <summary><h3>${q}</h3><span class="faq-toggle" aria-hidden="true">+</span></summary>
        <p>${a}</p>
      </details>`
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="${t.htmlLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${t.metaTitle}</title>
<meta name="description" content="${escapeAttr(t.metaDesc)}">${naverVerification}
<link rel="canonical" href="${canonical}">
${hreflangLinks}
<link rel="alternate" hreflang="x-default" href="${origin}/">
<meta property="og:title" content="${escapeAttr(t.ogTitle)}">
<meta property="og:description" content="${escapeAttr(t.ogDesc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="htmldrop">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${OG_LOCALES[locale]}">
${ogLocaleAlternates}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${ogImage}">
<meta name="theme-color" content="#f7f3ea">
<script type="application/ld+json">${appLd}</script>
<script type="application/ld+json">${faqLd}</script>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&family=Dongle:wght@400;700&family=Gaegu:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #f7f3ea;
    --paper: #ffffff;
    /* Passive cards sit on a warm tone-on-tone paper, not stark white, so they
       read via their border + offset shadow instead of shouting against --bg.
       Interactive surfaces (buttons, drop zone, pills) keep --paper. */
    --card: #fbf8f1;
    --ink: #211d18;
    --muted: #756c60;
    --accent: #e8503a;
    --accent-soft: rgba(232, 80, 58, 0.12);
    --line: #211d18;
    --line-soft: rgba(33, 29, 24, 0.38);
    --shadow: rgba(33, 29, 24, 0.10);
    --radius-hand: 235px 18px 225px 18px / 18px 225px 18px 235px;
    --mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  }
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    padding: 0;
    font-family: 'Baloo 2', 'Dongle', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    font-size-adjust: from-font;
    background: var(--bg);
    color: var(--ink);
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    background-image: radial-gradient(rgba(33, 29, 24, 0.06) 0.7px, transparent 0.7px);
    background-size: 26px 26px;
  }
  .container { max-width: 1040px; margin: 0 auto; padding: 0 1.5rem; }

  /* Hand-drawn helpers. Passive cards get a soft pencil line; interactive
     elements (buttons, drop zone) keep full ink so hierarchy reads. */
  .doodle-border {
    border: 2px solid var(--line-soft);
    border-radius: var(--radius-hand);
    box-shadow: 4px 4px 0 rgba(33, 29, 24, 0.07);
    background: var(--card);
    --tilt: 0deg;
    transform: rotate(var(--tilt));
    transition: box-shadow 0.18s ease, transform 0.18s ease;
  }
  .doodle-border:hover { box-shadow: 7px 7px 0 rgba(33, 29, 24, 0.09); transform: translateY(-3px) rotate(calc(var(--tilt) - 0.6deg)); }

  /* Hand-placed variance: every card gets its own tilt, wobble, and offset
     so the grid reads as pinned-up paper, not cloned components. */
  .features .feature:nth-child(1) { --tilt: -0.6deg; }
  .features .feature:nth-child(2) { --tilt: 0.5deg; margin-top: 10px; border-radius: 18px 235px 22px 245px / 240px 20px 250px 18px; }
  .features .feature:nth-child(3) { --tilt: 0.4deg; border-radius: 245px 16px 250px 20px / 18px 245px 16px 240px; }
  .features .feature:nth-child(4) { --tilt: -0.5deg; margin-top: 8px; }
  .steps .step:nth-child(1) { --tilt: -0.9deg; }
  .steps .step:nth-child(2) { --tilt: 0.8deg; margin-top: 16px; border-radius: 20px 240px 18px 250px / 245px 18px 240px 20px; }
  .steps .step:nth-child(3) { --tilt: -0.5deg; margin-top: 6px; border-radius: 250px 18px 240px 16px / 16px 250px 20px 245px; }

  h1, h2, h3, h4, .hand { font-family: 'Gaegu', system-ui, cursive; letter-spacing: 0.01em; }
  /* Gaegu is the display face; keep its natural metrics (the body's
     font-size-adjust that up-scales Dongle must not touch the headings). */
  h1, h2, h3, h4, .hand, .logo-mark, .dz-title, .step-num, .faq-toggle, footer { font-size-adjust: none; }

  /* Scribble underline draw-in */
  .scribble-underline { position: relative; display: inline; white-space: nowrap; }
  .scribble-underline svg {
    position: absolute; left: -4px; right: -4px; bottom: -6px;
    width: calc(100% + 8px); height: 14px; overflow: visible; pointer-events: none;
  }
  .scribble-underline path {
    stroke: var(--accent); stroke-width: 6; fill: none; stroke-linecap: round;
    stroke-dasharray: 220; stroke-dashoffset: 220;
    animation: draw-underline 0.9s cubic-bezier(0.6, 0, 0.2, 1) forwards; animation-delay: 0.75s;
  }
  @keyframes draw-underline { to { stroke-dashoffset: 0; } }

  /* Staggered page-load reveal */
  .reveal { opacity: 0; transform: translateY(14px); animation: rise-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
  .d1 { animation-delay: 0.05s; } .d2 { animation-delay: 0.15s; } .d3 { animation-delay: 0.25s; }
  .d4 { animation-delay: 0.35s; } .d5 { animation-delay: 0.45s; }
  @keyframes rise-in { to { opacity: 1; transform: none; } }
  @media (prefers-reduced-motion: reduce) {
    .reveal { opacity: 1; transform: none; animation: none; }
    .scribble-underline path { animation: none; stroke-dashoffset: 0; }
  }

  /* Nav */
  .site-nav {
    position: sticky; top: 0; z-index: 20;
    backdrop-filter: saturate(140%) blur(8px);
    background: rgba(247, 243, 234, 0.72);
    border-bottom: 2px solid transparent;
    transition: border-color 0.2s ease;
  }
  .site-nav.scrolled { border-color: rgba(33, 29, 24, 0.10); }
  .nav-inner { display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 0; }
  .logo-mark { display: flex; align-items: center; gap: 0.45rem; font-family: 'Gaegu', cursive; font-weight: 700; font-size: 1.5rem; }
  .logo-mark .tld { color: var(--accent); }
  .logo-pin { width: 26px; height: 26px; color: var(--accent); transform: rotate(-6deg); }
  .nav-links { display: flex; gap: 0.35rem; align-items: center; }
  .nav-links a {
    color: var(--muted); text-decoration: none; font-size: 0.92rem; font-weight: 700;
    padding: 0.4rem 0.9rem; border: 2px solid transparent; border-radius: 999px;
    transition: all 0.15s ease;
  }
  .nav-links a:hover { border-color: var(--line); color: var(--ink); transform: rotate(-1.5deg); }
  .nav-links a.gh { background: var(--ink); color: #fff; border-color: var(--ink); display: inline-flex; align-items: center; gap: 0.42rem; }
  .nav-links a.gh:hover { transform: translateY(-1px) rotate(-1.5deg); }

  /* Hero — single centered column: headline, one tagline, and the drop
     zone as the only call to action. Secondary links live in the nav. */
  .hero { padding: 4.2rem 0 5.6rem; text-align: center; }
  .hero h1 { font-size: clamp(3rem, 5.5vw, 4.6rem); line-height: 1.05; margin: 0 0 1.15rem; }
  .tagline { font-size: 1.12rem; color: var(--muted); max-width: 560px; margin: 0 auto 2.9rem; }
  .btn {
    display: inline-flex; align-items: center; gap: 0.45rem; text-decoration: none; font-weight: 700;
    font-size: 0.98rem; padding: 0.8rem 1.5rem; background: var(--paper); color: var(--ink);
    border: 2px solid var(--line); border-radius: var(--radius-hand);
    box-shadow: 4px 4px 0 var(--shadow); transition: transform 0.16s ease, box-shadow 0.16s ease;
  }
  .btn:hover { transform: translateY(-3px) rotate(-1deg); box-shadow: 6px 7px 0 var(--shadow); }
  .btn:active { transform: translateY(0); box-shadow: 2px 2px 0 var(--shadow); }
  .btn.primary { background: var(--accent); color: #fff; border-color: var(--line); }
  .btn .arr { transition: transform 0.16s ease; }
  .btn:hover .arr { transform: translateX(3px); }

  /* Drop zone — a real, working publish window as the hero centerpiece */
  .hero-drop { position: relative; max-width: 500px; margin: 0 auto; }
  /* The drop zone is the primary CTA — it keeps the full-ink line. */
  .dropzone { width: 100%; cursor: pointer; --tilt: 0.4deg; background: var(--paper); border-color: var(--line); box-shadow: 4px 4px 0 var(--shadow); }
  .dz-head { display: flex; align-items: center; gap: 0.45rem; padding: 0.75rem 1.1rem; border-bottom: 2px solid var(--line); }
  .dz-head .tl { width: 11px; height: 11px; border-radius: 50%; background: rgba(33,29,24,0.16); }
  .dz-head .tl.a { background: var(--accent); opacity: 0.75; }
  .dz-head .tag { margin-left: auto; font-family: var(--mono); font-size: 0.75rem; color: var(--muted); }
  .dz-body { padding: 1.25rem; }
  .dz-inner {
    border: 2.5px dashed rgba(33,29,24,0.30); border-radius: 14px;
    padding: 2.6rem 1.5rem; text-align: center; transition: border-color 0.15s ease, background 0.15s ease;
    min-height: 256px; display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .dropzone.drag .dz-inner { border-color: var(--accent); background: var(--accent-soft); }
  .dropzone.drag { transform: rotate(0deg) scale(1.02); }
  .dz-drop-ico { width: 46px; height: 46px; color: var(--accent); }
  .dropzone.drag .dz-drop-ico { animation: dz-bounce 0.6s ease-in-out infinite; }
  @keyframes dz-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  .dz-title { font-family: 'Gaegu', cursive; font-size: 1.45rem; font-weight: 700; margin: 0.7rem 0 0.15rem; }
  .dz-hint { color: var(--muted); font-size: 0.9rem; margin: 0; }
  .dz-state { display: none; flex-direction: column; align-items: center; }
  .dropzone[data-state="idle"] .dz-state.idle,
  .dropzone[data-state="busy"] .dz-state.busy,
  .dropzone[data-state="done"] .dz-state.done,
  .dropzone[data-state="error"] .dz-state.error { display: flex; }
  .dropzone[data-state="done"] { cursor: default; }
  .dz-spin {
    width: 38px; height: 38px; border-radius: 50%;
    border: 3px solid var(--accent-soft); border-top-color: var(--accent);
    animation: dz-rot 0.8s linear infinite; margin-bottom: 0.8rem;
  }
  @keyframes dz-rot { to { transform: rotate(360deg); } }
  .dz-url {
    font-family: var(--mono); font-size: 0.88rem; color: var(--accent); font-weight: 700;
    word-break: break-all; text-decoration: none; margin: 0.5rem 0 1rem; max-width: 100%;
    border-bottom: 2px solid var(--accent-soft);
  }
  .dz-url:hover { border-bottom-color: var(--accent); }
  .dz-actions { display: flex; gap: 0.6rem; flex-wrap: wrap; justify-content: center; }
  .btn.sm { padding: 0.45rem 1rem; font-size: 0.85rem; box-shadow: 3px 3px 0 var(--shadow); }
  .dz-again { margin-top: 0.9rem; background: none; border: none; color: var(--muted); font-family: 'Baloo 2', 'Dongle', sans-serif; font-weight: 700; font-size: 0.85rem; cursor: pointer; text-decoration: underline dotted; }
  .dz-again:hover { color: var(--ink); }
  .dz-err-msg { color: var(--accent); font-weight: 700; margin: 0.6rem 0 0; }
  .doodle-star { position: absolute; top: -16px; right: -15px; width: 34px; height: 34px; animation: spin-slow 16s linear infinite; }
  @keyframes spin-slow { to { transform: rotate(360deg); } }

  /* Sections */
  section { padding: 5.5rem 0; }
  .section-header { max-width: 580px; margin-bottom: 2.4rem; }
  .section-header h2 { font-size: clamp(1.7rem, 3vw, 2.25rem); margin: 0 0 0.35rem; line-height: 1.12; }
  .section-header p { color: var(--muted); margin: 0; font-size: 1rem; }

  /* Dark beat — the API/MCP block goes full-bleed ink to give the page
     a real value change instead of four same-weight cream sections.
     Top/bottom edges are hand-drawn squiggles, not razor cuts. */
  .dark { background: #332c25; padding: 5.5rem 0 5rem; position: relative; }
  .dark::before, .dark::after {
    content: ''; position: absolute; left: 0; right: 0; height: 16px; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 16'%3E%3Cpath d='M0 9 C 14 4 31 13 52 8 C 70 4 88 14 112 9 C 132 5 150 13 174 8 C 194 4 218 12 240 7 L 240 0 L 0 0 Z' fill='%23f7f3ea'/%3E%3C/svg%3E");
    background-size: 240px 16px; background-repeat: repeat-x;
  }
  .dark::before { top: -1px; }
  .dark::after { bottom: -1px; transform: scaleY(-1); }
  .dark .section-header h2 { color: #f4efe6; }
  .dark .section-header p { color: rgba(244, 239, 230, 0.60); }
  .dark .endpoint-row code {
    background: transparent; color: #f4efe6; border-color: rgba(244, 239, 230, 0.26);
    box-shadow: none;
  }
  .dark .endpoint-row code b { color: #ff8570; }
  .dark .code-card { border-color: rgba(244, 239, 230, 0.14); box-shadow: 4px 5px 0 rgba(0, 0, 0, 0.18); }

  /* API section */
  .endpoint-row { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.75rem; }
  .endpoint-row code {
    background: var(--paper); color: var(--ink); padding: 0.5rem 1rem;
    border: 2px solid var(--line); border-radius: 999px; box-shadow: 2px 3px 0 var(--shadow);
    font-family: var(--mono); font-size: 0.82rem; font-weight: 400;
  }
  .endpoint-row code b { color: var(--accent); font-weight: 700; }
  .code-card {
    border: 2px solid var(--line); border-radius: 16px; overflow: hidden;
    box-shadow: 5px 6px 0 var(--shadow); background: #29221b;
  }
  .code-head {
    display: flex; align-items: center; gap: 0.5rem; padding: 0.8rem 1.25rem;
    background: #322a22; border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .code-head .tl { width: 12px; height: 12px; border-radius: 50%; }
  /* Muted window dots — one quiet coral, two tonal — instead of RGB traffic lights. */
  .code-head .r { background: rgba(232, 80, 58, 0.55); } .code-head .y { background: rgba(244, 239, 230, 0.20); } .code-head .g { background: rgba(244, 239, 230, 0.14); }
  .code-head .tag { margin-left: auto; color: rgba(255,255,255,0.45); font-size: 0.75rem; font-family: var(--mono); letter-spacing: 0.05em; }
  .code-body {
    color: #f4efe6; padding: 1.6rem 1.75rem 1.75rem; margin: 0;
    font-family: var(--mono);
    font-size: 0.86rem; line-height: 2; overflow-x: auto; white-space: pre;
  }
  .code-body .cmd { color: #ffb4a8; } .code-body .flag { color: rgba(244, 239, 230, 0.6); } .code-body .str { color: rgba(244, 239, 230, 0.82); }
  .code-body .out { color: rgba(244, 239, 230, 0.45); }

  /* MCP row — lives at the bottom of the dark section */
  .mcp-row {
    margin-top: 2.75rem; padding-top: 2.25rem; border-top: 2px dashed rgba(244, 239, 230, 0.22);
    display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1.5rem;
  }
  .mcp-row h3 { margin: 0; font-size: 1.7rem; color: #f4efe6; display: flex; align-items: center; gap: 0.55rem; flex-wrap: wrap; }
  .mcp-row p { margin: 0.35rem 0 0; color: rgba(244, 239, 230, 0.60); max-width: 52ch; }
  .mcp-row .endpoint { font-family: var(--mono); font-size: 0.9rem; color: #fff; background: var(--accent); padding: 0.15rem 0.55rem; border-radius: 7px; font-weight: 700; }
  .dark .btn { box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.35); }

  /* Finale — the closing beat before the footer */
  .finale { padding: 5.5rem 0 5rem; text-align: center; }
  .finale h2 { font-size: clamp(2.4rem, 5vw, 3.4rem); margin: 0 0 1.7rem; line-height: 1.1; }
  .btn.lg { padding: 1rem 2.1rem; font-size: 1.05rem; }

  /* Features */
  .features { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.35rem; }
  .feature { padding: 1.55rem 1.65rem; }
  .feature h3 { margin: 0.7rem 0 0.35rem; font-size: 1.28rem; }
  .feature p { margin: 0; color: var(--muted); font-size: 0.96rem; max-width: 42ch; }
  .feature-icon {
    width: 42px; height: 42px; border-radius: 14px 8px 15px 9px; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; border: 2px solid rgba(232, 80, 58, 0.45); box-shadow: 2px 2px 0 rgba(33, 29, 24, 0.06);
    background: var(--accent-soft); color: var(--accent);
    transform: rotate(-2.5deg);
  }
  .features .feature:nth-child(even) .feature-icon { transform: rotate(2deg); border-radius: 9px 15px 8px 14px; }

  /* Steps — pinned-note cards with washi tape and a scribbled number ring */
  .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.35rem; padding-top: 12px; }
  .step { text-align: center; padding: 1.5rem 1.3rem 1.4rem; position: relative; }
  .step::before {
    content: ''; position: absolute; top: -12px; left: 50%; width: 72px; height: 24px;
    background: rgba(232, 80, 58, 0.16);
    box-shadow: inset 0 0 0 1px rgba(232, 80, 58, 0.10);
    transform: translateX(-50%) rotate(-2.5deg);
  }
  .steps .step:nth-child(2)::before { transform: translateX(-50%) rotate(2deg); width: 64px; }
  .steps .step:nth-child(3)::before { transform: translateX(-50%) rotate(-1deg); width: 78px; }
  .step-num {
    position: relative; display: inline-flex; align-items: center; justify-content: center;
    width: 44px; height: 44px; margin-bottom: 0.55rem;
    font-family: 'Gaegu', cursive; font-size: 1.4rem; font-weight: 700; color: var(--ink);
  }
  .step-num svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .step h4 { margin: 0 0 0.3rem; font-size: 1.25rem; }
  .step p { margin: 0; color: var(--muted); font-size: 0.95rem; }

  .features-section { padding-top: 5rem; }

  /* FAQ — hand-drawn accordion cards */
  .faq-list { display: grid; gap: 0.7rem; max-width: 780px; }
  .faq-item { --tilt: 0deg; padding: 0; }
  .faq-list .faq-item:nth-child(odd) { --tilt: -0.25deg; }
  .faq-list .faq-item:nth-child(even) { --tilt: 0.25deg; border-radius: 18px 235px 22px 245px / 240px 20px 250px 18px; }
  .faq-item summary {
    display: flex; align-items: center; justify-content: space-between; gap: 1rem;
    cursor: pointer; list-style: none; padding: 0.85rem 1.2rem;
  }
  .faq-item summary::-webkit-details-marker { display: none; }
  .faq-item summary h3 { margin: 0; font-size: 1.1rem; line-height: 1.3; }
  .faq-toggle {
    flex-shrink: 0; width: 25px; height: 25px; display: inline-flex; align-items: center; justify-content: center;
    font-family: 'Gaegu', cursive; font-size: 1.15rem; font-weight: 700; color: var(--accent);
    border: 2px solid var(--line); border-radius: 12px 8px 13px 9px; background: var(--accent-soft);
    transform: rotate(-2deg); transition: transform 0.18s ease;
  }
  .faq-item[open] .faq-toggle { transform: rotate(43deg); }
  .faq-item > p { margin: 0; padding: 0 1.2rem 1.05rem; color: var(--muted); font-size: 0.94rem; max-width: 64ch; }

  /* Footer */
  footer { padding: 1.5rem 0 2.75rem; text-align: center; color: var(--muted); font-size: 1.05rem; font-family: 'Gaegu', system-ui, cursive; }
  footer a { color: var(--ink); text-decoration: none; border-bottom: 2px solid var(--accent-soft); }
  footer a:hover { border-bottom-color: var(--accent); }
  .lang-switch { margin-top: 0.9rem; font-family: 'Baloo 2', 'Dongle', sans-serif; font-size: 0.82rem; display: flex; flex-wrap: wrap; justify-content: center; gap: 0.35rem 1rem; }
  .lang-switch a { color: var(--muted); border-bottom: 2px dotted rgba(33, 29, 24, 0.22); }
  .lang-switch a:hover { color: var(--ink); border-bottom-color: var(--accent); }
  .lang-switch span { color: var(--ink); font-weight: 700; }

  @media (max-width: 900px) {
    .hero { padding: 2.5rem 0 3.5rem; }
    .steps { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 560px) {
    .features, .steps { grid-template-columns: 1fr; }
    .mcp-banner { text-align: left; }
    .nav-links a:not(.gh) { display: none; }
  }
</style>
</head>
<body>
<nav class="site-nav" id="siteNav">
  <div class="container">
    <div class="nav-inner">
      <div class="logo-mark">
        <svg class="logo-pin" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5 C12 2.5 5.5 10 5.5 14.5 a6.5 6.5 0 0 0 13 0 C18.5 10 12 2.5 12 2.5 Z" fill="currentColor" stroke="#211d18" stroke-width="1.8" stroke-linejoin="round"/><path d="M9.2 14.8 a2.8 2.8 0 0 0 2.4 2.9" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>
        <span>htmldrop<span class="tld">.link</span></span>
      </div>
      <div class="nav-links">
        <a href="#api">${t.navApi}</a>
        <a href="#mcp">${t.navMcp}</a>
        <a href="/agents.md">agents.md</a>
        <a class="gh" href="https://github.com/vin-spiegel/htmldrop" target="_blank" rel="noopener"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>GitHub</a>
      </div>
    </div>
  </div>
</nav>

<div class="container">
  <header class="hero">
    <h1 class="reveal d1">${t.heroLine1} <span class="scribble-underline">${t.heroAccent}<svg viewBox="0 0 180 12" preserveAspectRatio="none"><path d="M2 7 C 40 2, 70 10, 110 6 S 170 4, 178 9"/></svg></span>.</h1>
    <p class="tagline reveal d2">${t.tagline}</p>
    <div class="hero-drop reveal d3">
        <div class="dropzone doodle-border" id="dropzone" data-state="idle">
          <div class="dz-head">
            <span class="tl"></span><span class="tl"></span><span class="tl a"></span>
            <span class="tag">index.html</span>
          </div>
          <div class="dz-body">
            <div class="dz-inner">
              <div class="dz-state idle">
                <svg class="dz-drop-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5 C12 2.5 5.5 10 5.5 14.5 a6.5 6.5 0 0 0 13 0 C18.5 10 12 2.5 12 2.5 Z" fill="rgba(232,80,58,0.14)" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 9 L12 16 M9.2 13.2 L12 16 L14.8 13.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <p class="dz-title">${t.dropTitle}</p>
                <p class="dz-hint">${t.dropHint}</p>
              </div>
              <div class="dz-state busy">
                <div class="dz-spin"></div>
                <p class="dz-title">${t.dropBusy}</p>
              </div>
              <div class="dz-state done">
                <p class="dz-title">🎉 ${t.dropDone}</p>
                <a class="dz-url" id="dzUrl" href="#" target="_blank" rel="noopener"></a>
                <div class="dz-actions">
                  <button type="button" class="btn primary sm" id="dzCopy" data-copied="${escapeAttr(t.dropCopied)}">${t.dropCopy}</button>
                  <a class="btn sm" id="dzOpen" href="#" target="_blank" rel="noopener">${t.dropOpen}</a>
                </div>
                <button type="button" class="dz-again" id="dzAgain">${t.dropAgain}</button>
              </div>
              <div class="dz-state error">
                <p class="dz-title">😵</p>
                <p class="dz-err-msg" id="dzErrMsg">${t.dropErr}</p>
                <button type="button" class="dz-again" id="dzRetry">${t.dropAgain}</button>
              </div>
            </div>
          </div>
        </div>
        <input type="file" id="dzFile" accept=".html,.htm,.md,.markdown,.txt,.json,.csv,.pdf,.png,.jpg,.jpeg,.gif,.webp,.svg" hidden>
        <svg class="doodle-star" viewBox="0 0 44 44" aria-hidden="true"><path d="M22 4 L26 16 L40 16 L29 24 L34 38 L22 29 L10 38 L15 24 L4 16 L18 16 Z" fill="#fff" stroke="#211d18" stroke-width="2" stroke-linejoin="round"/></svg>
    </div>
  </header>
</div>

<section id="api" class="dark">
  <div class="container">
    <div class="section-header">
      <h2>${t.apiH2}</h2>
      <p>${t.apiP}</p>
    </div>
    <div class="endpoint-row">
      <code><b>POST</b> /publish</code>
      <code><b>POST</b> /publish/raw</code>
      <code><b>POST</b> /publish/from-url</code>
    </div>
    <div class="code-card">
      <div class="code-head">
        <span class="tl r"></span><span class="tl y"></span><span class="tl g"></span>
        <span class="tag">bash</span>
      </div>
      <pre class="code-body"><span class="cmd">curl</span> -X POST https://${baseDomain}/publish <span class="flag">\\</span>
  <span class="flag">-H</span> <span class="str">"Content-Type: application/json"</span> <span class="flag">\\</span>
  <span class="flag">-d</span> <span class="str">'{"html":"&lt;h1&gt;Hello agents&lt;/h1&gt;","title":"Demo"}'</span>

<span class="out">${t.apiReturns}</span></pre>
    </div>
    <div class="mcp-row" id="mcp">
      <div>
        <h3><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f4efe6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M7 10 L12 13 L17 10" stroke="#e8503a" stroke-width="2.5"/></svg> ${t.mcpH3} <span class="endpoint">/mcp</span></h3>
        <p>${t.mcpP}</p>
      </div>
      <a class="btn primary" href="/agents.md">${t.mcpCta} <span class="arr">→</span></a>
    </div>
  </div>
</section>

<section class="features-section">
  <div class="container">
    <div class="section-header">
      <h2>${t.featuresH2}</h2>
      <p>${t.featuresP}</p>
    </div>
    <div class="features">
      <article class="feature doodle-border">
        <span class="feature-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
        <h3>${t.f1Title}</h3>
        <p>${t.f1Desc}</p>
      </article>
      <article class="feature doodle-border">
        <span class="feature-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></span>
        <h3>${t.f2Title}</h3>
        <p>${t.f2Desc}</p>
      </article>
      <article class="feature doodle-border">
        <span class="feature-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
        <h3>${t.f3Title}</h3>
        <p>${t.f3Desc}</p>
      </article>
      <article class="feature doodle-border">
        <span class="feature-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
        <h3>${t.f4Title}</h3>
        <p>${t.f4Desc}</p>
      </article>
    </div>
  </div>
</section>

<section style="background: rgba(33,29,24,0.02);">
  <div class="container">
    <div class="section-header">
      <h2>${t.howH2}</h2>
      <p>${t.howP}</p>
    </div>
    <div class="steps">
      <div class="step doodle-border">
        <div class="step-num"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4.8 C 13.5 5.5 5.2 13.2 5.6 24.2 C 6 34.6 14.2 43 24.6 42.4 C 35 41.8 42.8 33.4 42.2 23.2 C 41.6 13 33.6 4.6 22.8 5.4" fill="rgba(232,80,58,0.12)" stroke="#e8503a" stroke-width="2.3" stroke-linecap="round"/></svg>1</div>
        <h4>${t.s1Title}</h4>
        <p>${t.s1Desc}</p>
      </div>
      <div class="step doodle-border">
        <div class="step-num"><svg viewBox="0 0 48 48" aria-hidden="true" style="transform: rotate(130deg)"><path d="M24 4.8 C 13.5 5.5 5.2 13.2 5.6 24.2 C 6 34.6 14.2 43 24.6 42.4 C 35 41.8 42.8 33.4 42.2 23.2 C 41.6 13 33.6 4.6 22.8 5.4" fill="rgba(232,80,58,0.12)" stroke="#e8503a" stroke-width="2.3" stroke-linecap="round"/></svg>2</div>
        <h4>${t.s2Title}</h4>
        <p>${t.s2Desc}</p>
      </div>
      <div class="step doodle-border">
        <div class="step-num"><svg viewBox="0 0 48 48" aria-hidden="true" style="transform: rotate(255deg)"><path d="M24 4.8 C 13.5 5.5 5.2 13.2 5.6 24.2 C 6 34.6 14.2 43 24.6 42.4 C 35 41.8 42.8 33.4 42.2 23.2 C 41.6 13 33.6 4.6 22.8 5.4" fill="rgba(232,80,58,0.12)" stroke="#e8503a" stroke-width="2.3" stroke-linecap="round"/></svg>3</div>
        <h4>${t.s3Title}</h4>
        <p>${t.s3Desc}</p>
      </div>
    </div>
  </div>
</section>

<section id="faq">
  <div class="container">
    <div class="section-header">
      <h2>${t.faqH2}</h2>
      <p>${t.faqP}</p>
    </div>
    <div class="faq-list">
${faqItems}
    </div>
  </div>
</section>

<section class="finale">
  <div class="container">
    <h2>${t.finaleH2}</h2>
    <a class="btn primary lg" href="#dropzone">${t.finaleCta} <span class="arr">→</span></a>
  </div>
</section>

<footer>
  <div class="container">
    ${t.footer} · <a href="/agents.md">agents.md</a> · <a href="https://github.com/vin-spiegel/htmldrop" target="_blank" rel="noopener">GitHub</a>
    <nav class="lang-switch" aria-label="Language">
      ${langSwitch}
    </nav>
  </div>
</footer>
<script>
  (function () {
    var nav = document.getElementById('siteNav');
    if (!nav) return;
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  // Drag & drop publish — posts to the same /publish endpoint agents use.
  (function () {
    var MAX_BYTES = 25 * 1024 * 1024;
    var dz = document.getElementById('dropzone');
    var fileInput = document.getElementById('dzFile');
    if (!dz || !fileInput) return;
    var urlEl = document.getElementById('dzUrl');
    var openEl = document.getElementById('dzOpen');
    var copyBtn = document.getElementById('dzCopy');
    var againBtn = document.getElementById('dzAgain');
    var retryBtn = document.getElementById('dzRetry');
    var publishedUrl = '';

    function setState(s) { dz.setAttribute('data-state', s); }
    function state() { return dz.getAttribute('data-state'); }

    function fileMime(file) {
      var byExt = {
        html: 'text/html', htm: 'text/html',
        md: 'text/markdown', markdown: 'text/markdown',
        txt: 'text/plain', json: 'application/json', csv: 'text/csv',
        pdf: 'application/pdf',
        png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
        gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
      };
      var m = file.name.match(/\\.([a-z0-9]+)$/i);
      return (m && byExt[m[1].toLowerCase()]) || null;
    }

    function handleResponse(p) {
      p.then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
        .then(function (data) {
          publishedUrl = data.url;
          urlEl.textContent = data.url.replace(/^https?:\\/\\//, '');
          urlEl.href = data.url;
          openEl.href = data.url;
          setState('done');
        })
        .catch(function () { setState('error'); });
    }

    function publish(body) {
      setState('busy');
      handleResponse(fetch('/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }));
    }

    function handleFile(file) {
      var mime = file && fileMime(file);
      if (!mime || file.size > MAX_BYTES) { setState('error'); return; }
      setState('busy');
      var title = file.name.replace(/\\.[a-z0-9]+$/i, '');
      handleResponse(fetch('/publish/raw?title=' + encodeURIComponent(title), {
        method: 'POST',
        headers: { 'Content-Type': mime },
        body: file,
      }));
    }

    dz.addEventListener('click', function (e) {
      if (state() === 'done' || state() === 'busy') return;
      if (e.target.closest('.dz-again, .dz-actions, .dz-url')) return;
      if (state() === 'error') setState('idle');
      fileInput.click();
    });
    fileInput.addEventListener('change', function () {
      if (fileInput.files && fileInput.files[0]) handleFile(fileInput.files[0]);
      fileInput.value = '';
    });

    ['dragenter', 'dragover'].forEach(function (ev) {
      dz.addEventListener(ev, function (e) {
        e.preventDefault();
        if (state() === 'idle' || state() === 'error') dz.classList.add('drag');
      });
    });
    ['dragleave', 'drop'].forEach(function (ev) {
      dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.remove('drag'); });
    });
    dz.addEventListener('drop', function (e) {
      if (state() === 'busy' || state() === 'done') return;
      var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      handleFile(file);
    });
    // Dropping outside the zone shouldn't navigate the tab away.
    window.addEventListener('dragover', function (e) { e.preventDefault(); });
    window.addEventListener('drop', function (e) { e.preventDefault(); });

    // Paste HTML source anywhere on the page to publish it.
    document.addEventListener('paste', function (e) {
      if (state() !== 'idle') return;
      if (/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) return;
      var text = e.clipboardData && e.clipboardData.getData('text/plain');
      if (!text || text.length > MAX_BYTES) return;
      if (/<\\w+[^>]*>/.test(text)) publish({ html: text });
      else if (/^#{1,6}\\s|^[-*]\\s|\\*\\*[^*]+\\*\\*|^\\d+\\.\\s/m.test(text)) publish({ markdown: text });
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        navigator.clipboard.writeText(publishedUrl).then(function () {
          var orig = copyBtn.textContent;
          copyBtn.textContent = copyBtn.getAttribute('data-copied');
          setTimeout(function () { copyBtn.textContent = orig; }, 1400);
        });
      });
    }
    [againBtn, retryBtn].forEach(function (b) {
      if (b) b.addEventListener('click', function (e) { e.stopPropagation(); setState('idle'); });
    });
  })();
</script>
</body>
</html>`;
}
