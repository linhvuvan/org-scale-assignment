CREATE TYPE "public"."campaign_status" AS ENUM('draft', 'scheduled', 'sent');--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"subject" text NOT NULL,
	"body" text NOT NULL,
	"status" "campaign_status" DEFAULT 'draft' NOT NULL,
	"scheduled_at" timestamp with time zone,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;