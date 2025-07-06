export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          category: string | null;
          coordinates: unknown | null;
          created_at: string;
          creator_id: string | null;
          date_time: string;
          description: string | null;
          end_time: string | null;
          id: string;
          image_url: string | null;
          is_featured: boolean | null;
          location: string | null;
          status: string | null;
          tags: string[] | null;
          title: string;
          town: string | null;
          updated_at: string | null;
          view_count: number | null;
        };
        Insert: {
          category?: string | null;
          coordinates?: unknown | null;
          created_at?: string;
          creator_id?: string | null;
          date_time: string;
          description?: string | null;
          end_time?: string | null;
          id?: string;
          image_url?: string | null;
          is_featured?: boolean | null;
          location?: string | null;
          status?: string | null;
          tags?: string[] | null;
          title: string;
          town?: string | null;
          updated_at?: string | null;
          view_count?: number | null;
        };
        Update: {
          category?: string | null;
          coordinates?: unknown | null;
          created_at?: string;
          creator_id?: string | null;
          date_time?: string;
          description?: string | null;
          end_time?: string | null;
          id?: string;
          image_url?: string | null;
          is_featured?: boolean | null;
          location?: string | null;
          status?: string | null;
          tags?: string[] | null;
          title?: string;
          town?: string | null;
          updated_at?: string | null;
          view_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "events_creator_id_fkey";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "events_town_fkey";
            columns: ["town"];
            isOneToOne: false;
            referencedRelation: "towns";
            referencedColumns: ["slug"];
          },
        ];
      };
      comments: {
        Row: {
          content: string;
          created_at: string;
          event_id: string | null;
          id: string;
          is_deleted: boolean | null;
          parent_id: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          content: string;
          created_at?: string;
          event_id?: string | null;
          id?: string;
          is_deleted?: boolean | null;
          parent_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string;
          event_id?: string | null;
          id?: string;
          is_deleted?: boolean | null;
          parent_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "comments_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
        ];
      };
      event_interactions: {
        Row: {
          created_at: string;
          event_id: string | null;
          id: string;
          interaction_type: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          event_id?: string | null;
          id?: string;
          interaction_type: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          event_id?: string | null;
          id?: string;
          interaction_type?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "event_interactions_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "event_interactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          badges: Json | null;
          created_at: string;
          display_name: string | null;
          id: string;
          level: number | null;
          town: string | null;
          updated_at: string | null;
          username: string | null;
          xp: number | null;
        };
        Insert: {
          avatar_url?: string | null;
          badges?: Json | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          level?: number | null;
          town?: string | null;
          updated_at?: string | null;
          username?: string | null;
          xp?: number | null;
        };
        Update: {
          avatar_url?: string | null;
          badges?: Json | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          level?: number | null;
          town?: string | null;
          updated_at?: string | null;
          username?: string | null;
          xp?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_town_fkey";
            columns: ["town"];
            isOneToOne: false;
            referencedRelation: "towns";
            referencedColumns: ["slug"];
          },
        ];
      };
      towns: {
        Row: {
          coordinates: unknown | null;
          created_at: string;
          id: string;
          name: string;
          population: number | null;
          region: string | null;
          slug: string;
        };
        Insert: {
          coordinates?: unknown | null;
          created_at?: string;
          id?: string;
          name: string;
          population?: number | null;
          region?: string | null;
          slug: string;
        };
        Update: {
          coordinates?: unknown | null;
          created_at?: string;
          id?: string;
          name?: string;
          population?: number | null;
          region?: string | null;
          slug?: string;
        };
        Relationships: [];
      };
      user_activities: {
        Row: {
          activity_type: string;
          created_at: string;
          event_id: string | null;
          id: string;
          metadata: Json | null;
          points_earned: number | null;
          user_id: string | null;
        };
        Insert: {
          activity_type: string;
          created_at?: string;
          event_id?: string | null;
          id?: string;
          metadata?: Json | null;
          points_earned?: number | null;
          user_id?: string | null;
        };
        Update: {
          activity_type?: string;
          created_at?: string;
          event_id?: string | null;
          id?: string;
          metadata?: Json | null;
          points_earned?: number | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_activities_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_activities_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_trending_events: {
        Args: {
          town_filter?: string;
        };
        Returns: [
          {
            event_id: string;
            score: number;
          },
        ];
      };
      update_user_xp: {
        Args: {
          user_id: string;
          points: number;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<TableName extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][TableName]["Row"];

export type Enums<EnumName extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][EnumName];
