ALTER TABLE "widget" ADD COLUMN "key" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "widget" ADD CONSTRAINT "widget_key_unique" UNIQUE("key");