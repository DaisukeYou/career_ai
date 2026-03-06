import { OFFER_REVIEW_DISCLAIMER } from "@/lib/constants/app";
import type {
  CandidateProfile,
  DocumentsBundle,
  InterviewPrepResult,
  OfferReviewResult,
  QuickAssessmentResult,
} from "@/lib/schemas/domain";

type SampleBundle = {
  id: string;
  label: string;
  quickAssessment: QuickAssessmentResult;
  profile: CandidateProfile;
  documents: DocumentsBundle;
  interviewPrep: InterviewPrepResult;
  offerReview: OfferReviewResult;
};

function withMeta<T extends { result?: unknown }>(
  body: Omit<T, "status" | "message" | "generatedAt">,
): T {
  return {
    status: "success",
    message: "下書きを作成しました。",
    generatedAt: new Date().toISOString(),
    ...body,
  } as unknown as T;
}

export const mockSamples: SampleBundle[] = [
  {
    id: "young-cs",
    label: "若手CS職",
    quickAssessment: withMeta<QuickAssessmentResult>({
      result: {
        mode: "general",
        strengthTags: ["顧客折衝", "課題整理", "改善提案"],
        nextActions: [
          "担当顧客数や解約率など数字を3つ棚卸しする",
          "オンボーディング経験を自己PRに変換する",
          "CS以外に営業寄りポジションも比較する",
        ],
        improvementPoints: [
          "担当範囲の広さ",
          "定量成果の見せ方",
          "再現性ある工夫の言語化",
        ],
        summary:
          "顧客伴走の経験は強く、数字の見せ方を整えると若手CSとして十分に戦えます。",
      },
    }),
    profile: withMeta<CandidateProfile>({
      result: {
        mode: "general",
        headline: "顧客接点と改善提案を両立できる若手CS",
        summary:
          "SaaS企業でオンボーディングから活用支援まで一貫して担当。顧客課題を吸い上げ、社内連携で解決につなげる実務経験がある。",
        strengths: ["顧客との関係構築", "導入初期の伴走", "改善提案の整理力"],
        concerns: ["成果の数値化が弱い", "リーダー経験は限定的"],
        careerAnchors: ["顧客に深く向き合える", "成長環境", "無理のない働き方"],
        recommendedRoles: ["カスタマーサクセス", "インサイドセールス", "営業企画アシスタント"],
        completionScore: 72,
        evidenceGaps: ["担当顧客数", "継続率への寄与", "改善施策の件数"],
        interviewHighlights: ["顧客の声を拾って改善した事例", "オンボーディングの工夫"],
      },
    }),
    documents: {
      resumeDraft: withMeta({
        result: {
          basicInfo: {
            fullName: "",
            currentRole: "カスタマーサクセス",
            preferredLocation: "東京都",
          },
          summary:
            "SaaSのカスタマーサクセスとして、導入支援から活用定着まで担当。顧客課題を整理し、社内外を巻き込んで改善を進めてきた。",
          strengths: ["顧客折衝", "定着支援", "社内連携"],
        },
      }),
      careerHistoryDraft: withMeta({
        result: {
          headline: "顧客の活用定着を支えるCS経験",
          experiences: [
            {
              company: "SaaS企業A",
              period: "2023年4月 - 現在",
              role: "カスタマーサクセス",
              responsibilities: ["オンボーディング", "問い合わせ対応", "活用提案"],
              achievements: ["運用定着までの初期支援を標準化", "顧客の要望を社内改善につなげた"],
              metricsSuggestions: ["担当社数", "継続率", "満足度"],
            },
          ],
        },
      }),
      selfPRDraft: withMeta({
        result: {
          tone: "balanced",
          body: "顧客の課題を言語化し、社内の関係者と連携しながら運用定着まで伴走してきました。",
          starBullets: [
            "状況: 導入後に活用が進まない顧客が多かった",
            "行動: 利用状況を整理し、初期支援フローを再設計した",
            "結果: 顧客の立ち上がりが安定し、問い合わせも減少した",
          ],
          numericSuggestions: ["担当顧客数", "問い合わせ削減率", "継続率改善"],
        },
      }),
      motivationDraft: withMeta({
        result: {
          templateLabel: "顧客伴走型テンプレート",
          body: "顧客と長く向き合いながら、課題解決に深く入り込める環境で価値を出したいと考えています。",
          customizationTips: ["志望企業の顧客層に合わせる", "現職の経験との接続を書く"],
        },
      }),
    },
    interviewPrep: withMeta({
      result: {
        expectedQuestions: [
          {
            question: "これまでのCS経験を教えてください",
            intent: "業務の幅と再現性を確認したい",
            draftAnswer:
              "導入支援から活用定着まで担当し、顧客課題を整理して社内提案につなげてきました。",
            starRewrite:
              "導入直後に利用が進まない顧客に対し、活用状況のヒアリングと支援設計を見直しました。",
            weakPoint: "成果数字が不足しているため担当社数を補足する",
          },
        ],
        reverseQuestions: ["立ち上がり支援のKPIは何ですか", "CSがプロダクト改善に関わる範囲はどこまでですか"],
        coachingNotes: ["数字が弱いので事前に3つ準備する", "改善提案の背景を短く言う"],
      },
    }),
    offerReview: withMeta({
      result: {
        basicTerms: [
          { label: "想定年収", value: "420万円", confidence: "high" },
          { label: "勤務地", value: "東京都渋谷区", confidence: "high" },
        ],
        redFlagPoints: ["固定残業の内訳が不明", "試用期間中の条件差分が明記されていない"],
        checkQuestions: ["固定残業時間と超過分の扱いを確認したいです", "試用期間中の給与・賞与差分はありますか"],
        negotiationDraft:
          "ご提示ありがとうございます。条件面で数点確認したく、固定残業の内訳と試用期間中の条件差分についてご教示いただけますでしょうか。",
        missingInfo: ["賞与の支給条件", "評価改定タイミング"],
        overallConfidence: "medium",
        needsHumanReview: true,
        disclaimer: OFFER_REVIEW_DISCLAIMER,
      },
    }),
  },
  {
    id: "sales",
    label: "法人営業職",
    quickAssessment: withMeta<QuickAssessmentResult>({
      result: {
        mode: "general",
        strengthTags: ["提案営業", "関係構築", "数字達成"],
        nextActions: ["達成率を整理する", "提案プロセスをSTAR化する", "無形商材への接続を示す"],
        improvementPoints: ["業界知識の転用", "案件単価", "提案数"],
        summary: "営業成果は強いので、何をどう売ったかを具体化すると訴求力が上がります。",
      },
    }),
    profile: withMeta<CandidateProfile>({
      result: {
        mode: "general",
        headline: "提案型の法人営業として再現性ある成果を出せる人材",
        summary: "新規・既存営業の両面を担当し、提案からクロージングまで一貫して対応。",
        strengths: ["目標達成意識", "提案の組み立て", "顧客深耕"],
        concerns: ["マネジメント経験が少ない", "業界チェンジ時の説明補強が必要"],
        careerAnchors: ["成果が正当に評価される", "商材理解を深めたい", "年収アップ"],
        recommendedRoles: ["法人営業", "インサイドセールス", "フィールドセールス"],
        completionScore: 78,
        evidenceGaps: ["受注率", "平均単価", "既存深耕実績"],
        interviewHighlights: ["提案が刺さった理由", "苦戦案件の立て直し"],
      },
    }),
    documents: {
      resumeDraft: withMeta({
        result: {
          basicInfo: { fullName: "", currentRole: "法人営業", preferredLocation: "東京都" },
          summary: "法人営業として提案活動と既存深耕を担当。目標達成に向けて行動量と仮説提案を両立してきた。",
          strengths: ["新規開拓", "提案資料作成", "関係構築"],
        },
      }),
      careerHistoryDraft: withMeta({
        result: {
          headline: "成果と提案力を兼ねた営業経験",
          experiences: [
            {
              company: "商社B",
              period: "2021年4月 - 現在",
              role: "法人営業",
              responsibilities: ["新規開拓", "既存深耕", "提案書作成"],
              achievements: ["月次目標を継続達成", "新規案件を複数受注"],
              metricsSuggestions: ["達成率", "案件数", "単価"],
            },
          ],
        },
      }),
      selfPRDraft: withMeta({
        result: {
          tone: "balanced",
          body: "顧客課題を整理した上で提案の切り口をつくり、受注まで粘り強く伴走してきました。",
          starBullets: ["状況: 新規開拓が停滞", "行動: 仮説提案の型を改善", "結果: 受注件数が増加"],
          numericSuggestions: ["月次達成率", "新規受注数", "商談化率"],
        },
      }),
      motivationDraft: withMeta({
        result: {
          templateLabel: "成果訴求テンプレート",
          body: "これまでの営業経験を活かしつつ、より提案余地の大きい商材で価値提供したいと考えています。",
          customizationTips: ["商材理解との接続を書く", "なぜ今のタイミングかを補足する"],
        },
      }),
    },
    interviewPrep: withMeta({
      result: {
        expectedQuestions: [
          {
            question: "営業で成果を出した工夫は何ですか",
            intent: "再現性を見るため",
            draftAnswer: "顧客課題を事前に仮説化し、提案の軸を絞って商談に臨んでいました。",
            weakPoint: "数字を1つ添えると強い",
          },
        ],
        reverseQuestions: ["成果評価の指標は何ですか"],
        coachingNotes: ["行動量だけでなく提案の質も話す"],
      },
    }),
    offerReview: withMeta({
      result: {
        basicTerms: [{ label: "想定年収", value: "550万円", confidence: "high" }],
        redFlagPoints: ["インセンティブ条件が別紙参照のみ"],
        checkQuestions: ["インセンティブ支給条件を確認できますか"],
        negotiationDraft:
          "条件提示ありがとうございます。インセンティブの支給条件について、具体的な基準をご共有いただけますと幸いです。",
        missingInfo: ["昇給タイミング"],
        overallConfidence: "medium",
        needsHumanReview: false,
        disclaimer: OFFER_REVIEW_DISCLAIMER,
      },
    }),
  },
  {
    id: "site-manager",
    label: "建築施工管理職",
    quickAssessment: withMeta<QuickAssessmentResult>({
      result: {
        mode: "construction",
        strengthTags: ["工程調整", "安全意識", "現場推進"],
        nextActions: ["案件規模と構造を整理する", "安全・品質での工夫を言語化する", "資格予定も書類に反映する"],
        improvementPoints: ["案件規模", "原価関与", "是正削減"],
        summary: "現場経験は価値が高く、案件情報と管理領域を整理すると選考で伝わりやすくなります。",
      },
    }),
    profile: withMeta<CandidateProfile>({
      result: {
        mode: "construction",
        headline: "工程と安全を軸に現場を前に進める若手施工管理",
        summary: "RC造共同住宅や物流施設の現場で、工程調整と安全管理を中心に実務経験を積んでいる。",
        strengths: ["工程管理", "協力会社調整", "安全意識"],
        concerns: ["原価管理の深さは限定的", "資格取得がこれから"],
        careerAnchors: ["案件規模を広げたい", "無理のない働き方", "資格取得支援"],
        recommendedRoles: ["建築施工管理", "改修施工管理", "設備施工管理補助"],
        completionScore: 74,
        evidenceGaps: ["担当物件規模", "工程改善の成果", "是正件数"],
        interviewHighlights: ["現場調整で前倒しした経験", "安全面で徹底したこと"],
      },
    }),
    documents: {
      resumeDraft: withMeta({
        result: {
          basicInfo: {
            fullName: "",
            currentRole: "建築施工管理",
            preferredLocation: "関東圏",
          },
          summary:
            "建築施工管理として、RC造共同住宅や倉庫案件で工程・安全を中心に現場運営を担当してきた。",
          strengths: ["工程管理", "安全管理", "協力会社との調整"],
          licenses: ["2級建築施工管理技士補"],
          constructionMeta: {
            projectTypes: ["共同住宅", "物流倉庫"],
            structureTypes: ["RC", "S"],
            tradeScopes: ["躯体", "内装", "改修"],
            softwares: ["Excel", "AutoCAD"],
          },
        },
      }),
      careerHistoryDraft: withMeta({
        result: {
          headline: "現場を止めずに前に進める施工管理経験",
          experiences: [
            {
              company: "建設会社C",
              period: "2022年4月 - 現在",
              role: "建築施工管理",
              responsibilities: ["工程管理", "安全管理", "協力会社調整"],
              achievements: ["工程遅延のリカバリー", "安全是正の減少"],
              metricsSuggestions: ["担当フロア数", "工期", "是正件数"],
            },
          ],
          projectRecords: [
            {
              name: "物流倉庫新築",
              type: "非住宅",
              scale: "S造・地上4階",
              structure: "S造",
              responsibility: "工程・安全管理",
              notes: ["躯体から竣工まで一部担当", "協力会社との日次調整"],
            },
          ],
        },
      }),
      selfPRDraft: withMeta({
        result: {
          tone: "balanced",
          body: "現場の安全と工程の両立を意識し、関係者との調整を通じて現場を前に進めてきました。",
          starBullets: ["状況: 工程が逼迫", "行動: 優先順位を整理し調整", "結果: 工程遅れを最小化"],
          numericSuggestions: ["工期短縮日数", "是正件数", "担当人数"],
        },
      }),
      motivationDraft: withMeta({
        result: {
          templateLabel: "現場経験活用テンプレート",
          body: "現場経験を活かしつつ、より案件規模や裁量のある環境で施工管理として成長したいと考えています。",
          customizationTips: ["扱う案件種別に合わせる", "資格取得計画を添える"],
        },
      }),
    },
    interviewPrep: withMeta({
      result: {
        expectedQuestions: [
          {
            question: "工程・安全・品質で強みは何ですか",
            intent: "管理領域の軸を知りたい",
            draftAnswer: "工程調整と安全管理に強みがあり、協力会社とのすり合わせを早めに行っていました。",
            starRewrite: "工程が逼迫した現場で、朝会と日次確認で調整精度を上げました。",
            weakPoint: "案件規模の説明を補足する",
          },
        ],
        reverseQuestions: ["担当案件の規模感と体制を教えてください"],
        coachingNotes: ["案件種別、構造、工期を短くセットで言う"],
        constructionTips: ["安全・工程・品質のうち2軸に絞って話す", "現場写真がなくても工程例で説明する"],
      },
    }),
    offerReview: withMeta({
      result: {
        basicTerms: [
          { label: "想定年収", value: "580万円", confidence: "high" },
          { label: "担当エリア", value: "首都圏", confidence: "medium" },
        ],
        redFlagPoints: ["現場手当の支給条件が曖昧", "転勤範囲の記載が広い"],
        checkQuestions: ["現場手当の対象条件を確認したいです", "転勤はどの範囲・頻度が想定されますか"],
        negotiationDraft:
          "条件提示ありがとうございます。現場手当の支給条件と、転勤・出張の想定範囲について確認させてください。",
        missingInfo: ["夜勤頻度", "代休運用"],
        overallConfidence: "medium",
        needsHumanReview: true,
        disclaimer: OFFER_REVIEW_DISCLAIMER,
      },
    }),
  },
  {
    id: "cad",
    label: "CADオペレーター",
    quickAssessment: withMeta<QuickAssessmentResult>({
      result: {
        mode: "construction",
        strengthTags: ["図面精度", "BIM適性", "他部署連携"],
        nextActions: ["使用ソフトを整理する", "作図範囲を明確にする", "BIM移行の意欲を志望動機に入れる"],
        improvementPoints: ["案件用途", "修正件数", "連携先"],
        summary: "実務で使ったソフトと作図範囲を具体化すると、BIM系ポジションにも広げやすいです。",
      },
    }),
    profile: withMeta<CandidateProfile>({
      result: {
        mode: "construction",
        headline: "図面精度と現場連携に強いCADオペレーター",
        summary: "設備・建築図面の修正とBIM補助に携わり、設計・現場との調整を丁寧に行っている。",
        strengths: ["AutoCAD操作", "図面修正の正確さ", "コミュニケーション"],
        concerns: ["BIM主担当経験はこれから", "案件規模の説明が弱い"],
        careerAnchors: ["BIMに寄せたい", "安定した働き方", "スキルアップ"],
        recommendedRoles: ["CADオペレーター", "BIMオペレーター", "設計補助"],
        completionScore: 70,
        evidenceGaps: ["使用ソフト比率", "修正件数", "他部署調整の頻度"],
        interviewHighlights: ["修正精度の工夫", "BIM学習姿勢"],
      },
    }),
    documents: {
      resumeDraft: withMeta({
        result: {
          basicInfo: {
            fullName: "",
            currentRole: "CADオペレーター",
            preferredLocation: "大阪府",
          },
          summary:
            "CADオペレーターとして設計・現場担当者の指示をもとに図面修正を担当。BIMへの展開にも関心が高い。",
          strengths: ["AutoCAD", "図面修正", "関係者連携"],
          constructionMeta: {
            projectTypes: ["商業施設", "改修"],
            structureTypes: ["S", "RC"],
            tradeScopes: ["設備", "意匠補助"],
            softwares: ["AutoCAD", "Revit"],
          },
        },
      }),
      careerHistoryDraft: withMeta({
        result: {
          headline: "図面精度を支えるCAD/BIM補助経験",
          experiences: [
            {
              company: "設計事務所D",
              period: "2022年4月 - 現在",
              role: "CADオペレーター",
              responsibilities: ["図面修正", "設計補助", "BIM補助"],
              achievements: ["図面差し戻しの減少", "修正スピード改善"],
              metricsSuggestions: ["図面枚数", "修正件数", "対応案件数"],
            },
          ],
        },
      }),
      selfPRDraft: withMeta({
        result: {
          tone: "balanced",
          body: "図面精度を落とさずにスピードを担保し、関係者の意図を汲んで修正を進めることを大切にしています。",
          starBullets: ["状況: 修正依頼が多い", "行動: 変更点を整理して優先付け", "結果: 手戻りを減らした"],
          numericSuggestions: ["月間図面枚数", "修正手戻り率", "対応案件数"],
        },
      }),
      motivationDraft: withMeta({
        result: {
          templateLabel: "BIM志向テンプレート",
          body: "これまでのCAD実務を土台に、今後はBIM領域でもより高い専門性を身につけたいと考えています。",
          customizationTips: ["BIM活用状況に触れる", "学習中の内容を書く"],
        },
      }),
    },
    interviewPrep: withMeta({
      result: {
        expectedQuestions: [
          {
            question: "なぜBIMに挑戦したいのですか",
            intent: "志向性と継続性の確認",
            draftAnswer: "図面修正だけでなく、上流から情報連携に関わる仕事へ広げたいと考えています。",
            weakPoint: "学習中の内容を1つ添える",
          },
        ],
        reverseQuestions: ["BIM担当の育成体制はありますか"],
        coachingNotes: ["CAD実務の強みを先に言う", "学習意欲だけで終わらせない"],
        constructionTips: ["使用ソフトを具体名で言う", "作図範囲と調整相手をセットで話す"],
      },
    }),
    offerReview: withMeta({
      result: {
        basicTerms: [{ label: "想定年収", value: "360万円", confidence: "high" }],
        redFlagPoints: ["みなし残業の超過精算ルールが曖昧"],
        checkQuestions: ["超過残業分は別途支給されますか"],
        negotiationDraft:
          "ご提示条件ありがとうございます。みなし残業の超過分支給ルールについて確認させてください。",
        missingInfo: ["在宅可否", "評価面談頻度"],
        overallConfidence: "low",
        needsHumanReview: true,
        disclaimer: OFFER_REVIEW_DISCLAIMER,
      },
    }),
  },
];

export function getMockSample(id?: string) {
  return (
    mockSamples.find((sample) => sample.id === id) ??
    mockSamples[0]
  );
}
