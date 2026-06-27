CREATE TABLE `ai_message_classifications` (
	`id` varchar(36) NOT NULL DEFAULT 'UUID()',
	`messageId` varchar(36) NOT NULL,
	`classification` varchar(100) NOT NULL,
	`confidence` decimal(3,2),
	`aiResponse` text,
	`processedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_message_classifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` varchar(36) NOT NULL DEFAULT 'UUID()',
	`clientName` text NOT NULL,
	`clientPhone` varchar(20) NOT NULL,
	`eventDate` timestamp NOT NULL,
	`eventType` varchar(100),
	`venueName` text,
	`locationLink` text,
	`receptionTime` varchar(50),
	`hostOne` text,
	`hostTwo` text,
	`brideName` text,
	`groomName` text,
	`notes` text,
	`invitationTemplateSettings` json,
	`reminderSettings` json,
	`entryCardSettings` json,
	`paymentDetails` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `checkins` (
	`id` varchar(36) NOT NULL DEFAULT 'UUID()',
	`guestId` varchar(36) NOT NULL,
	`bookingId` varchar(36) NOT NULL,
	`guestCardId` varchar(36),
	`checkedInAt` timestamp NOT NULL DEFAULT (now()),
	`scannerUserId` int,
	`deviceInfo` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `checkins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `client_portal_accounts` (
	`id` varchar(36) NOT NULL DEFAULT 'UUID()',
	`bookingId` varchar(36) NOT NULL,
	`username` varchar(100) NOT NULL,
	`passwordHash` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_portal_accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `client_portal_accounts_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `employee_assignments` (
	`id` varchar(36) NOT NULL DEFAULT 'UUID()',
	`employeeId` int NOT NULL,
	`bookingId` varchar(36) NOT NULL,
	`assignedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `employee_assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `error_logs` (
	`id` varchar(36) NOT NULL DEFAULT 'UUID()',
	`source` varchar(100),
	`errorMessage` text NOT NULL,
	`stackTrace` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`context` json,
	CONSTRAINT `error_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `guest_cards` (
	`id` varchar(36) NOT NULL DEFAULT 'UUID()',
	`guestId` varchar(36) NOT NULL,
	`bookingId` varchar(36) NOT NULL,
	`cardQrValue` varchar(500) NOT NULL,
	`cardShortCode` varchar(50) NOT NULL,
	`isCheckedIn` boolean DEFAULT false,
	`checkedInAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `guest_cards_id` PRIMARY KEY(`id`),
	CONSTRAINT `guest_cards_cardQrValue_unique` UNIQUE(`cardQrValue`),
	CONSTRAINT `guest_cards_cardShortCode_unique` UNIQUE(`cardShortCode`)
);
--> statement-breakpoint
CREATE TABLE `guests` (
	`id` varchar(36) NOT NULL DEFAULT 'UUID()',
	`bookingId` varchar(36) NOT NULL,
	`guestName` text NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`cardsCount` int NOT NULL DEFAULT 1,
	`sequenceNumber` int,
	`shortCode` varchar(50),
	`qrValue` varchar(500),
	`notes` text,
	`rsvpStatus` enum('pending','confirmed','declined','sent','delivered','read','failed','checked-in') NOT NULL DEFAULT 'pending',
	`confirmedCount` int DEFAULT 0,
	`declinedCount` int DEFAULT 0,
	`pendingCount` int DEFAULT 1,
	`invitationSentAt` timestamp,
	`deliveredAt` timestamp,
	`readAt` timestamp,
	`repliedAt` timestamp,
	`checkedInAt` timestamp,
	`lastMessageAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `guests_id` PRIMARY KEY(`id`),
	CONSTRAINT `guests_shortCode_unique` UNIQUE(`shortCode`),
	CONSTRAINT `guests_qrValue_unique` UNIQUE(`qrValue`)
);
--> statement-breakpoint
CREATE TABLE `message_status_logs` (
	`id` varchar(36) NOT NULL DEFAULT 'UUID()',
	`messageId` varchar(36),
	`metaMessageId` varchar(100) NOT NULL,
	`status` enum('sent','delivered','read','failed') NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`errorDetails` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `message_status_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` varchar(36) NOT NULL DEFAULT 'UUID()',
	`guestId` varchar(36),
	`bookingId` varchar(36),
	`phoneNumber` varchar(20) NOT NULL,
	`metaMessageId` varchar(100),
	`messageType` varchar(50) NOT NULL,
	`messageContent` json,
	`mediaUrl` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`isAdminVisible` boolean DEFAULT true,
	`isClientVisible` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`),
	CONSTRAINT `messages_metaMessageId_unique` UNIQUE(`metaMessageId`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` varchar(36) NOT NULL DEFAULT 'UUID()',
	`bookingId` varchar(36) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`paymentType` varchar(50),
	`status` enum('pending','completed','refunded'),
	`transactionId` varchar(100),
	`paymentDate` timestamp NOT NULL DEFAULT (now()),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `templates` (
	`id` varchar(36) NOT NULL DEFAULT 'UUID()',
	`templateName` varchar(100) NOT NULL,
	`language` varchar(10) NOT NULL DEFAULT 'en_US',
	`headerType` enum('none','image','document'),
	`variables` json,
	`buttonPayloadFormat` text,
	`supportsImage` boolean DEFAULT false,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `templates_id` PRIMARY KEY(`id`),
	CONSTRAINT `templates_templateName_unique` UNIQUE(`templateName`)
);
--> statement-breakpoint
CREATE TABLE `webhook_logs` (
	`id` varchar(36) NOT NULL DEFAULT 'UUID()',
	`eventType` varchar(100) NOT NULL,
	`payload` json NOT NULL,
	`receivedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `webhook_logs_id` PRIMARY KEY(`id`)
);
