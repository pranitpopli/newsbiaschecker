import { pipeline, TextClassificationPipeline } from '@huggingface/transformers';

export interface BiasSignal {
  type: 'toxicity' | 'subjectivity' | 'sentiment_shift' | 'loaded_language';
  label?: string;
  score: number;
  spans?: string[];
  phrase?: string;
  weight?: number;
}

export interface BiasAnalysisResult {
  bias_score: number; // 0-10, higher means more biased
  detected_bias_types: string[];
  signals: BiasSignal[];
  explanations: string[];
}

class BiasAnalyzer {
  private toxicityClassifier: TextClassificationPipeline | null = null;
  private isInitializing = false;
  private initPromise: Promise<void> | null = null;

  async initialize(): Promise<void> {
    if (this.toxicityClassifier) return;
    if (this.isInitializing && this.initPromise) return this.initPromise;

    this.isInitializing = true;
    this.initPromise = this.loadModel();
    
    try {
      await this.initPromise;
    } finally {
      this.isInitializing = false;
    }
  }

  private async loadModel(): Promise<void> {
    try {
      // Use Xenova toxic-bert model for browser compatibility  
      const classifier = await pipeline(
        'text-classification',
        'Xenova/toxic-bert',
        { device: 'webgpu' }
      );
      this.toxicityClassifier = classifier as TextClassificationPipeline;
    } catch (error) {
      console.warn('WebGPU not available, falling back to CPU');
      const classifier = await pipeline(
        'text-classification',
        'Xenova/toxic-bert',
        { device: 'cpu' }
      );
      this.toxicityClassifier = classifier as TextClassificationPipeline;
    }
  }

  async analyzeBias(
    aiSummary: string,
    originalArticle?: string
  ): Promise<BiasAnalysisResult> {
    if (!this.toxicityClassifier) {
      await this.initialize();
    }

    const signals: BiasSignal[] = [];
    const detectedBiasTypes: string[] = [];
    const explanations: string[] = [];

    // Stage 1: Toxicity Analysis
    try {
      const toxicityResult = await this.toxicityClassifier!(aiSummary);
      
      // Handle the result properly - it could be an array or single result
      const results = Array.isArray(toxicityResult) ? toxicityResult : [toxicityResult];
      
      for (const result of results) {
        // Handle both single item and array of classifications
        const classifications = Array.isArray(result) ? result : [result];
        
        for (const classification of classifications) {
          if (classification && typeof classification === 'object' && 
              'label' in classification && 'score' in classification) {
            if (classification.label === 'TOXIC' && classification.score > 0.3) {
              signals.push({
                type: 'toxicity',
                label: classification.label,
                score: classification.score
              });
              detectedBiasTypes.push('toxicity');
              explanations.push(`Detected potential toxic language (confidence: ${(classification.score * 100).toFixed(1)}%)`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in toxicity analysis:', error);
    }

    // Stage 2: Loaded Language Detection
    const loadedLanguagePatterns = [
      /\b(clearly|obviously|undoubtedly|certainly|definitely)\b/gi,
      /\b(shocking|outrageous|devastating|alarming)\b/gi,
      /\b(experts agree|studies show|it is known)\b/gi
    ];

    loadedLanguagePatterns.forEach(pattern => {
      const matches = aiSummary.match(pattern);
      if (matches) {
        matches.forEach(match => {
          signals.push({
            type: 'loaded_language',
            phrase: match,
            score: 0.6,
            weight: 0.4
          });
        });
        detectedBiasTypes.push('loaded_language');
        explanations.push(`Found loaded language: "${matches.join('", "')}"`);
      }
    });

    // Stage 3: Subjectivity Analysis (simple pattern matching)
    const subjectivityPatterns = [
      /\b(I think|I believe|in my opinion|it seems)\b/gi,
      /\b(amazing|terrible|wonderful|awful)\b/gi
    ];

    subjectivityPatterns.forEach(pattern => {
      const matches = aiSummary.match(pattern);
      if (matches) {
        matches.forEach(match => {
          signals.push({
            type: 'subjectivity',
            phrase: match,
            score: 0.5,
            weight: 0.3
          });
        });
        detectedBiasTypes.push('subjectivity');
        explanations.push(`Found subjective language: "${matches.join('", "')}"`);
      }
    });

    // Calculate composite bias score (0-10)
    const biasScore = this.calculateBiasScore(signals);

    return {
      bias_score: biasScore,
      detected_bias_types: [...new Set(detectedBiasTypes)],
      signals,
      explanations
    };
  }

  /**
   * Calculate bias score using weighted formula
   * Thresholds and weights are documented for editorial tuning
   */
  private calculateBiasScore(signals: BiasSignal[]): number {
    let totalScore = 0;
    let maxWeight = 0;

    // Toxicity weight: 0.6 (highest priority)
    const toxicitySignals = signals.filter(s => s.type === 'toxicity');
    if (toxicitySignals.length > 0) {
      const avgToxicityScore = toxicitySignals.reduce((sum, s) => sum + s.score, 0) / toxicitySignals.length;
      totalScore += avgToxicityScore * 6; // Max contribution: 6 points
      maxWeight += 6;
    }

    // Loaded language weight: 0.3
    const loadedLanguageSignals = signals.filter(s => s.type === 'loaded_language');
    if (loadedLanguageSignals.length > 0) {
      const loadedLanguageScore = Math.min(loadedLanguageSignals.length * 0.2, 1); // Cap at 1.0
      totalScore += loadedLanguageScore * 3; // Max contribution: 3 points  
      maxWeight += 3;
    }

    // Subjectivity weight: 0.1
    const subjectivitySignals = signals.filter(s => s.type === 'subjectivity');
    if (subjectivitySignals.length > 0) {
      const subjectivityScore = Math.min(subjectivitySignals.length * 0.15, 1);
      totalScore += subjectivityScore * 1; // Max contribution: 1 point
      maxWeight += 1;
    }

    // Normalize to 0-10 scale
    if (maxWeight === 0) return 0;
    return Math.min(Math.round((totalScore / maxWeight) * 10), 10);
  }

  getStatus(): 'not_initialized' | 'initializing' | 'ready' | 'error' {
    if (this.toxicityClassifier) return 'ready';
    if (this.isInitializing) return 'initializing';
    return 'not_initialized';
  }
}

export const biasAnalyzer = new BiasAnalyzer();