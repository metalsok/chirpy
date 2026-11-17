ALTER TABLE "users" RENAME COLUMN "emaill" TO "email";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_emaill_unique";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");