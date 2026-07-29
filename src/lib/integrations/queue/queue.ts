// ============================================
// Background Queue
// ============================================

export interface QueueJob {
  id: string;
  type: string;
  payload: any;
  priority: number;
  createdAt: Date;
  scheduledAt?: Date;
  retryCount: number;
  maxRetries: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'dead_letter';
}

export interface QueueConfig {
  maxSize: number;
  batchSize: number;
  processingInterval: number;
  retryDelay: number;
  deadLetterQueue: boolean;
  maxRetries: number;
}

export abstract class QueueProcessor {
  abstract process(job: QueueJob): Promise<void>;
  abstract canProcess(job: QueueJob): boolean;
}

export class Queue {
  private jobs: QueueJob[] = [];
  private deadLetterJobs: QueueJob[] = [];
  private config: QueueConfig;
  private processors: Map<string, QueueProcessor> = new Map();
  private isProcessing: boolean = false;
  private processingInterval: NodeJS.Timeout | null = null;

  constructor(config: Partial<QueueConfig> = {}) {
    this.config = {
      maxSize: 10000,
      batchSize: 10,
      processingInterval: 1000,
      retryDelay: 5000,
      deadLetterQueue: true,
      maxRetries: 3,
      ...config
    };
  }

  /**
   * Register job processor
   */
  registerProcessor(type: string, processor: QueueProcessor): void {
    this.processors.set(type, processor);
  }

  /**
   * Enqueue job
   */
  enqueue(type: string, payload: any, priority: number = 0, scheduledAt?: Date): string {
    if (this.jobs.length >= this.config.maxSize) {
      throw new Error(`Queue is full (max size: ${this.config.maxSize})`);
    }

    const job: QueueJob = {
      id: this.generateJobId(type),
      type,
      payload,
      priority,
      createdAt: new Date(),
      scheduledAt,
      retryCount: 0,
      maxRetries: this.config.maxRetries,
      status: 'pending'
    };

    this.jobs.push(job);
    
    // Sort by priority (higher first) and scheduled time
    this.jobs.sort((a, b) => {
      if (a.scheduledAt && b.scheduledAt) {
        const timeDiff = a.scheduledAt.getTime() - b.scheduledAt.getTime();
        if (timeDiff !== 0) return timeDiff;
      }
      return b.priority - a.priority;
    });

    // Start processing if not already running
    if (!this.isProcessing) {
      this.startProcessing();
    }

    return job.id;
  }

  /**
   * Start processing jobs
   */
  startProcessing(): void {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;
    this.processingInterval = setInterval(() => {
      this.processJobs();
    }, this.config.processingInterval);
  }

  /**
   * Stop processing jobs
   */
  stopProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    this.isProcessing = false;
  }

  /**
   * Process jobs
   */
  private async processJobs(): Promise<void> {
    if (this.jobs.length === 0) {
      return;
    }

    const batch = this.jobs.splice(0, this.config.batchSize);
    
    await Promise.all(
      batch.map(job => this.processJob(job))
    );
  }

  /**
   * Process single job
   */
  private async processJob(job: QueueJob): Promise<void> {
    const processor = this.processors.get(job.type);
    
    if (!processor) {
      console.error(`No processor registered for job type: ${job.type}`);
      job.status = 'failed';
      this.deadLetterJobs.push(job);
      return;
    }

    // Check if job is scheduled for later
    if (job.scheduledAt && job.scheduledAt.getTime() > Date.now()) {
      this.jobs.push(job);
      return;
    }

    job.status = 'processing';

    try {
      await processor.process(job);
      job.status = 'completed';
    } catch (error) {
      console.error(`Job ${job.id} failed:`, error);
      
      job.retryCount++;
      
      if (job.retryCount < job.maxRetries) {
        // Retry with exponential backoff
        job.status = 'pending';
        job.scheduledAt = new Date(Date.now() + this.config.retryDelay * Math.pow(2, job.retryCount));
        this.jobs.push(job);
      } else {
        job.status = 'failed';
        
        if (this.config.deadLetterQueue) {
          this.deadLetterJobs.push(job);
        }
      }
    }
  }

  /**
   * Generate unique job ID
   */
  private generateJobId(type: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `${type}-${timestamp}-${random}`;
  }

  /**
   * Get queue size
   */
  size(): number {
    return this.jobs.length;
  }

  /**
   * Get dead letter queue size
   */
  deadLetterSize(): number {
    return this.deadLetterJobs.length;
  }

  /**
   * Get job by ID
   */
  getJob(jobId: string): QueueJob | undefined {
    return this.jobs.find(j => j.id === jobId) || this.deadLetterJobs.find(j => j.id === jobId);
  }

  /**
   * Get jobs by type
   */
  getJobsByType(type: string): QueueJob[] {
    return this.jobs.filter(j => j.type === type);
  }

  /**
   * Retry failed job
   */
  retryJob(jobId: string): boolean {
    const jobIndex = this.deadLetterJobs.findIndex(j => j.id === jobId);
    
    if (jobIndex === -1) {
      return false;
    }

    const job = this.deadLetterJobs[jobIndex];
    job.retryCount = 0;
    job.status = 'pending';
    job.scheduledAt = undefined;
    
    this.deadLetterJobs.splice(jobIndex, 1);
    this.jobs.push(job);
    
    return true;
  }

  /**
   * Clear completed jobs
   */
  clearCompleted(): void {
    this.jobs = this.jobs.filter(j => j.status !== 'completed');
  }

  /**
   * Clear dead letter jobs
   */
  clearDeadLetter(): void {
    this.deadLetterJobs = [];
  }

  /**
   * Get queue statistics
   */
  getStatistics(): {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    deadLetter: number;
    totalProcessed: number;
  } {
    const pending = this.jobs.filter(j => j.status === 'pending').length;
    const processing = this.jobs.filter(j => j.status === 'processing').length;
    const completed = this.jobs.filter(j => j.status === 'completed').length;
    const failed = this.jobs.filter(j => j.status === 'failed').length;
    const deadLetter = this.deadLetterJobs.length;

    return {
      pending,
      processing,
      completed,
      failed,
      deadLetter,
      totalProcessed: completed + failed + deadLetter
    };
  }

  /**
   * Clear all jobs
   */
  clear(): void {
    this.jobs = [];
    this.deadLetterJobs = [];
  }

  /**
   * Shutdown queue
   */
  shutdown(): void {
    this.stopProcessing();
    this.clear();
  }
}