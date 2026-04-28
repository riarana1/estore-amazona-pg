ALTER TABLE "order" RENAME TO "orders";--> statement-breakpoint
ALTER TABLE "orderItems" DROP CONSTRAINT "orderItems_orderId_order_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "order_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;