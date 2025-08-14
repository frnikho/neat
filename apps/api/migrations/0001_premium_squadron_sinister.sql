CREATE TABLE "page" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar,
	"updated_at" timestamp,
	"updated_by" varchar,
	"deleted_at" timestamp,
	"deleted_by" varchar,
	CONSTRAINT "page_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "layout" ADD COLUMN "key" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "layout" ADD COLUMN "page" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "page" ADD CONSTRAINT "page_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page" ADD CONSTRAINT "page_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page" ADD CONSTRAINT "page_deleted_by_user_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "layout" ADD CONSTRAINT "layout_page_page_id_fk" FOREIGN KEY ("page") REFERENCES "public"."page"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "layout" DROP COLUMN "description";