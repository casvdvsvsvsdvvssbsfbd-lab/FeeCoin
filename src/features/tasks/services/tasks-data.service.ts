// ============================================
// Tasks Screen Data Service
// Connects UI to real production data
// ============================================

import { supabase } from '../../../lib/supabase/client';
import { useTaskStore } from '../../../lib/stores/task-store';
import { useWalletStore } from '../../../lib/stores/wallet-store';
import { useAnalytics } from '../../../lib/analytics';

export interface TaskData {
  id: string;
  title: string;
  description: string;
  reward: number;
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  provider: string;
  completionRate: number;
  type: 'survey' | 'offer' | 'ad' | 'mission';
  status: 'active' | 'completed' | 'claimed';
  icon: string;
  createdAt: string;
}

class TasksDataService {
  private analytics = useAnalytics();

  // Fetch available tasks from providers
  async getAvailableTasks(userId: string): Promise<TaskData[]> {
    try {
      // Fetch from provider_offers table
      const { data: offers, error } = await supabase
        .from('provider_offers')
        .select('*')
        .eq('status', 'active')
        .order('priority', { ascending: false });

      if (error) throw error;

      return offers.map((offer: any) => ({
        id: offer.id,
        title: offer.title,
        description: offer.description,
        reward: offer.reward_amount,
        estimatedTime: offer.estimated_time || '5 min',
        difficulty: offer.difficulty || 'medium',
        provider: offer.provider_name,
        completionRate: offer.completion_rate || 0,
        type: offer.offer_type,
        status: 'active',
        icon: this.getIconForType(offer.offer_type),
        createdAt: offer.created_at,
      }));
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      return [];
    }
  }

  // Fetch user's completed tasks
  async getCompletedTasks(userId: string): Promise<TaskData[]> {
    try {
      const { data, error } = await supabase
        .from('user_tasks')
        .select('*, provider_offers(*)')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      if (error) throw error;

      return data.map((task: any) => ({
        id: task.id,
        title: task.provider_offers.title,
        description: task.provider_offers.description,
        reward: task.reward_earned,
        estimatedTime: task.provider_offers.estimated_time || '5 min',
        difficulty: task.provider_offers.difficulty || 'medium',
        provider: task.provider_offers.provider_name,
        completionRate: task.provider_offers.completion_rate || 0,
        type: task.provider_offers.offer_type,
        status: 'completed',
        icon: this.getIconForType(task.provider_offers.offer_type),
        createdAt: task.created_at,
      }));
    } catch (error) {
      console.error('Failed to fetch completed tasks:', error);
      return [];
    }
  }

  // Complete a task
  async completeTask(taskId: string, userId: string): Promise<number> {
    try {
      // Get task details
      const { data: task, error: taskError } = await supabase
        .from('provider_offers')
        .select('*')
        .eq('id', taskId)
        .single();

      if (taskError) throw taskError;

      // Calculate reward using FC Economy Engine
      const rewardAmount = task.reward_amount;

      // Create user task record
      const { error: userTaskError } = await supabase.from('user_tasks').insert({
        user_id: userId,
        offer_id: taskId,
        status: 'completed',
        reward_earned: rewardAmount,
        completed_at: new Date().toISOString(),
      });

      if (userTaskError) throw userTaskError;

      // Record transaction
      const { error: txError } = await supabase.from('transactions').insert({
        user_id: userId,
        type: 'reward',
        amount: rewardAmount,
        status: 'completed',
        description: `Task completed - ${task.title}`,
        metadata: {
          type: 'task',
          provider: task.provider_name,
          taskId,
        },
      });

      if (txError) throw txError;

      // Update wallet balance
      const { error: walletError } = await supabase.rpc('increment_wallet_balance', {
        p_user_id: userId,
        p_amount: rewardAmount,
      });

      if (walletError) throw walletError;

      // Track analytics
      this.analytics.trackRewardEarned('task', rewardAmount, 'FC');
      this.analytics.trackEvent('task_completed', {
        taskId,
        provider: task.provider_name,
        reward: rewardAmount,
      });

      // Update task store
      const taskStore = useTaskStore.getState();
      taskStore.completeTask(taskId);

      // Update wallet store
      const walletStore = useWalletStore.getState();
      walletStore.updateBalance(rewardAmount);

      return rewardAmount;
    } catch (error) {
      console.error('Failed to complete task:', error);
      return 0;
    }
  }

  // Load all tasks data
  async loadTasksData(userId: string): Promise<{
    availableTasks: TaskData[];
    completedTasks: TaskData[];
  }> {
    const [availableTasks, completedTasks] = await Promise.all([
      this.getAvailableTasks(userId),
      this.getCompletedTasks(userId),
    ]);

    return {
      availableTasks,
      completedTasks,
    };
  }

  // Refresh tasks
  async refreshTasks(userId: string): Promise<void> {
    const data = await this.loadTasksData(userId);
    
    const taskStore = useTaskStore.getState();
    taskStore.setTasks([...data.availableTasks, ...data.completedTasks]);
  }

  // Get icon for task type
  private getIconForType(type: string): string {
    const icons: Record<string, string> = {
      survey: '📊',
      offer: '📦',
      ad: '📺',
      mission: '🎯',
    };
    return icons[type] || '📋';
  }

  // Track task view
  trackTaskView(taskId: string, provider: string): void {
    this.analytics.trackEvent('task_viewed', {
      taskId,
      provider,
    });
  }
}

// Singleton instance
export const tasksDataService = new TasksDataService();