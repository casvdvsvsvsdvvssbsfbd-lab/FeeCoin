// ============================================
// Base Survey Provider
// Abstract base for all survey providers
// ============================================

import {
  ProviderConfig,
  Survey,
  VerificationResult,
  IntegrationError,
  RetryPolicy
} from '../types';
import { BaseProvider, ISurveyProvider } from './provider';

export abstract class BaseSurveyProvider extends BaseProvider implements ISurveyProvider {
  constructor(config: ProviderConfig) {
    super(config);
  }

  // Abstract methods to be implemented by concrete survey providers
  protected abstract createEmptyMetrics(): any;
  protected abstract createDefaultRetryPolicy(): RetryPolicy;
  abstract fetchSurveys(userId: string, countryCode: string, language: string): Promise<Survey[]>;
  abstract startSurvey(surveyId: string, userId: string): Promise<{ surveyUrl: string }>;
  abstract completeSurvey(surveyId: string, userId: string, answers: any): Promise<VerificationResult>;
  abstract checkQualification(surveyId: string, userId: string): Promise<boolean>;

  // Common survey provider implementation
  async fetchSurveysWithRetry(userId: string, countryCode: string, language: string): Promise<Survey[]> {
    return this.withRetry(async () => {
      const startTime = Date.now();
      
      try {
        const surveys = await this.fetchSurveys(userId, countryCode, language);
        
        const latency = Date.now() - startTime;
        this.updateMetrics(true, latency);
        
        return surveys;
      } catch (error) {
        const latency = Date.now() - startTime;
        this.updateMetrics(false, latency);
        
        throw this.handleSurveyError(error);
      }
    });
  }

  async startSurveyWithRetry(surveyId: string, userId: string): Promise<{ surveyUrl: string }> {
    return this.withRetry(async () => {
      const startTime = Date.now();
      
      try {
        const result = await this.startSurvey(surveyId, userId);
        
        const latency = Date.now() - startTime;
        this.updateMetrics(true, latency);
        
        return result;
      } catch (error) {
        const latency = Date.now() - startTime;
        this.updateMetrics(false, latency);
        
        throw this.handleSurveyError(error);
      }
    });
  }

  async completeSurveyWithRetry(surveyId: string, userId: string, answers: any): Promise<VerificationResult> {
    return this.withRetry(async () => {
      const startTime = Date.now();
      
      try {
        const result = await this.completeSurvey(surveyId, userId, answers);
        
        const latency = Date.now() - startTime;
        this.updateMetrics(result.isValid, latency);
        
        return result;
      } catch (error) {
        const latency = Date.now() - startTime;
        this.updateMetrics(false, latency);
        
        throw this.handleSurveyError(error);
      }
    });
  }

  async checkQualificationWithRetry(surveyId: string, userId: string): Promise<boolean> {
    return this.withRetry(async () => {
      const startTime = Date.now();
      
      try {
        const result = await this.checkQualification(surveyId, userId);
        
        const latency = Date.now() - startTime;
        this.updateMetrics(true, latency);
        
        return result;
      } catch (error) {
        const latency = Date.now() - startTime;
        this.updateMetrics(false, latency);
        
        throw this.handleSurveyError(error);
      }
    });
  }

  protected handleSurveyError(error: any): IntegrationError {
    const code = this.extractErrorCode(error);
    const isRetryable = this.isRetryableSurveyError(code);
    
    return this.createIntegrationError(
      code,
      error.message || 'Survey request failed',
      isRetryable,
      { originalError: error }
    );
  }

  protected isRetryableSurveyError(code: string): boolean {
    const retryableErrors = [
      'TIMEOUT',
      'NETWORK_ERROR',
      'RATE_LIMIT',
      'HTTP_500',
      'HTTP_502',
      'HTTP_503',
      'HTTP_504',
      'NO_SURVEYS_AVAILABLE',
      'QUALIFICATION_FAILED'
    ];
    
    return retryableErrors.includes(code);
  }

  protected validateSurveyRequest(surveyId: string, userId: string): void {
    if (!userId) {
      throw new Error('User ID is required');
    }
    if (!surveyId) {
      throw new Error('Survey ID is required');
    }
  }

  protected generateSurveyReference(userId: string, surveyId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `survey-${userId}-${surveyId}-${timestamp}-${random}`;
  }

  protected checkDuplicateSurvey(userId: string, surveyId: string): boolean {
    // This would check against database for duplicate surveys
    // Placeholder implementation
    return false;
  }

  protected filterSurveysByCountry(surveys: Survey[], countryCode: string): Survey[] {
    return surveys.filter(survey => 
      survey.countryCode === countryCode || survey.countryCode === 'ALL'
    );
  }

  protected filterSurveysByLanguage(surveys: Survey[], language: string): Survey[] {
    return surveys.filter(survey => 
      survey.language === language || survey.language === 'en'
    );
  }

  protected sortSurveysByReward(surveys: Survey[]): Survey[] {
    return surveys.sort((a, b) => b.rewardAmount - a.rewardAmount);
  }

  protected calculateSurveyMatchScore(survey: Survey, user: any): number {
    let score = 0;
    
    // Reward amount (higher is better)
    score += Math.min(survey.rewardAmount / 100, 10);
    
    // Estimated time (shorter is better)
    score += Math.max(0, 10 - survey.estimatedTime / 10);
    
    // Difficulty match
    if (user.preferredDifficulty && survey.difficulty === user.preferredDifficulty) {
      score += 5;
    }
    
    return score;
  }
}