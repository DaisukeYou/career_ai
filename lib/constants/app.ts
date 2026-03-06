import type {
  AppMode,
  InterviewAnswer,
  InterviewStep,
  QuickAssessmentInput,
} from "@/lib/schemas/domain";

export const APP_NAME = "転職OS MVP";
export const OFFER_REVIEW_DISCLAIMER =
  "これは法的助言ではなく、条件通知の確認論点を整理する支援です。必要に応じて専門家や公的窓口へご相談ください。";

export const worryOptions = [
  "経験が浅くて不安",
  "書類に自信がない",
  "面接が苦手",
  "年収を上げたい",
  "働き方を見直したい",
  "建設業界で条件を整理したい",
] as const;

export const salaryRanges = [
  "300万円未満",
  "300万〜400万円",
  "400万〜500万円",
  "500万〜650万円",
  "650万円以上",
] as const;

export const toneOptions = [
  { value: "balanced", label: "標準" },
  { value: "confident", label: "自信強め" },
  { value: "formal", label: "かっちり" },
  { value: "friendly", label: "親しみやすく" },
] as const;

export const quickAssessmentDefaults: QuickAssessmentInput = {
  currentRole: "",
  desiredRole: "",
  preferredLocation: "",
  salaryRange: "300万〜400万円",
  currentWorry: "書類に自信がない",
  mode: "general",
};

const generalInterviewSteps: InterviewStep[] = [
  {
    id: "career",
    label: "これまでの職歴",
    prompt: "これまでの職歴を時系列で簡単に教えてください。",
    placeholder: "例: 新卒でSaaS企業に入社し、CSとして2年勤務。",
    mode: "general",
    optional: false,
  },
  {
    id: "work",
    label: "担当業務",
    prompt: "日々担当していた業務や役割を教えてください。",
    placeholder: "例: オンボーディング、問い合わせ対応、解約抑止、改善提案など。",
    mode: "general",
    optional: false,
  },
  {
    id: "achievement",
    label: "実績",
    prompt: "定量・定性どちらでもよいので、成果や工夫したことを教えてください。",
    placeholder: "例: 解約率を月次で改善、顧客満足度向上、営業目標達成など。",
    mode: "general",
    optional: false,
  },
  {
    id: "reason",
    label: "転職理由",
    prompt: "転職を考えた理由や、次で変えたいことを教えてください。",
    placeholder: "例: 顧客により深く入り込める仕事がしたい、年収を上げたい。",
    mode: "general",
    optional: false,
  },
  {
    id: "wants",
    label: "希望条件",
    prompt: "希望職種、勤務地、年収、働き方などの希望を教えてください。",
    placeholder: "例: 東京勤務、年収450万円以上、土日休み、無理な転勤なし。",
    mode: "general",
    optional: false,
  },
  {
    id: "ng",
    label: "NG条件",
    prompt: "避けたい条件や不安なことを教えてください。",
    placeholder: "例: 長時間残業、個人ノルマ過多、夜勤、転勤前提。",
    mode: "general",
    optional: true,
  },
];

const constructionCommonSteps: InterviewStep[] = [
  {
    id: "career",
    label: "これまでの職歴",
    prompt: "これまでの職歴を時系列で簡単に教えてください。",
    placeholder: "例: 専門学校卒業後、施工管理補助として2年勤務。",
    mode: "construction",
    optional: false,
  },
  {
    id: "construction-role",
    label: "職種カテゴリ",
    prompt: "現在または直近の職種カテゴリを選ぶか、近い内容を入力してください。",
    placeholder: "例: 施工管理 / 設計 / 積算 / CAD/BIM / 職人系",
    mode: "construction",
    optional: false,
  },
  {
    id: "construction-work",
    label: "担当業務",
    prompt: "担当していた業務や現場での役割を教えてください。",
    placeholder: "例: 工程管理、施工図修正、積算補助、BIMモデル作成など。",
    mode: "construction",
    optional: false,
  },
  {
    id: "construction-achievement",
    label: "実績・工夫",
    prompt: "現場や案件で工夫したこと、成果、評価された点を教えてください。",
    placeholder: "例: 工程遅延を抑えた、安全是正を減らした、図面修正の精度改善。",
    mode: "construction",
    optional: false,
  },
  {
    id: "wants",
    label: "希望条件",
    prompt: "希望職種、案件、勤務地、年収、働き方を教えてください。",
    placeholder: "例: 非住宅案件、東京勤務、年収500万円以上、転勤少なめ。",
    mode: "construction",
    optional: false,
  },
  {
    id: "ng",
    label: "NG条件",
    prompt: "避けたい条件や働き方があれば教えてください。",
    placeholder: "例: 夜勤が多すぎる現場、転勤前提、出張長期固定。",
    mode: "construction",
    optional: true,
  },
];

const constructionBranchSteps: Record<string, InterviewStep[]> = {
  "施工管理": [
    {
      id: "project-type",
      label: "案件種別",
      prompt: "住宅、非住宅、土木、改修など、扱った案件種別を教えてください。",
      placeholder: "例: 新築マンション、物流倉庫、改修工事など。",
      mode: "construction",
      optional: false,
      branchKey: "施工管理",
    },
    {
      id: "structure",
      label: "構造種別",
      prompt: "RC、S、SRC、木造など、関わった構造種別を教えてください。",
      placeholder: "例: RC造、S造、木造在来。",
      mode: "construction",
      optional: false,
      branchKey: "施工管理",
    },
    {
      id: "strength-area",
      label: "強い管理領域",
      prompt: "工程・安全・品質・原価のうち、強みがある領域を教えてください。",
      placeholder: "例: 安全管理と工程調整が強み。",
      mode: "construction",
      optional: false,
      branchKey: "施工管理",
    },
    {
      id: "licenses",
      label: "保有資格",
      prompt: "保有資格や受験予定があれば教えてください。",
      placeholder: "例: 2級建築施工管理技士補、玉掛け技能講習。",
      mode: "construction",
      optional: true,
      branchKey: "施工管理",
    },
    {
      id: "shift",
      label: "出張・夜勤・転勤可否",
      prompt: "出張、夜勤、転勤の可否を教えてください。",
      placeholder: "例: 短期出張は可、夜勤は月1回まで、転勤は不可。",
      mode: "construction",
      optional: false,
      branchKey: "施工管理",
    },
  ],
  設計: [
    {
      id: "design-projects",
      label: "案件種別",
      prompt: "どのような用途や案件に携わったか教えてください。",
      placeholder: "例: 共同住宅、オフィス、商業施設。",
      mode: "construction",
      optional: false,
      branchKey: "設計",
    },
    {
      id: "design-structure",
      label: "構造・用途",
      prompt: "構造や用途、関与の深さを教えてください。",
      placeholder: "例: S造店舗、基本設計中心。",
      mode: "construction",
      optional: false,
      branchKey: "設計",
    },
    {
      id: "design-phase",
      label: "設計フェーズ",
      prompt: "基本設計、実施設計、確認申請、監理などの経験を教えてください。",
      placeholder: "例: 実施設計と確認申請補助。",
      mode: "construction",
      optional: false,
      branchKey: "設計",
    },
    {
      id: "design-license",
      label: "資格",
      prompt: "保有資格や受験予定を教えてください。",
      placeholder: "例: 二級建築士、受験勉強中。",
      mode: "construction",
      optional: true,
      branchKey: "設計",
    },
    {
      id: "design-software",
      label: "使用ソフト",
      prompt: "使用ソフトを教えてください。",
      placeholder: "例: AutoCAD、Revit、Jw_cad。",
      mode: "construction",
      optional: false,
      branchKey: "設計",
    },
  ],
  積算: [
    {
      id: "estimate-type",
      label: "積算対象",
      prompt: "どのような案件・工種の積算を担当したか教えてください。",
      placeholder: "例: 内装改修、設備更新、躯体工事。",
      mode: "construction",
      optional: false,
      branchKey: "積算",
    },
    {
      id: "estimate-software",
      label: "使用ソフト",
      prompt: "積算や拾い出しで使ったソフトやツールを教えてください。",
      placeholder: "例: Excel、みつも郎、CAD図面。",
      mode: "construction",
      optional: false,
      branchKey: "積算",
    },
    {
      id: "estimate-cost",
      label: "原価管理経験",
      prompt: "原価検証や見積比較の経験があれば教えてください。",
      placeholder: "例: 協力会社見積比較、VE提案。",
      mode: "construction",
      optional: false,
      branchKey: "積算",
    },
    {
      id: "estimate-license",
      label: "資格",
      prompt: "保有資格や受験予定を教えてください。",
      placeholder: "例: 建築積算士を勉強中。",
      mode: "construction",
      optional: true,
      branchKey: "積算",
    },
  ],
  "CAD/BIM": [
    {
      id: "cad-software",
      label: "使用ソフト",
      prompt: "普段使っているソフトを教えてください。",
      placeholder: "例: AutoCAD、Revit、Tfas、Rebro。",
      mode: "construction",
      optional: false,
      branchKey: "CAD/BIM",
    },
    {
      id: "cad-target",
      label: "作図対象",
      prompt: "どの図面・モデルを扱ったか教えてください。",
      placeholder: "例: 意匠図、施工図、設備BIMモデル。",
      mode: "construction",
      optional: false,
      branchKey: "CAD/BIM",
    },
    {
      id: "cad-scope",
      label: "モデリング範囲",
      prompt: "作成だけでなく、干渉チェックや納まり調整の経験があれば教えてください。",
      placeholder: "例: 干渉チェック、施工図修正、モデリング補助。",
      mode: "construction",
      optional: false,
      branchKey: "CAD/BIM",
    },
    {
      id: "cad-collaboration",
      label: "他部署連携",
      prompt: "設計者、施工管理、協力会社との連携経験を教えてください。",
      placeholder: "例: 現場担当と週次調整、設計変更対応。",
      mode: "construction",
      optional: false,
      branchKey: "CAD/BIM",
    },
  ],
  職人系: [
    {
      id: "trade-scope",
      label: "工種経験",
      prompt: "これまで経験した工種や作業内容を教えてください。",
      placeholder: "例: 内装仕上げ、電気工事補助、配管施工。",
      mode: "construction",
      optional: false,
      branchKey: "職人系",
    },
    {
      id: "site-scale",
      label: "現場規模",
      prompt: "現場規模や案件の特徴を教えてください。",
      placeholder: "例: 中規模改修、商業施設、マンション新築。",
      mode: "construction",
      optional: false,
      branchKey: "職人系",
    },
    {
      id: "safety",
      label: "安全意識",
      prompt: "安全面で意識していたことや評価された点を教えてください。",
      placeholder: "例: KY活動、指差呼称、整理整頓の徹底。",
      mode: "construction",
      optional: false,
      branchKey: "職人系",
    },
    {
      id: "workstyle",
      label: "夜勤・出張・転勤可否",
      prompt: "働き方の可否を教えてください。",
      placeholder: "例: 夜勤可、長期出張は不可。",
      mode: "construction",
      optional: false,
      branchKey: "職人系",
    },
  ],
};

export function getInterviewSteps(
  mode: AppMode,
  branch?: string,
): InterviewStep[] {
  if (mode === "general") return generalInterviewSteps;
  if (!branch || !constructionBranchSteps[branch]) {
    return constructionCommonSteps;
  }
  return [...constructionCommonSteps, ...constructionBranchSteps[branch]];
}

export const progressLabels = [
  { href: "/diagnosis", label: "1分診断" },
  { href: "/interview", label: "AI面談" },
  { href: "/profile", label: "プロフィール" },
  { href: "/documents", label: "書類" },
  { href: "/interview-prep", label: "面接準備" },
  { href: "/offer-review", label: "条件通知レビュー" },
];

export const sampleDiagnostics: Record<string, QuickAssessmentInput> = {
  "young-cs": {
    currentRole: "カスタマーサクセス",
    desiredRole: "カスタマーサクセス",
    preferredLocation: "東京都",
    salaryRange: "400万〜500万円",
    currentWorry: "書類に自信がない",
    mode: "general",
  },
  sales: {
    currentRole: "法人営業",
    desiredRole: "インサイドセールス",
    preferredLocation: "東京都",
    salaryRange: "500万〜650万円",
    currentWorry: "年収を上げたい",
    mode: "general",
  },
  "site-manager": {
    currentRole: "建築施工管理",
    desiredRole: "建築施工管理",
    preferredLocation: "関東圏",
    salaryRange: "500万〜650万円",
    currentWorry: "働き方を見直したい",
    mode: "construction",
  },
  cad: {
    currentRole: "CADオペレーター",
    desiredRole: "BIMオペレーター",
    preferredLocation: "大阪府",
    salaryRange: "300万〜400万円",
    currentWorry: "経験が浅くて不安",
    mode: "construction",
  },
};

export function getConstructionBranchFromAnswers(answers: InterviewAnswer[]) {
  const roleAnswer = answers.find((answer) => answer.questionId === "construction-role");
  const value = roleAnswer?.answer.trim();

  if (!value) return undefined;

  if (value.includes("施工")) return "施工管理";
  if (value.includes("設計")) return "設計";
  if (value.includes("積算")) return "積算";
  if (value.toLowerCase().includes("cad") || value.toLowerCase().includes("bim")) {
    return "CAD/BIM";
  }
  if (value.includes("職人")) return "職人系";

  return value;
}
