export interface LLMEvaluationResult {
  summary_quality_score: number;
  tone_preservation_score: number;
  policy_compliance_score: number;
  accuracy_score: number;
  objective_bias_score: number;
  issues: Array<{
    type: 'policy_violation' | 'factual_deviation' | 'tone_shift';
    severity: 'low' | 'medium' | 'high';
    evidence: string;
  }>;
  suggested_edits: Array<{
    before: string;
    after: string;
    reason: string;
  }>;
  notes: string;
}

export interface EvaluationInput {
  originalArticle: string;
  aiSummary: string;
  companyPolicy: string;
  approvedCorpus: string;
  biasScore: number;
  apiKey: string;
}

class LLMEvaluator {
  async evaluateSummary(input: EvaluationInput): Promise<LLMEvaluationResult> {
    const prompt = this.constructPrompt(input);
    
    try {
      const response = await this.callOpenAI(prompt, input.apiKey);
      const result = this.parseAndValidateResponse(response);
      
      // Ensure objective_bias_score is passed through from Stage 1
      result.objective_bias_score = input.biasScore;
      
      return result;
    } catch (error) {
      console.error('LLM Evaluation error:', error);
      throw new Error(`Evaluation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private constructPrompt(input: EvaluationInput): string {
    return `You are a senior newsroom standards editor. Evaluate the AI summary for fidelity to the original article, tone preservation, and policy compliance.

ORIGINAL ARTICLE:
${input.originalArticle}

AI-GENERATED SUMMARY:
${input.aiSummary}

COMPANY POLICY:
${input.companyPolicy}

APPROVED CORPUS EXAMPLES:
${input.approvedCorpus}

OBJECTIVE BIAS SCORE: ${input.biasScore}/10 (from automated analysis)

Instructions:
- Evaluate summary quality (0-10): How well does it capture key information?
- Evaluate tone preservation (0-10): Does it maintain the original article's tone?
- Evaluate policy compliance (0-10): Does it follow company editorial guidelines?  
- Evaluate accuracy (0-10): Are facts correctly represented?
- Use the objective_bias_score as a signal for policy compliance and tone risk
- Identify specific issues with severity levels
- Suggest concrete edits where needed

Respond with JSON only (no code fences, no prose):
{
  "summary_quality_score": number,
  "tone_preservation_score": number, 
  "policy_compliance_score": number,
  "accuracy_score": number,
  "objective_bias_score": number,
  "issues": [
    {"type": "policy_violation|factual_deviation|tone_shift", "severity": "low|medium|high", "evidence": "specific text"}
  ],
  "suggested_edits": [
    {"before": "original text", "after": "suggested replacement", "reason": "explanation"}
  ],
  "notes": "brief overall assessment"
}`;
  }

  private async callOpenAI(prompt: string, apiKey: string): Promise<string> {
    const models = ['gpt-5-2025-08-07', 'gpt-4.1-2025-04-14', 'gpt-4o'];
    let lastError: Error | null = null;

    for (const model of models) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: 'system',
                content: 'You are a senior newsroom standards editor. Evaluate AI summaries for fidelity, tone preservation, and policy compliance. Respond with valid JSON only.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.1,
            max_tokens: 2000
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(`API Error (${response.status}): ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`Model ${model} failed, trying next...`, error);
        continue;
      }
    }

    throw lastError || new Error('All models failed');
  }

  private parseAndValidateResponse(response: string): LLMEvaluationResult {
    try {
      // Strip code fences if present
      const cleaned = response
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
        .trim();

      const parsed = JSON.parse(cleaned);

      // Validate required fields
      const required = [
        'summary_quality_score',
        'tone_preservation_score', 
        'policy_compliance_score',
        'accuracy_score'
      ];

      for (const field of required) {
        if (typeof parsed[field] !== 'number' || parsed[field] < 0 || parsed[field] > 10) {
          throw new Error(`Invalid ${field}: must be number 0-10`);
        }
      }

      // Ensure arrays exist
      parsed.issues = parsed.issues || [];
      parsed.suggested_edits = parsed.suggested_edits || [];
      parsed.notes = parsed.notes || 'No additional notes';

      return parsed as LLMEvaluationResult;
    } catch (error) {
      console.error('Failed to parse LLM response:', response);
      throw new Error(`Invalid JSON response: ${error instanceof Error ? error.message : 'Parse error'}`);
    }
  }

  validateApiKey(apiKey: string): boolean {
    return /^sk-[A-Za-z0-9\-_]+$/.test(apiKey) && apiKey.length > 20;
  }
}

export const llmEvaluator = new LLMEvaluator();