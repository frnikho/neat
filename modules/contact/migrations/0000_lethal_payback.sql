CREATE TABLE "contact_result" (
	"id" varchar PRIMARY KEY NOT NULL,
	"contact_id" varchar NOT NULL,
	"status" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "contact" (
	"abcdef" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
