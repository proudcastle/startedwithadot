export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          is_admin?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      proposals: {
        Row: {
          id: string;
          user_id: string;
          text: string;
          status: Database["public"]["Enums"]["proposal_status"];
          vote_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          text: string;
          status?: Database["public"]["Enums"]["proposal_status"];
          vote_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          text?: string;
          status?: Database["public"]["Enums"]["proposal_status"];
          vote_count?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "proposals_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      votes: {
        Row: {
          id: string;
          user_id: string;
          proposal_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          proposal_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          proposal_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "votes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "votes_proposal_id_fkey";
            columns: ["proposal_id"];
            isOneToOne: false;
            referencedRelation: "proposals";
            referencedColumns: ["id"];
          },
        ];
      };
      versions: {
        Row: {
          id: string;
          version_number: string;
          title: string;
          description: string | null;
          proposal_id: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          version_number: string;
          title: string;
          description?: string | null;
          proposal_id?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          version_number?: string;
          title?: string;
          description?: string | null;
          proposal_id?: string | null;
          created_by?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "versions_proposal_id_fkey";
            columns: ["proposal_id"];
            isOneToOne: false;
            referencedRelation: "proposals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "versions_created_by_fkey";
            columns: ["created_by"];
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
      [_ in never]: never;
    };
    Enums: {
      proposal_status: "open" | "accepted" | "implemented" | "rejected";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
