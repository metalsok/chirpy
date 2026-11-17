ALTER TABLE "users" RENAME COLUMN "email" TO "emaill";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_emaill_unique" UNIQUE("emaill");