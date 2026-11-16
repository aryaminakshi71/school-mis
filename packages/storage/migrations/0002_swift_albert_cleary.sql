CREATE TABLE "inventory_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"unit" text DEFAULT 'pcs' NOT NULL,
	"threshold" integer DEFAULT 0 NOT NULL,
	"price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"status" varchar(30) DEFAULT 'in-stock' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "inventory_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supplier" text NOT NULL,
	"items" integer DEFAULT 0 NOT NULL,
	"amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"date" date NOT NULL,
	"notes" text DEFAULT '',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "school_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"school_name" text NOT NULL,
	"short_name" text NOT NULL,
	"school_address" text DEFAULT '',
	"phone_number" text DEFAULT '',
	"support_email" text DEFAULT '',
	"website_url" text DEFAULT '',
	"logo_url" text DEFAULT '',
	"primary_color" text DEFAULT '#047857',
	"secondary_color" text DEFAULT '#17332a',
	"receipt_footer" text DEFAULT '',
	"mobile_app_name" text DEFAULT 'School MIS',
	"updated_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
