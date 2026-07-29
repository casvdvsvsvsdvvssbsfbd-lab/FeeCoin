// ============================================
// Support Service
// Production-ready support system
// ============================================

import { supabase } from '../supabase/client';
import { useSupportStore } from '../stores/support-store';
import { useAnalytics } from '../analytics';

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  userId: string;
  message: string;
  isFromSupport: boolean;
  attachments?: string[];
  createdAt: string;
}

class SupportService {
  private analytics = useAnalytics();

  // Fetch user's tickets
  async getTickets(userId: string): Promise<SupportTicket[]> {
    try {
      const { data: tickets, error: ticketsError } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (ticketsError) throw ticketsError;

      // Fetch messages for each ticket
      const ticketsWithMessages = await Promise.all(
        tickets.map(async (ticket) => {
          const { data: messages } = await supabase
            .from('support_messages')
            .select('*')
            .eq('ticket_id', ticket.id)
            .order('created_at', { ascending: true });

          return {
            ...ticket,
            messages: messages || [],
          };
        })
      );

      return ticketsWithMessages;
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      return [];
    }
  }

  // Fetch single ticket with messages
  async getTicket(ticketId: string, userId: string): Promise<SupportTicket | null> {
    try {
      const { data: ticket, error: ticketError } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', ticketId)
        .eq('user_id', userId)
        .single();

      if (ticketError || !ticket) return null;

      const { data: messages } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      return {
        ...ticket,
        messages: messages || [],
      };
    } catch (error) {
      console.error('Failed to fetch ticket:', error);
      return null;
    }
  }

  // Create new ticket
  async createTicket(userId: string, ticket: {
    subject: string;
    category: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    message: string;
  }): Promise<string | null> {
    try {
      // Create ticket
      const { data: newTicket, error: ticketError } = await supabase
        .from('support_tickets')
        .insert({
          user_id: userId,
          subject: ticket.subject,
          category: ticket.category,
          priority: ticket.priority,
          status: 'open',
        })
        .select()
        .single();

      if (ticketError) throw ticketError;

      // Add first message
      const { error: messageError } = await supabase
        .from('support_messages')
        .insert({
          ticket_id: newTicket.id,
          user_id: userId,
          message: ticket.message,
          is_from_support: false,
        });

      if (messageError) throw messageError;

      this.analytics.trackEvent('support_ticket_created', {
        ticketId: newTicket.id,
        category: ticket.category,
        priority: ticket.priority,
      });

      return newTicket.id;
    } catch (error) {
      console.error('Failed to create ticket:', error);
      return null;
    }
  }

  // Send message to ticket
  async sendMessage(ticketId: string, userId: string, message: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('support_messages')
        .insert({
          ticket_id: ticketId,
          user_id: userId,
          message,
          is_from_support: false,
        });

      if (error) throw error;

      // Update ticket timestamp
      await supabase
        .from('support_tickets')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', ticketId);

      this.analytics.trackEvent('support_message_sent', {
        ticketId,
      });

      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }

  // Close ticket
  async closeTicket(ticketId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: 'closed' })
        .eq('id', ticketId)
        .eq('user_id', userId);

      if (error) throw error;

      this.analytics.trackEvent('support_ticket_closed', { ticketId });
      return true;
    } catch (error) {
      console.error('Failed to close ticket:', error);
      return false;
    }
  }

  // Reopen ticket
  async reopenTicket(ticketId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: 'open' })
        .eq('id', ticketId)
        .eq('user_id', userId);

      if (error) throw error;


      this.analytics.trackEvent('support_ticket_reopened', { ticketId });
      return true;
    } catch (error) {
      console.error('Failed to reopen ticket:', error);
      return false;
    }
  }
}

// Singleton instance
export const supportService = new SupportService();
