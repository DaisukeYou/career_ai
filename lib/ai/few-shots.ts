export type ConstructionCategory =
  | "施工管理"
  | "設計"
  | "積算"
  | "CAD/BIM"
  | "職人系"
  | "unknown";

export type FewShotExample = {
  inputSummary: string;
  desiredOutput: string;
};

export const constructionFewShots: Record<
  Exclude<ConstructionCategory, "unknown">,
  {
    profile: FewShotExample[];
    documents: FewShotExample[];
    interviewPrep: FewShotExample[];
  }
> = {
  "施工管理": {
    profile: [
      {
        inputSummary:
          "RC造マンション新築で工程・安全管理を担当。協力会社調整と是正削減の経験あり。",
        desiredOutput:
          "headline には『工程と安全を軸に現場を前に進める』を入れ、strengths には工程管理・安全意識・調整力を含める。",
      },
      {
        inputSummary:
          "物流施設の改修案件で夜勤あり。品質是正の先回りと段取り改善を実施。",
        desiredOutput:
          "concerns では原価経験不足を正直に書きつつ、interviewHighlights に段取り改善の具体例を入れる。",
      },
    ],
    documents: [
      {
        inputSummary: "施工管理、資格は施工管理技士補、S造・RC造案件経験あり。",
        desiredOutput:
          "constructionMeta に projectTypes / structureTypes / tradeScopes を明示し、summary は案件と管理領域を一文で表現する。",
      },
      {
        inputSummary: "共同住宅と非住宅の双方経験あり。",
        desiredOutput:
          "career history の achievements には工程前倒しや安全是正減少など、現場運営の成果を書く。",
      },
    ],
    interviewPrep: [
      {
        inputSummary: "工程と安全に強み。原価は補助レベル。",
        desiredOutput:
          "expectedQuestions には『工程・安全・品質での強み』を含め、weakPoint に原価管理の深さ不足を補足する。",
      },
      {
        inputSummary: "出張可だが転勤不可。",
        desiredOutput:
          "reverseQuestions に担当エリアや働き方確認を含める。",
      },
    ],
  },
  設計: {
    profile: [
      {
        inputSummary: "意匠設計で共同住宅を担当。実施設計と確認申請補助の経験あり。",
        desiredOutput:
          "strengths に設計フェーズ理解・図面精度・関係者調整を含める。",
      },
      {
        inputSummary: "二級建築士保有、Revit 学習中。",
        desiredOutput:
          "careerAnchors に資格活用と設計スキル拡張を入れる。",
      },
    ],
    documents: [
      {
        inputSummary: "基本設計から実施設計に関与。",
        desiredOutput:
          "career history の responsibilities に設計フェーズを明記し、software を constructionMeta に含める。",
      },
      {
        inputSummary: "用途は共同住宅とオフィス。",
        desiredOutput:
          "projectRecords の type に用途を分けて記載する。",
      },
    ],
    interviewPrep: [
      {
        inputSummary: "確認申請補助経験あり。",
        desiredOutput:
          "expectedQuestions に『どの設計フェーズまで担当したか』を含める。",
      },
      {
        inputSummary: "BIMは学習中。",
        desiredOutput:
          "weakPoint に BIM 主担当経験不足を入れつつ、学習姿勢を draftAnswer で補強する。",
      },
    ],
  },
  積算: {
    profile: [
      {
        inputSummary: "改修案件の積算と見積比較を担当。",
        desiredOutput:
          "strengths に数量拾い・見積比較・原価感覚を入れる。",
      },
      {
        inputSummary: "Excel 中心、協力会社見積の妥当性確認経験あり。",
        desiredOutput:
          "recommendedRoles に積算・購買補助系も含める。",
      },
    ],
    documents: [
      {
        inputSummary: "設備更新と内装改修の積算経験あり。",
        desiredOutput:
          "career history の achievements に精度改善や比較表整備を入れる。",
      },
      {
        inputSummary: "建築積算士は未保有。",
        desiredOutput:
          "licenses は空でもよいが、motivation で学習意欲を補う。",
      },
    ],
    interviewPrep: [
      {
        inputSummary: "見積比較と原価差異把握に強み。",
        desiredOutput:
          "expectedQuestions に『積算精度を上げる工夫』を含める。",
      },
      {
        inputSummary: "案件規模の説明が弱い。",
        desiredOutput:
          "weakPoint に対象工種や案件規模の具体化不足を入れる。",
      },
    ],
  },
  "CAD/BIM": {
    profile: [
      {
        inputSummary: "AutoCAD中心で設備図修正、Revitは補助レベル。",
        desiredOutput:
          "strengths に図面精度・修正スピード・連携力を入れ、concerns に BIM 主担当不足を入れる。",
      },
      {
        inputSummary: "施工図修正と干渉チェック補助の経験あり。",
        desiredOutput:
          "interviewHighlights に作図対象と調整先を具体に書く。",
      },
    ],
    documents: [
      {
        inputSummary: "意匠図・設備図の修正経験あり。",
        desiredOutput:
          "constructionMeta.software と tradeScopes を明確に書く。",
      },
      {
        inputSummary: "BIM は学習中。",
        desiredOutput:
          "motivation で BIM 志向を前向きに書きつつ、現職の CAD 実務を土台として表現する。",
      },
    ],
    interviewPrep: [
      {
        inputSummary: "BIMに挑戦したい。",
        desiredOutput:
          "expectedQuestions に『なぜ BIM へ広げたいのか』を含め、draftAnswer で CAD 実務との接続を書く。",
      },
      {
        inputSummary: "他部署連携あり。",
        desiredOutput:
          "reverseQuestions に育成体制と設計/施工との連携範囲を入れる。",
      },
    ],
  },
  職人系: {
    profile: [
      {
        inputSummary: "内装仕上げ工として商業施設改修を担当。",
        desiredOutput:
          "strengths に手際・安全意識・現場対応力を含める。",
      },
      {
        inputSummary: "夜勤可、長期出張不可。",
        desiredOutput:
          "careerAnchors に働き方条件を無理なく反映する。",
      },
    ],
    documents: [
      {
        inputSummary: "複数工種の補助経験あり。",
        desiredOutput:
          "tradeScopes を広めに整理し、summary は現場対応力を軸に書く。",
      },
      {
        inputSummary: "資格なし。",
        desiredOutput:
          "資格欄が空でも、実務経験の深さを career history 側で補う。",
      },
    ],
    interviewPrep: [
      {
        inputSummary: "安全意識を評価されている。",
        desiredOutput:
          "expectedQuestions に安全の伝え方を入れる。",
      },
      {
        inputSummary: "職長経験なし。",
        desiredOutput:
          "weakPoint にマネジメント経験不足を入れ、今後の志向で補完する。",
      },
    ],
  },
};

export function getFewShotExamples(
  category: ConstructionCategory,
  kind: "profile" | "documents" | "interviewPrep",
) {
  if (category === "unknown") return [];
  return constructionFewShots[category][kind];
}
